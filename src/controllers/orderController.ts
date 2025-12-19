import { Request, Response } from "express";
import getRequestData from "../utils/getRequestData";
import { orderCreateSchemaBody, ordersGetAllSchemaQuery, ordersGetDetailSchemaParams, orderUpdateStatusSchemaBody, orderUpdateStatusSchemaParams } from "../Schemas/orderSchema";
import { StatusCodes } from "http-status-codes";
import { getAllOrders, getUniqueOrder, updateOrder } from "../models/orderModel";
import { getUniqueCart } from "../models/cartModel";
import { getUniqueShippingService } from "../models/shippingServiceModel";
import { getUniquePaymentService } from "../models/paymentServiceModel";
import { prisma } from "../libs/prisma";
import { PAYMENT_APPROVAL_EXPIRE, SHIPPING_ESTIMATE_HOURS } from "../configs/variables";
import { updatePayment } from "../models/paymentModel";
import { getUniqueUser, updateUser } from "../models/userModel";
import { createBalanceHistory } from "../models/balanceHistoryModel";
import { createShipping, getUniqueShipping, updateShipping } from "../models/shippingModel";

export const orderGetAll = async (req: Request, res: Response) => {
    try {
        const { queryData } = getRequestData({
            querySchema: ordersGetAllSchemaQuery,
        }, req)

        const userId = req.session.user!.id
        const { take, cursor } = queryData

        const orders = await getAllOrders(take, {
            userId
        }, cursor)

        return res.status(StatusCodes.OK).json({
            data: orders
        })
    } catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error"
        })
    }
}

export const orderGetDetail = async (req: Request, res: Response) => {
    try {
        const { paramsData } = getRequestData({ paramsSchema: ordersGetDetailSchemaParams }, req)
        const userId = req.session.user!.id
        const { orderId } = paramsData

        // Assuming getOrderDetail is a function that fetches order details
        const orderDetail = await getUniqueOrder({ id: orderId, userId })

        if (!orderDetail) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Order not found"
            })
        }
        return res.status(StatusCodes.OK).json({
            data: orderDetail
        })

    } catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error"
        })
    }
}

export const orderCreate = async (req: Request, res: Response) => {
    try {
        const { bodyData } = getRequestData({
            bodySchema: orderCreateSchemaBody
        }, req)

        const { shippingServiceId, shipping } = bodyData
        const userId = req.session.user!.id

        const cart = await getUniqueCart({ userId })

        if (!cart || cart.items.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Cart is empty" });
        }

        const subtotal = cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const shippingService = await getUniqueShippingService({ id: shippingServiceId })
        if (!shippingService) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid shipping service" });
        }


        const shippingCost = shippingService.baseCost;
        const totalAmount = subtotal + shippingCost;

        const user = await getUniqueUser({ id: userId })

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User not found" });
        }

        if (user.balance < totalAmount) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Insufficient balance" });
        }

        const order = await prisma.$transaction(async (tx) => {
            const paymentDueDate = new Date(Date.now() + PAYMENT_APPROVAL_EXPIRE);
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    subtotal,
                    shippingCost,
                    totalAmount,
                    approvalExpiredAt: paymentDueDate
                },
            });

            // 5️⃣ ORDER ITEMS
            await tx.orderItem.createMany({
                data: cart.items.map((item) => ({
                    orderId: newOrder.id,
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    variant: item.variant,
                })),
            });

            const currentBalace = user.balance;
            const newBalance = currentBalace - totalAmount;

            await tx.balanceHistory.create({
                data: {
                    userId: userId,
                    amount: -totalAmount,
                    balanceBefore: currentBalace,
                    balanceAfter: newBalance,
                    description: `Payment for order #${newOrder.id}`,
                    referenceType: "ORDER",
                    referenceId: newOrder.id,
                    type: "PURCHASE"
                }
            })


            // 6️⃣ PAYMENT
            await tx.user.update({
                where: { id: userId },
                data: {
                    balance: newBalance
                }
            })
            const estimatedDelivery = new Date(Date.now() + (shippingService.estimatedDeliveryDays * SHIPPING_ESTIMATE_HOURS));

            await tx.shipping.create({
                data: {
                    orderId: newOrder.id,
                    shippingServiceId,
                    receiverName: shipping.receiverName,
                    phone: shipping.phone,
                    address: shipping.address,
                    shippingCost,
                    estimatedDelivery,

                },
            });

            const invoice = await tx.invoice.create({
                data:{
                    orderId:newOrder.id,
                    invoiceDate:new Date(),
                    customerEmail: user.email,
                    customerName: user.name,
                    billingAddress: shipping.address,
                    dueDate:estimatedDelivery,
                    subtotal: subtotal,
                    taxAmount:0,
                    taxRate:0,
                    shippingAddress: shipping.address,
                    shippingCost: shippingCost,
                    totalAmount: totalAmount
                }
            })

            await tx.invoiceItem.createMany({
                data: cart.items.map((item) => ({
                    invoiceId: invoice.id,
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    variant: item.variant,
                })),
            });

            // 8️⃣ CLEAR CART
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
            return newOrder;
        })

        return res.status(StatusCodes.CREATED).json({
            message: "Order created successfully",
            data: {
                orderId: order.id
            }
        })


    } catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error"
        })
    }
}

export const orderUpdateStatus = async (req: Request, res: Response) => {
    try {
        const { paramsData, bodyData } = getRequestData({
            paramsSchema: orderUpdateStatusSchemaParams,
            bodySchema: orderUpdateStatusSchemaBody
        }, req)

        const { orderId } = paramsData
        const { status } = bodyData
        const userId = req.session.user!.id

        const order = await getUniqueOrder({ id: orderId })
        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Order not found"
            })
        }

        const user = await getUniqueUser({ id: userId })
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found"
            })
        }


        const currentStatus = order.status
        const nextStatus = order.nextStatus

        if (nextStatus === currentStatus) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Order status cannot be updated further"
            })
        }

        if (!order.payment) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Order does not have an associated payment"
            })
        }


        const currentTime = new Date()
        const approvalExpiredAt = order.approvalExpiredAt
        // canceled by system due to expired approval time
        if (currentTime > approvalExpiredAt) {
            await updateOrder({
                status: "PYMT_CNC",
                cancelledAt: currentTime,
                nextStatus: "PYMT_CNC"
            }, orderId)

            await updateUser({
                balance: {
                    increment: order.totalAmount
                }
            }, userId)

            await createBalanceHistory({
                amount: order.totalAmount,
                balanceBefore: user.balance,
                balanceAfter: user.balance + order.totalAmount,
                description: `Refund for expired order #${order.id}`,
                referenceType: "SYSTEM",
                referenceId: order.id,
                type: "REFUND",
                userId: userId
            })

            return res.status(StatusCodes.OK).json({
                message: "Order expired successfully"
            })
        }

        switch (status) {
            case "PYMT_CNC":
                //Payment cancelled by seller
                if (currentStatus !== "PYMT_PDG" && nextStatus !== "PYMT_SCS") {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: "Only orders with status 'PYMT_PDG' can be cancelled"
                    })
                }

                await updateUser({
                    balance: {
                        increment: order.totalAmount
                    }
                }, userId)

                await updateOrder({
                    status: "PYMT_CNC",
                    cancelledAt: currentTime,
                    nextStatus: "PYMT_CNC"

                }, orderId)

                await createBalanceHistory({
                    amount: order.totalAmount,
                    balanceBefore: user.balance,
                    balanceAfter: user.balance + order.totalAmount,
                    description: `Refund for expired order #${order.id}`,
                    referenceType: "SYSTEM",
                    referenceId: order.id,
                    type: "REFUND",
                    userId: userId
                })

                return res.status(StatusCodes.OK).json({
                    message: "Order cancelled successfully"
                })

            case "ORDR_CNC":
                //Order cancelled by buyer
                if (currentStatus === "PYMT_SCS" && nextStatus === "SHIP_PDG" || currentStatus === "PYMT_PDG" && nextStatus === "PYMT_SCS" || currentStatus === "SHIP_PDG" && nextStatus === "SHIP_SHP") {
                    await updateOrder({
                        status: "ORDR_CNC",
                        cancelledAt: currentTime,
                    }, orderId)

                    return res.status(StatusCodes.OK).json({
                        message: "Order cancelled successfully"
                    })
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: "Only orders with status 'PYMT_SCS', 'SHIP_PDG' or 'PYMT_PDG' can be cancelled"
                    })
                }

            case "PYMT_SCS":
                if (currentStatus === "PYMT_PDG" && nextStatus === "PYMT_SCS") {
                    await updateOrder({
                        status: "PYMT_SCS",
                        approvedAt: currentTime,
                        nextStatus: "SHIP_PDG"
                    }, orderId)
                    return res.status(StatusCodes.OK).json({
                        message: "Order payment approved successfully"
                    })

                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: "Only orders with status 'PYMT_PDG' can be updated to 'PYMT_SCS'"
                    })
                }
            case "SHIP_PDG":
                if (currentStatus === "PYMT_SCS" && nextStatus === "SHIP_PDG") {
                    await updateOrder({
                        status: "SHIP_PDG",
                        nextStatus: "SHIP_SHP"
                    }, orderId)

                    await updateShipping({
                        status: "PENDING"
                    }, order.shipping!.id)

                    return res.status(StatusCodes.OK).json({
                        message: "Order status updated to 'SHIP_PDG' successfully"
                    })
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: "Only orders with status 'PYMT_SCS' can be updated to 'SHIP_PDG'"
                    })
                }

            case "SHIP_SHP":
                if (currentStatus === "SHIP_PDG" && nextStatus === "SHIP_SHP") {
                    await updateOrder({
                        status: "SHIP_SHP",
                        nextStatus: "SHIP_DLV"
                    }, orderId)

                    const shippingService = await getUniqueShippingService({ id: order.shipping?.shippingServiceId })

                    if (!shippingService) {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            message: "Invalid shipping service"
                        })
                    }

                    await updateShipping({
                        status: "SHIPPED",
                        trackingNumber: generateTrackShippingNumber(shippingService?.courier, shippingService?.service)
                    }, order.shipping!.id)

                    return res.status(StatusCodes.OK).json({
                        message: "Order status updated to 'SHIP_SHP' successfully"
                    })
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: "Only orders with status 'SHIP_PDG' can be updated to 'SHIP_SHP'"
                    })
                }
            case "SHIP_DLV":
                if (currentStatus === "SHIP_SHP" && nextStatus === "SHIP_DLV") {
                    await updateOrder({
                        status: "SHIP_DLV",
                        nextStatus: "SHIP_DLV"
                    }, orderId)

                    await updateShipping({
                        status: "DELIVERED"
                    }, order.shipping!.id)

                    return res.status(StatusCodes.OK).json({
                        message: "Order status updated to 'SHIP_DLV' successfully"
                    })
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: "Only orders with status 'SHIP_SHP' can be updated to 'SHIP_DLV'"
                    })
                }
            default:
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid status update"
                })

        }



    } catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error"
        })
    }
}

export const sellerApproveRefund = async (req: Request, res: Response) => {
    try {
        // Implementation for seller approving refund
        return res.status(StatusCodes.NOT_IMPLEMENTED).json({
            message: "Not implemented yet"
        })
    } catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error"
        })
    }
}
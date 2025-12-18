import { Request, Response } from "express";
import getRequestData from "../utils/getRequestData";
import { orderCreateSchemaBody, ordersGetAllSchemaQuery, ordersGetDetailSchemaParams } from "../Schemas/orderSchema";
import { StatusCodes } from "http-status-codes";
import { getAllOrders, getUniqueOrder } from "../models/orderModel";
import { getUniqueCart } from "../models/cartModel";
import { getUniqueShippingService } from "../models/shippingServiceModel";
import { getUniquePaymentService } from "../models/paymentServiceModel";
import { prisma } from "../libs/prisma";

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

        const { paymentServiceId, shippingServiceId, shipping } = bodyData
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

        const paymentService = await getUniquePaymentService({ id: paymentServiceId })
        if (!paymentService) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid payment service" });
        }

        const shippingCost = shippingService.baseCost;
        const totalAmount = subtotal + shippingCost;

        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    subtotal,
                    shippingCost,
                    totalAmount,
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


            await tx.payment.create({
                data: {
                    orderId: newOrder.id,
                    paymentServiceId,
                    amount: totalAmount,
                },
            });

            await tx.shipping.create({
                data: {
                    orderId: newOrder.id,
                    shippingServiceId,
                    receiverName: shipping.receiverName,
                    phone: shipping.phone,
                    address: shipping.address,
                    shippingCost,
                },
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
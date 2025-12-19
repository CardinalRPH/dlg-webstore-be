import { OrderCreateInput, OrderUpdateInput, OrderWhereInput, OrderWhereUniqueInput } from "../../generated/prisma/models";
import { prisma } from "../libs/prisma";

export const getUniqueOrder = async (where: OrderWhereUniqueInput) => {
    try {
        const order = await prisma.order.findUnique({
            where,
            include: {
                payment: true,
                shipping: true
            }
        })
        if (!order) {
            return null
        }
        return order
    } catch (error) {
        throw error
    }
}

export const getAllOrders = async (limit = 50, where?: OrderWhereInput, cursor?: string) => {
    try {
        const orders = await prisma.order.findMany({
            take: limit,
            cursor: cursor ? { id: cursor } : undefined,
            where,
            orderBy: {
                date: "desc"
            }
        })
        const hasNextPage = orders.length > limit;
        const data = hasNextPage ? orders.slice(0, limit) : orders;

        return {
            data,
            pagination: {
                limit,
                nextCursor: hasNextPage ? data[data.length - 1].id : undefined,
                hasNextPage,
            },
        };
    } catch (error) {
        throw error
    }
}

export const addOrder = async (data: OrderCreateInput) => {
    try {
        return await prisma.order.create({
            data
        })
    } catch (error) {
        throw error
    }
}

export const updateOrder = async (data: OrderUpdateInput, id: string) => {
    try {
        return await prisma.order.update({
            data,
            where: {
                id
            }
        })
    } catch (error: any) {
        if (error.code === "P2025") {
            return null;
        }
        throw error
    }
}

export const deleteOrder = async (id: string) => {
    try {
        await prisma.order.delete({
            where: {
                id
            }
        })
    } catch (error) {
        throw error
    }
}
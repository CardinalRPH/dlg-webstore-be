import { OrderCreateInput, OrderUpdateInput, OrderWhereInput, OrderWhereUniqueInput } from "../../generated/prisma/models";
import { prisma } from "../libs/prisma";

export const getUniqueOrder = async (where: OrderWhereUniqueInput) => {
    try {
        const order = await prisma.order.findUnique({
            where
        })
        if (!order) {
            return null
        }
        return order
    } catch (error) {
        throw error
    }
}

export const getAllOrders = async (limit = 50, where?: OrderWhereInput, delta?: number) => {
    try {
        return await prisma.order.findMany({
            take: limit,
            skip: delta,
            where
        })
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
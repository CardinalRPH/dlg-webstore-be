import { CartCreateInput, CartUpdateInput, CartWhereInput, CartWhereUniqueInput } from "../../generated/prisma/models"
import { prisma } from "../libs/prisma"

export const getUniqueCart = async (where: CartWhereUniqueInput) => {
    try {
        const cart = await prisma.cart.findUnique({
            where
        })
        if (!cart) {
            return null
        }
        return cart
    } catch (error) {
        throw error
    }
}

export const getAllCarts = async (limit = 50, delta?: number, where?: CartWhereInput) => {
    try {
        return await prisma.cart.findMany({
            take: limit,
            skip: delta,
            where
        })
    } catch (error) {
        throw error
    }
}

export const updateCart = async (data: CartUpdateInput, id: number) => {
    try {
        return await prisma.cart.update({
            data,
            where: {
                id
            }
        })
    } catch (error) {
        throw error
    }
}

export const addCart = async (data: CartCreateInput) => {
    try {
        return await prisma.cart.create({
            data
        })
    } catch (error) {
        throw error
    }
}

export const deleteCart = async (id: number) => {
    try {
        await prisma.cart.delete({
            where: {
                id
            }
        })
    } catch (error) {
        throw error
    }
}
import z from "zod"
import { CartItemCreateInput, CartItemUpdateInput, CartUpdateInput, CartWhereInput, CartWhereUniqueInput } from "../../generated/prisma/models"
import { prisma } from "../libs/prisma"
import { cartAddItemSchema } from "../Schemas/cartSchema"

export const getUniqueCart = async (where: CartWhereUniqueInput) => {
    try {
        const cart = await prisma.cart.findUnique({
            where,
            include: {
                items: true
            }
        })
        if (!cart) {
            return null
        }
        return cart
    } catch (error) {
        throw error
    }
}

export const getAllCarts = async (limit = 50, userId: string, cursor?: string) => {
    try {
        const carts = await prisma.cart.findUnique({
            where: {
                userId
            },
            include: {
                items: {
                    take: limit,
                    cursor: cursor ? { id: cursor } : undefined
                }
            }
        })

        if (!carts) {
            return null
        }

        const hasNextPage = carts.items.length > limit;
        const data = hasNextPage ? carts.items.slice(0, limit) : carts.items;

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

export const updateCart = async (id: string, increment?: boolean, decrement?: boolean) => {
    try {
        return await prisma.cartItem.update({
            data: {
                quantity: increment ? {
                    increment: 1
                } : decrement ? {
                    decrement: 1
                } : undefined
            },
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

export const addCart = async (data: z.infer<typeof cartAddItemSchema>) => {
    try {
        const { userId, productId, name, price, imageUrl, variant } = data
        const cart = await prisma.cart.upsert({
            where: { userId },
            update: {},
            create: {
                userId
            }
        })

        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId,
                variant: variant ?? null
            }
        })

        if (existingItem) {
            return await prisma.cartItem.update({
                where: {
                    id: existingItem.id
                },
                data: {
                    quantity: {
                        increment: 1
                    }
                }
            })
        }

        return prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                name,
                price,
                imageUrl,
                quantity: 1,
                variant,
            },
        });
    } catch (error) {
        throw error
    }
}

export const deleteCart = async (cartitemId: string) => {
    try {
        await prisma.cartItem.delete({
            where: {
                id: cartitemId
            }
        })
    } catch (error) {
        throw error
    }
}
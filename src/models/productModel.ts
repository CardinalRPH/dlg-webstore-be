import { ProductCreateInput, ProductUpdateInput, ProductWhereInput, ProductWhereUniqueInput } from "../../generated/prisma/models";
import { prisma } from "../libs/prisma";

export const getUniqueProduct = async (where: ProductWhereUniqueInput) => {
    try {
        const product = await prisma.product.findUnique({
            where
        })
        if (!product) {
            return null
        }
        return product
    } catch (error) {
        throw error
    }
}

export const getAllProducts = async (limit = 50, delta?: number, where?: ProductWhereInput) => {
    try {
        return await prisma.product.findMany({
            take: limit,
            skip: delta,
            where
        })
    } catch (error) {
        throw error
    }
}

export const updateProduct = async (id: number, data: ProductUpdateInput) => {
    try {
        return await prisma.product.update({
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

export const deleteProduct = async (id: number) => {
    try {
        await prisma.product.delete({
            where: {
                id
            }
        })
    } catch (error) {
        throw error
    }
}

export const addProduct = async (data: ProductCreateInput) => {
    try {
        return await prisma.product.create({
            data
        })
    } catch (error) {
        throw error
    }
}
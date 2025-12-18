import { ProductCreateInput, ProductUpdateInput, ProductWhereInput, ProductWhereUniqueInput } from "../../generated/prisma/models";
import { prisma } from "../libs/prisma";

export const getUniqueProduct = async (where: ProductWhereUniqueInput) => {
    try {
        const product = await prisma.product.findUnique({
            where,
            include: {
                accessoryDetail: true,
                coffeeDetail: true
            }
        })
        if (!product) {
            return null
        }
        return product
    } catch (error) {
        throw error
    }
}

export const getAllProducts = async (limit = 50, cursor?: string, where?: ProductWhereInput) => {
    try {
        const products = await prisma.product.findMany({
            take: limit,
            cursor: cursor ? { id: cursor } : undefined,
            where,
            orderBy: {
                createdAt: "asc"
            }

        })

        const hasNextPage = products.length > limit;
        const data = hasNextPage ? products.slice(0, limit) : products;

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

export const updateProduct = async (id: string, data: ProductUpdateInput) => {
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

export const deleteProduct = async (id: string) => {
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
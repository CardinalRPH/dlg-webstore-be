
import { UserCreateInput, UserUpdateInput, UserWhereInput, UserWhereUniqueInput } from "../../generated/prisma/models";
import { prisma } from "../libs/prisma";

export const getUniqueUser = async (where: UserWhereUniqueInput) => {
    try {
        const user = await prisma.user.findUnique({
            where
        })
        if (!user) {
            return null
        }
        return user
    } catch (error) {
        throw error
    }
}

export const getAllUser = async (limit = 50, delta?: number, where?: UserWhereInput) => {
    try {
        return await prisma.user.findMany({
            take: limit,
            skip: delta,
            where,
            omit: {
                password: true
            }

        })
    } catch (error) {
        throw error
    }
}

export const addUser = async (data: UserCreateInput) => {
    try {
        return await prisma.user.create({
            data
        })
    } catch (error) {
        throw error
    }
}

export const updateUser = async (data: UserUpdateInput, id: number) => {
    try {
        return await prisma.user.update({
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
import { OTPCreateInput, OTPWhereInput } from "../../generated/prisma/models";
import { prisma } from "../libs/prisma";

export const getFirstOtp = async (where: OTPWhereInput) => {
    try {
        const otp = await prisma.oTP.findFirst({
            where
        })
        if (!otp) {
            return null
        }
        return otp
    } catch (error) {
        throw error
    }
}

export const addOtp = async (data: OTPCreateInput) => {
    try {
        return await prisma.oTP.create({
            data
        })
    } catch (error) {
        throw error
    }
}

export const deleteOtp = async (id: number) => {
    try {
        await prisma.oTP.delete({
            where: {
                id
            }
        })
    } catch (error) {
        throw error
    }
}

export const updateOtp = async (isUsed: boolean, id: number) => {
    try {
        await prisma.oTP.update({
            data: {
                isUsed
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

import { PaymentServiceWhereUniqueInput } from "../../generated/prisma/models";
import { prisma } from "../libs/prisma";

export const getAllPaymentService = async (isNotActive: boolean) => {
    try {
        return await prisma.paymentService.findMany({
            where: {
                isActive: isNotActive ? false : true
            }
        })
    } catch (error) {
        throw error
    }
}

export const getUniquePaymentService = async (where:PaymentServiceWhereUniqueInput) => {
    try {
        const paymentService = await prisma.paymentService.findUnique({
            where
        })
        if (!paymentService) {
            return null
        }
        return paymentService
    } catch (error) {
        throw error
    }
}
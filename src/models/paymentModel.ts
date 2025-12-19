import { PaymentUpdateInput, PaymentWhereUniqueInput } from "../../generated/prisma/models"
import { prisma } from "../libs/prisma"


export const getUniquePayment = async (where: PaymentWhereUniqueInput) => {
    try {
        const payment = await prisma.payment.findUnique({
            where
        })
        if (!payment) {
            return null
        }
        return payment
    } catch (error) {
        throw error
    }
}

export const updatePayment = async (where: PaymentUpdateInput, id: string) => {
    try {
        return await prisma.payment.update({
            where: { id },
            data: where
        })
    } catch (error) {
        throw error
    }
}
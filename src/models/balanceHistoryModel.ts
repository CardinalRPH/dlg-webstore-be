import { BalanceHistoryCreateInput, BalanceHistoryCreateManyInput, BalanceHistoryUpdateInput, BalanceHistoryWhereUniqueInput } from "../../generated/prisma/models"
import { prisma } from "../libs/prisma"

export const getUniqieBalanceHistory = async (where: BalanceHistoryWhereUniqueInput) => {
    try {
        const balanceHistory = await prisma.balanceHistory.findUnique({
            where
        })
        if (!balanceHistory) {
            return null
        }
        return balanceHistory
    } catch (error) {
        throw error
    }
}

export const updateBalanceHistory = async (data: BalanceHistoryUpdateInput, id: string) => {
    try {
        return await prisma.balanceHistory.update({
            where: { id },
            data
        })
    } catch (error) {
        throw error
    }

}

export const createBalanceHistory = async (data: BalanceHistoryCreateManyInput) => {
    try {
        return await prisma.balanceHistory.create({
            data
        })
    } catch (error) {
        throw error
    }
}
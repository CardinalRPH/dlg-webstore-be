import { ShippingCreateInput, ShippingUpdateInput } from "../../generated/prisma/models"
import { prisma } from "../libs/prisma"

export const createShipping = async (data: ShippingCreateInput) => {
    try {
        return await prisma.shipping.create({
            data
        })
    } catch (error) {
        throw error
    }
}

export const updateShipping = async (data: ShippingUpdateInput, id: string) => {
    try {
        return await prisma.shipping.update({
            where: { id },
            data
        })
    } catch (error) {
        throw error
    }
}

export const getUniqueShipping = async (id: string) => {
    try {
        const shipping = await prisma.shipping.findUnique({
            where: { id }
        })
        if (!shipping) {
            return null
        }
        return shipping
    } catch (error) {
        throw error
    }
}
import { th } from "zod/locales";
import { ShippingServiceWhereUniqueInput } from "../../generated/prisma/models";
import { prisma } from "../libs/prisma";

export const getAllShippingService = async (isNotActive: boolean) => {
    try {
        return await prisma.shippingService.findMany({
            where: {
                isActive: isNotActive ? false : true
            }
        })
    } catch (error) {
        throw error
    }
}

export const getUniqueShippingService = async (where: ShippingServiceWhereUniqueInput) => {
    try {
        const shippingService = await prisma.shippingService.findUnique({
            where
        })
        if (!shippingService) {
            return null
        }
        return shippingService
    } catch (error) {
        throw error
    }
}
import { InvoiceCreateInput, InvoiceUpdateInput, InvoiceWhereInput, InvoiceWhereUniqueInput } from "../../generated/prisma/models";
import { prisma } from "../libs/prisma";

export const getuniqueInvoice = async (where: InvoiceWhereUniqueInput) => {
    try {
        const invoice = await prisma.invoice.findUnique({
            where
        })
        if (!invoice) {
            return null
        }
        return invoice
    } catch (error) {
        throw error
    }
}

export const getAllInvoice = async (limit = 50, delta?: number, where?: InvoiceWhereInput) => {
    try {
        return await prisma.invoice.findMany({
            take: limit,
            skip: delta,
            where
        })
    } catch (error) {
        throw error
    }

}

export const addInvoice = async (data: InvoiceCreateInput) => {
    try {
        return await prisma.invoice.create({
            data
        })
    } catch (error) {
        throw error
    }
}

export const updateInvoce = async (data: InvoiceUpdateInput, id: string) => {
    try {
        return await prisma.invoice.update({
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

export const deleteInvocie = async (id: string) => {
    try {
        await prisma.invoice.delete({
            where: {
                id
            }
        })
    } catch (error) {
        throw error
    }
}
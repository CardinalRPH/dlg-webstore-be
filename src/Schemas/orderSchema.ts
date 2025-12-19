import z from "zod"
import { OrderStatus } from "../../generated/prisma/enums"

export const ordersGetAllSchemaQuery = z.object({
    take: z.coerce.number(),
    cursor: z.string().optional(),
})

export const ordersGetDetailSchemaParams = z.object({
    orderId: z.string(),
})

export const orderCreateSchemaBody = z.object({
    shippingServiceId: z.string(),
    shipping: z.object({
        receiverName: z.string(),
        phone: z.string(),
        address: z.string(),
        city: z.string(),
        postalCode: z.string(),
        country: z.string()
    })
})

export const orderUpdateStatusSchemaParams = z.object({
    orderId: z.string(),
})

export const orderUpdateStatusSchemaBody = z.object({
    status: z.enum(OrderStatus)
})

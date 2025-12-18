import z from "zod";

export const cartsGetAllSchemaQuery = z.object({
    take: z.coerce.number(),
    cursor: z.string().optional(),
})


export const cartAddItemSchema = z.object({
    userId: z.string(),
    productId: z.string(),
    name: z.string(),
    price: z.number(),
    imageUrl: z.string().optional(),
    quantity: z.coerce.number().optional(),
    variant: z.string().optional()
})

export const cartUpdateItemSchemaBody = z.object({
    increment: z.boolean().optional(),
    decrement: z.boolean().optional()
})


export const cartUpdateItemSchemaParam = z.object({
    itemId: z.string()
})

export const cartDeleteItemSchema = z.object({
    itemId: z.string()
})
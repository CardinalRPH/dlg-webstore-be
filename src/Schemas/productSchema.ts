import z from "zod";
import { ProductCategory } from "../../generated/prisma/enums";

export const prodcutGetAllSchema = z.object({
    take:z.coerce.number(),
    skip:z.coerce.number().optional(),
    cat:z.literal([ProductCategory.ACCESSORY, ProductCategory.COFFEE])
})

export const productGetDetailSchema = z.object({
    productId:z.coerce.number()
})


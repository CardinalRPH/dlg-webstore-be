import z from "zod";

export const userLoginSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export const userRegisterSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(8),
    birthDate: z.coerce.date(),
    phone: z.string().min(10).startsWith("62")
})

export const userForgetPassSchema = z.object({
    email: z.email()
})

export const userResetPassSchema = z.object({
    newPass: z.string().min(8),
    resetId: z.number(),
    email: z.email()
})

export const userVerifySchema = z.object({
    resetToken: z.string()
})
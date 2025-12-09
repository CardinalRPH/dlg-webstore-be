import z from "zod";

export const userLoginSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export const usetRegisterSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(8),
    birthDate: z.date(),
    phone: z.string().min(10).startsWith("62")
})

export const userForgetPassSchema = z.object({
    email: z.email()
})

export const userResetPassSchema = z.object({
    otp: z.number().max(4).min(4)
})
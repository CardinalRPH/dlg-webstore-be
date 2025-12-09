import z from "zod";

const envSchema = z.object({
    ENV: z
        .union([
            z.literal('development'),
            z.literal('testing'),
            z.literal('production'),
        ])
        .default('development'),
    DATABASE_URL: z.url(),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.number(),
    PORT: z.number(),
    SALT_ROUND: z.number(),
    SESSION_SECRET:z.string()
})

const processEnv = envSchema.parse(process.env)

export default processEnv
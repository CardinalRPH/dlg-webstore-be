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
    DATABASE_PORT: z.coerce.number(),
    PORT: z.coerce.number(),
    SESSION_SECRET: z.string(),
    ENCYRPTION_KEY: z.string(),
    ENCYRPTION_IV: z.string(),
    SALT_ROUND: z.coerce.number(),
    ENCYRPTION_METHOD: z.string(),
    JWT_SECRET: z.string(),
    EMAIL_SERVICE_USER: z.string(),
    EMAIL_SERVICE_PASS: z.string(),
    EMAIL_SERVICE_NAME: z.string()

})

const processEnv = envSchema.parse(process.env)

export default processEnv
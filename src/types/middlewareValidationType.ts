import { ZodObject, ZodRawShape } from "zod";

export type StrictZodObject<T extends ZodRawShape = ZodRawShape> = ZodObject<T>;


export type requestSchema<
    Q extends StrictZodObject | undefined = undefined,
    B extends StrictZodObject | undefined = undefined,
    P extends StrictZodObject | undefined = undefined
> = {
    querySchema?: Q;
    bodySchema?: B;
    paramsSchema?: P;
};

type StrictZod = ZodObject<any, any>

export type middleWareSchema = {
    querySchema?: StrictZodObject
    bodySchema?: StrictZodObject
    paramsSchema?: StrictZodObject
}
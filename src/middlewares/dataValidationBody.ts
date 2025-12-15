import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes";
import z, { ZodError } from "zod";
import { middleWareSchema } from "../types/middlewareValidationType";

const validateData = ({ bodySchema, paramsSchema, querySchema }: middleWareSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (bodySchema) {
                bodySchema.parse(req.body)
            }
            if (paramsSchema) {
                paramsSchema.parse(req.params)
            }
            if (querySchema) {
                querySchema.parse(req.query)
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid data', details: errorMessages });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        }
    }
}

export default validateData
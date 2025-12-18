import { Router } from "express";
import { defaultPublicRateLimiter } from "../middlewares/rateLimiter";
import validateData from "../middlewares/dataValidationBody";
import { isAuthenticated } from "../middlewares/sessionCheck";
import { cartDeleteItemSchema, cartsGetAllSchemaQuery, cartUpdateItemSchemaBody, cartUpdateItemSchemaParam } from "../Schemas/cartSchema";
import { cartDelete, cartsGetAll, cartUpdate } from "../controllers/cartController";

const cartRouter = Router();

cartRouter.get("/:userId", defaultPublicRateLimiter, isAuthenticated, validateData({
    querySchema: cartsGetAllSchemaQuery,
}), cartsGetAll)

cartRouter.put("/:itemId", defaultPublicRateLimiter, isAuthenticated, validateData({
    bodySchema: cartUpdateItemSchemaBody,
    paramsSchema: cartUpdateItemSchemaParam
}), cartUpdate)

cartRouter.delete("/:itemId", defaultPublicRateLimiter, isAuthenticated, validateData({
    paramsSchema: cartDeleteItemSchema
}), cartDelete)

export default cartRouter
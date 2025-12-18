import { Request, Response } from "express";
import { deleteCart, getAllCarts, updateCart } from "../models/cartModel";
import getRequestData from "../utils/getRequestData";
import { cartDeleteItemSchema, cartsGetAllSchemaQuery, cartUpdateItemSchemaBody, cartUpdateItemSchemaParam } from "../Schemas/cartSchema";
import { StatusCodes } from "http-status-codes";

export const cartsGetAll = async (req: Request, res: Response) => {
    try {
        const { queryData } = getRequestData({
            querySchema: cartsGetAllSchemaQuery,
        }, req)
        const { take, cursor } = queryData
        const userId = req.session.user!.id

        const carts = await getAllCarts(take, userId, cursor)

        return res.status(StatusCodes.OK).json({
            data: carts
        })
    } catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error"
        })
    }
}

export const cartUpdate = async (req: Request, res: Response) => {
    try {
        const { paramsData, bodyData } = getRequestData({
            bodySchema: cartUpdateItemSchemaBody,
            paramsSchema: cartUpdateItemSchemaParam
        }, req)

        const { itemId } = paramsData
        const { increment, decrement } = bodyData

        const updatedItem = await updateCart(itemId, increment, decrement)
        if (!updatedItem) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Cart item not found"
            })
        }

        return res.status(StatusCodes.OK).json({
            data: updatedItem
        })

    } catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error"
        })
    }
}

export const cartDelete = async (req: Request, res: Response) => {
    try {
        const { paramsData } = getRequestData({
            paramsSchema: cartDeleteItemSchema
        }, req)
        const { itemId } = paramsData
        await deleteCart(itemId)
        return res.status(StatusCodes.NO_CONTENT).json({
            message: "Cart item deleted successfully"
        })

    } catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error"
        })
    }
}
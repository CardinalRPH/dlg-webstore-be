import { prodcutGetAllSchema, productGetDetailSchema } from "../Schemas/productSchema"
import { Request, Response } from "express"
import { getAllProducts, getUniqueProduct } from "../models/productModel"
import getRequestData from "../utils/getRequestData"
import { StatusCodes } from "http-status-codes"

export const productGetAll = async (req: Request, res: Response) => {
    try {
        const { queryData } = getRequestData({ querySchema: prodcutGetAllSchema }, req)
        const products = await getAllProducts(queryData.take, queryData.skip, {
            category: queryData.cat
        })

        return res.status(StatusCodes.OK).json({
            data: products
        })
    } catch (error) {
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error
        })
    }
}

export const productGetDetail = async (req: Request, res: Response) => {
    try {
        const { paramsData } = getRequestData({ paramsSchema: productGetDetailSchema }, req)
        const product = await getUniqueProduct({
            id: paramsData.productId
        })

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "No product found"
            })
        }

        return res.status(StatusCodes.OK).json({
            data: product
        })

    } catch (error) {
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error
        })
    }
}

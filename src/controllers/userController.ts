import { Request, Response } from "express";
import getRequestData from "../utils/getRequestData";
import { getUniqueUser } from "../models/userModel";
import { StatusCodes } from "http-status-codes";

export const getCurrentProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.session.user!.id

        const existUser = await getUniqueUser({
            id: userId
        }, {
            password: true,
            updatedAt: true
        })
        if (!existUser) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found"
            })
        }
        return res.status(StatusCodes.OK).json({
            data: existUser
        })
    } catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error"
        })
    }
}

export const userSendVerifyEmail = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error"
        })
    }
}

export const userChangePassword = async (req: Request, res: Response) =>{
    try {
    } catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error"
        })
    }
}
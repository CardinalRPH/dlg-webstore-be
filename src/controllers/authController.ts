import { Request, Response } from "express";
import { getUniqueUser } from "../models/userModel";
import z from "zod";
import { userLoginSchema } from "../Schemas/authSchema";
import { StatusCodes } from "http-status-codes";
import { comparePass } from "../utils/bcryptGenerate";

export const userLogin = async (req: Request, res: Response) => {
    try {
        const { email, password }: z.infer<typeof userLoginSchema> = req.body
        const user = await getUniqueUser({
            email
        })
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found"
            })
        }
        const comparedPass = await comparePass(password, user.password)
        if (!comparedPass) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Wrong Password"
            })
        }

        req.session.user = {
            id: user.id,
            email: user.email,
            isVerif:user.isVerif
        }

        return res.status(200).json({
            data: req.session.user
        })

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error
        })

    }
}

export const userRegister = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
}
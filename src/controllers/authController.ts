import { Request, Response } from "express";
import { addUser, getUniqueUser, updateUser } from "../models/userModel";
import { userForgetPassSchema, userLoginSchema, userResetPassSchema, userRegisterSchema, userVerifySchema } from "../Schemas/authSchema";
import { StatusCodes } from "http-status-codes";
import { comparePass, hashPass } from "../services/bcryptGenerate";
import genOtpCode from "../utils/generateOtpCode";
import { loadEmailTemplate } from "../utils/loadEmailTemplate";
import { addOtp, getFirstOtp, updateOtp } from "../models/otpModel";
import { BASE_FE_LINK, RESET_EXPIRE } from "../configs/variables";
import { sendEmail } from "../services/emailService";
import { decryptData, encryptData } from "../services/aesEncryptor";
import { generateJWT, verifyJWT } from "../services/jwtGenerate";
import getRequestData from "../utils/getRequestData";

export const userLogin = async (req: Request, res: Response) => {
    try {
        const { bodyData } = getRequestData({
            bodySchema: userLoginSchema
        }, req)
        const user = await getUniqueUser({
            email: bodyData.email
        })
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found"
            })
        }
        const comparedPass = await comparePass(bodyData.password, user.password)
        if (!comparedPass) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Wrong Password"
            })
        }

        req.session.user = {
            id: user.id,
            email: user.email,
            isVerif: user.isVerif
        }

        return res.status(StatusCodes.OK).json({
            data: req.session.user
        })

    } catch (error) {
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error
        })

    }
}

export const userRegister = async (req: Request, res: Response) => {
    try {
        const { bodyData: data } = getRequestData({ bodySchema: userRegisterSchema }, req)
        const user = await getUniqueUser({
            email: data.email
        })
        if (user) {
            return res.status(StatusCodes.CONFLICT).json({
                message: "Email already exist"
            })
        }
        const userAdd = await addUser({
            ...data,
            birthDate: new Date(data.birthDate),
            password: await hashPass(data.password)
        })

        return res.status(StatusCodes.CREATED).json({
            data: {
                email: userAdd.email
            }
        })

    } catch (error) {
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error
        })
    }
}

export const userForgetPass = async (req: Request, res: Response) => {
    try {
        const { bodyData } = getRequestData({ bodySchema: userForgetPassSchema }, req)

        const user = await getUniqueUser({
            email: bodyData.email
        })
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found"
            })
        }

        const otpCode = genOtpCode
        const encryptedData = encryptData(otpCode)
        const jwtToken = generateJWT({
            email: user.email,
            code: encryptedData
        }, RESET_EXPIRE)

        const emailTemplate = loadEmailTemplate("resetPass.html", {
            RESET_LINK: `${BASE_FE_LINK}/reset/${jwtToken}`
        })

        await addOtp({
            code: otpCode,
            email: user.email,
            expiresAt: new Date(Date.now() + RESET_EXPIRE),
            createdAt: new Date(Date.now())
        })

        await sendEmail(user.email, "Verification Account", emailTemplate);

        return res.status(StatusCodes.OK).json({
            "message": "Reset Link has been sent successfully"
        })


    } catch (error) {
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error
        })
    }

}

export const userVerify = async (req: Request, res: Response) => {
    try {
        const { paramsData } = getRequestData({ paramsSchema: userVerifySchema }, req)

        const { code, email } = verifyJWT<{ email: string, code: string }>(paramsData.resetToken)


        const decryptCode = decryptData(code)

        const otp = await getFirstOtp({
            code: decryptCode,
            email: email
        })

        if (!otp) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
        }
        const currDateTIme = new Date(Date.now())
        if (otp.expiresAt > currDateTIme) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token expired" });
        }

        return res.status(StatusCodes.ACCEPTED).json({
            data: {
                email: otp.email,
                resetId: otp.id
            }
        })

    } catch (error) {
        console.error(error)
        if (error instanceof Error) {
            if (error.name === "TokenExpiredError") {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token expired" });
            }

            if (error.name === "JsonWebTokenError") {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
            }
        }

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error
        })
    }
}

export const userResetPass = async (req: Request, res: Response) => {
    try {
        const { bodyData } = getRequestData({
            bodySchema: userResetPassSchema
        }, req)
        const { resetId, email, newPass } = bodyData
        const avaiReset = await getFirstOtp({
            id: resetId
        })
        if (!avaiReset) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
        }

        const currDateTIme = new Date(Date.now())
        if (avaiReset.expiresAt > currDateTIme || avaiReset.isUsed === true) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token expired" });
        }

        const avaiUser = await getUniqueUser({
            email
        })

        if (!avaiUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "No user to edit" });
        }

        await updateUser({
            password: await hashPass(newPass)
        }, avaiUser.id)

        await updateOtp(true, avaiReset.id)

        return res.status(StatusCodes.OK).json({
            message: "User Updated"
        })

    } catch (error) {
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error
        })
    }
}
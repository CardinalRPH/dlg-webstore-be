import jwt from "jsonwebtoken";
import processEnv from "../../env";

export const generateJWT = (payload: object, expire: number) => {
    return jwt.sign(payload, processEnv.JWT_SECRET, {
        expiresIn: expire
    })
}

export const verifyJWT = <T = any>(token: string): T => {
    return jwt.verify(token, processEnv.JWT_SECRET) as T
}
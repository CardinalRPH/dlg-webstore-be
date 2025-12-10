import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.session.user) {
        return res.status(StatusCodes.FORBIDDEN).json({
            error: "Forbidden",
            message: "You must be logged out to access this endpoint",
        });
    }
    return next();


};

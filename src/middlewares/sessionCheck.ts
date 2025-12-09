import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.user) {
    return next();
  }

  return res.status(StatusCodes.UNAUTHORIZED).json({
    error: "Unauthorized",
    message: "You must be logged in to access this endpoint",
  });
};

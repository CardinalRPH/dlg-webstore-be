import { Router } from "express";
import { defaultPublicRateLimiter } from "../middlewares/rateLimiter";
import validateData from "../middlewares/dataValidationBody";
import { getCurrentProfile } from "../controllers/userController";
import { isAuthenticated } from "../middlewares/sessionCheck";

const userRouter = Router();

userRouter.get("/:userId", defaultPublicRateLimiter, isAuthenticated, getCurrentProfile)

export default userRouter
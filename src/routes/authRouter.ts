import { Router } from 'express';
import validateDataBody from '../middlewares/dataValidationBody';
import { userForgetPassSchema, userLoginSchema, userRegisterSchema, userResetPassSchema } from '../Schemas/authSchema';
import { userForgetPass, userLogin, userRegister, userResetPass, userVerify } from '../controllers/authController';
import { defaultPublicRateLimiter, loginRateLimiter, registerRateLimiter, resetRateLimiter } from '../middlewares/rateLimiter';

const authRouter = Router();


authRouter.post('/login', loginRateLimiter, validateDataBody(userLoginSchema), userLogin)
authRouter.post('/register', registerRateLimiter, validateDataBody(userRegisterSchema), userRegister)
authRouter.post('/forget-pass', resetRateLimiter, validateDataBody(userForgetPassSchema), userForgetPass)
authRouter.get('/verify-pass/:resetToken', defaultPublicRateLimiter, userVerify)
authRouter.put("/reset-pass", resetRateLimiter, validateDataBody(userResetPassSchema), userResetPass)


export default authRouter;
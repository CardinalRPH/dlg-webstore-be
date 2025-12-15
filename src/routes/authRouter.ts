import { Router } from 'express';
import { userForgetPassSchema, userLoginSchema, userRegisterSchema, userResetPassSchema, userVerifySchema } from '../Schemas/authSchema';
import { userForgetPass, userLogin, userRegister, userResetPass, userVerify } from '../controllers/authController';
import { defaultPublicRateLimiter, loginRateLimiter, registerRateLimiter, resetRateLimiter } from '../middlewares/rateLimiter';
import validateData from '../middlewares/dataValidationBody';

const authRouter = Router();


authRouter.post('/login', loginRateLimiter, validateData({ bodySchema: userLoginSchema }), userLogin)
authRouter.post('/register', registerRateLimiter, validateData({ bodySchema: userRegisterSchema }), userRegister)
authRouter.post('/forget-pass', resetRateLimiter, validateData({ bodySchema: userForgetPassSchema }), userForgetPass)
authRouter.get('/verify-pass/:resetToken', defaultPublicRateLimiter, validateData({ paramsSchema: userVerifySchema }), userVerify)
authRouter.put("/reset-pass", resetRateLimiter, validateData({ bodySchema: userResetPassSchema }), userResetPass)


export default authRouter;
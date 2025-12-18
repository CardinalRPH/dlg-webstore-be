import { Router } from 'express';
import { userForgetPassSchema, userLoginSchema, userRegisterSchema, userResetPassSchema, userVerifySchema } from '../Schemas/authSchema';
import { userForgetPass, userLogin, userRegister, userResetPass, userVerify } from '../controllers/authController';
import { defaultPublicRateLimiter, loginRateLimiter, registerRateLimiter, resetRateLimiter } from '../middlewares/rateLimiter';
import validateData from '../middlewares/dataValidationBody';
import { isNoAuthenticated } from '../middlewares/sessionCheckReject';

const authRouter = Router();


authRouter.post('/login', loginRateLimiter, isNoAuthenticated, validateData({ bodySchema: userLoginSchema }), userLogin)
authRouter.post('/register', registerRateLimiter, isNoAuthenticated, validateData({ bodySchema: userRegisterSchema }), userRegister)
authRouter.post('/forget-pass', resetRateLimiter, isNoAuthenticated, validateData({ bodySchema: userForgetPassSchema }), userForgetPass)
authRouter.get('/verify-pass/:resetToken', defaultPublicRateLimiter, isNoAuthenticated, validateData({ paramsSchema: userVerifySchema }), userVerify)
authRouter.put("/reset-pass", resetRateLimiter, isNoAuthenticated, validateData({ bodySchema: userResetPassSchema }), userResetPass)


export default authRouter;
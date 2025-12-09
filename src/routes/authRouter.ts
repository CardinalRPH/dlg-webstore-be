import { Router } from 'express';
import validateData from '../middlewares/dataValidationBody';
import { userLoginSchema } from '../Schemas/authSchema';
import { userLogin } from '../controllers/authController';

const router = Router();


router.post('/login', validateData(userLoginSchema), userLogin)

export default router;
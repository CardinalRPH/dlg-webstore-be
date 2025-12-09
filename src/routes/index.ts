import { type Request, type Response, Router } from 'express';
const router = Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response, next) {
  res.status(200).json({
    message: "Hello From Express"
  })
});

export default router;
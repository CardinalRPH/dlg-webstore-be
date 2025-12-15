import { Router } from "express";
import { defaultPublicRateLimiter } from "../middlewares/rateLimiter";
import validateData from "../middlewares/dataValidationBody";
import { prodcutGetAllSchema, productGetDetailSchema } from "../Schemas/productSchema";
import { productGetAll, productGetDetail } from "../controllers/productController";

const productRouter = Router();

productRouter.get("/", defaultPublicRateLimiter, validateData({querySchema:prodcutGetAllSchema}), productGetAll)
productRouter.get("/:productId", defaultPublicRateLimiter, validateData({paramsSchema:productGetDetailSchema}), productGetDetail)


export default productRouter
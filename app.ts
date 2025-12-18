import express, { json, urlencoded, static as static_ } from "express";
import path, { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
dotenv.config();

import indexRouter from "./src/routes";
import session from "express-session";
import processEnv from "./env";
import authRouter from "./src/routes/authRouter";
import productRouter from "./src/routes/productRouter";
import userRouter from "./src/routes/userRouter";
import cartRouter from "./src/routes/cartRouter";

const app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(static_(join(__dirname, "public")));
app.set('trust proxy', 1)
app.use(session({
    secret: processEnv.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}))

// router section
app.use("/", indexRouter);
app.use('/auth', authRouter)
app.use('/product', productRouter)
app.use('/user', userRouter)
app.use('/cart', cartRouter)

export default app;
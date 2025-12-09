import express, { json, urlencoded, static as static_ } from "express";
import path, { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
dotenv.config();

import indexRouter from "./src/routes";
import session from "express-session";
import processEnv from "./env";

const app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(static_(join(__dirname, "public")));
app.set('trust proxy', 1)
app.use(session({
    secret:processEnv.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        secure:false,
         maxAge: 1000 * 60 * 60
    }
}))

app.use("/", indexRouter);

export default app;
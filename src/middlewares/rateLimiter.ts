import rateLimit from "express-rate-limit";
import { LOGIN_MAX, LOGIN_RATE, OTP_MAX, OTP_RATE, PUBLIC_MAX, PUBLIC_RATE, REGISTER_MAX, REGISTER_RATE, RESET_MAX, RESET_RATE } from "../configs/variables";

export const loginRateLimiter = rateLimit({
    windowMs: LOGIN_RATE, // 1 menit
    max: LOGIN_MAX,                  // maksimal 5 request per menit
    message: {
        error: "Too many login attempts, please try again later.",
    },
    standardHeaders: true,   // menambahkan header RateLimit-*
    legacyHeaders: false,    // disable X-RateLimit-*
});

export const otpRateLimiter = rateLimit({
    windowMs: OTP_RATE, // 5 menit
    max: OTP_MAX,
    message: {
        error: "OTP requests too frequent. Try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const resetRateLimiter = rateLimit({
    windowMs: RESET_RATE, // 5 menit
    max: RESET_MAX,
    message: {
        error: "OTP requests too frequent. Try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const registerRateLimiter = rateLimit({
    windowMs: REGISTER_RATE, // contoh: 5 menit
    max: REGISTER_MAX,       // maksimal request
    message: {
        error: "Too many registration attempts. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const defaultPublicRateLimiter = rateLimit({
    windowMs: PUBLIC_RATE, // 15 menit
    max: PUBLIC_MAX,                 // maksimal 100 request / IP
    message: {
        error: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});


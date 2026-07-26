import rateLimit from "express-rate-limit";

// General API limiter — generous, just to blunt basic abuse/scraping
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 300 requests per IP per window
  standardHeaders: true, // return rate limit info in RateLimit-* headers
  legacyHeaders: false, // disable deprecated X-RateLimit-* headers
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

// Strict limiter for auth routes — brute-force protection on login/register
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // only 10 attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again in 15 minutes.",
  },
});

// AI routes limiter — Groq calls cost money/quota, worth limiting more tightly
export const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 AI requests per 5 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many AI requests, please slow down and try again shortly.",
  },
});
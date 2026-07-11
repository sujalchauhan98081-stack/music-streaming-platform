import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import testRoutes from "./routes/test.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// --- Security Middleware ---
app.use(helmet()); // sets secure HTTP headers

// --- CORS Configuration ---
app.use(
  cors({
    origin: process.env.CLIENT_URL, // only allow our frontend to call this API
    credentials: true, // required for cookies (refresh tokens later)
  })
);

// --- Body Parsers ---
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse form bodies
app.use(cookieParser()); // parse cookies

// --- Logging (dev only) ---
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- Routes ---
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);

// --- Error Handling (must be LAST) ---
app.use(notFound);
app.use(errorHandler);

export default app;
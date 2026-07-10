import express from "express";
import { getHealthStatus } from "../controllers/test.controller.js";

const router = express.Router();

router.get("/health", getHealthStatus);

export default router;
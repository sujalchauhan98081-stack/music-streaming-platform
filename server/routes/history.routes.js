import express from "express";
import {
  logHistory,
  getRecentlyPlayed,
  getMostPlayed,
} from "../controllers/history.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, logHistory);
router.get("/recent", protect, getRecentlyPlayed);
router.get("/most-played", protect, getMostPlayed);

export default router;
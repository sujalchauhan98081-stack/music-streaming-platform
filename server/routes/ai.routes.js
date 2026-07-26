import express from "express";
import {
  getRecommendations,
  getMoodPlaylist,
  chatWithAi,
  smartSearch,
} from "../controllers/ai.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  moodValidator,
  chatValidator,
  smartSearchValidator,
} from "../validators/ai.validator.js";
import { aiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();
router.use(aiLimiter);

router.get("/recommendations", protect, getRecommendations);
router.post("/mood-playlist", protect, moodValidator, getMoodPlaylist);
router.post("/chat", protect, chatValidator, chatWithAi);
router.post("/smart-search", protect, smartSearchValidator, smartSearch);

export default router;
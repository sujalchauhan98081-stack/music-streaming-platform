import express from "express";
import {
  getDashboardStats,
  getTopSongsAnalytics,
  getStreamsOverTime,
  getAllUsers,
  updateUserRole,
  toggleFeaturedSong,
} from "../controllers/admin.controller.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Every route here requires both a valid login AND the admin role
router.use(protect, authorizeRoles("admin"));

router.get("/stats", getDashboardStats);
router.get("/analytics/top-songs", getTopSongsAnalytics);
router.get("/analytics/streams-over-time", getStreamsOverTime);
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/songs/:id/toggle-featured", toggleFeaturedSong);

export default router;
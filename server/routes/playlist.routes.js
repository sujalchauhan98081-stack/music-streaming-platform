import express from "express";
import {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  toggleLikeSong,
  getLikedSongs,
} from "../controllers/playlist.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { createPlaylistValidator } from "../validators/playlist.validator.js";

const router = express.Router();

// IMPORTANT: specific routes ("liked") must come BEFORE dynamic routes ("/:id")
// otherwise Express will try to match "liked" as an :id param and fail
router.get("/liked", protect, getLikedSongs);
router.patch("/liked/:songId", protect, toggleLikeSong);

router.post("/", protect, createPlaylistValidator, createPlaylist);
router.get("/me", protect, getMyPlaylists);
router.get("/:id", protect, getPlaylistById);
router.put("/:id", protect, updatePlaylist);
router.delete("/:id", protect, deletePlaylist);
router.patch("/:id/songs", protect, addSongToPlaylist);
router.delete("/:id/songs/:songId", protect, removeSongFromPlaylist);

export default router;
import express from "express";
import {
  createSong,
  getAllSongs,
  getSongById,
  incrementPlayCount,
  updateSong,
  deleteSong,
} from "../controllers/song.controller.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { songValidator } from "../validators/music.validator.js";

const router = express.Router();

router.get("/", getAllSongs);
router.get("/:id", getSongById);
router.patch("/:id/play", incrementPlayCount);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  songValidator,
  createSong
);
router.put("/:id", protect, authorizeRoles("admin"), updateSong);
router.delete("/:id", protect, authorizeRoles("admin"), deleteSong);

export default router;
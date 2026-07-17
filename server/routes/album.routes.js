import express from "express";
import {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
} from "../controllers/album.controller.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { albumValidator } from "../validators/music.validator.js";

const router = express.Router();

router.get("/", getAllAlbums);
router.get("/:id", getAlbumById);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.single("cover"),
  albumValidator,
  createAlbum
);
router.put("/:id", protect, authorizeRoles("admin"), updateAlbum);
router.delete("/:id", protect, authorizeRoles("admin"), deleteAlbum);

export default router;
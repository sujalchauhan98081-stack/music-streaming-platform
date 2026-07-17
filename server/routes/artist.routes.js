import express from "express";
import {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
} from "../controllers/artist.controller.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { artistValidator } from "../validators/music.validator.js";

const router = express.Router();

router.get("/", getAllArtists);
router.get("/:id", getArtistById);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  artistValidator,
  createArtist
);
router.put("/:id", protect, authorizeRoles("admin"), updateArtist);
router.delete("/:id", protect, authorizeRoles("admin"), deleteArtist);

export default router;
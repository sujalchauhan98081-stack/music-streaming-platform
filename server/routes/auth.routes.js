import express from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerValidator, registerUser);
router.post("/login", loginValidator, loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);
router.get("/me", protect, getCurrentUser);

export default router;
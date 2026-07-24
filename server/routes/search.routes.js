import express from "express";
import { searchAll, getTrendingSongs } from "../controllers/search.controller.js";

const router = express.Router();

// Both public — search and trending don't require login
router.get("/", searchAll);
router.get("/trending", getTrendingSongs);

export default router;
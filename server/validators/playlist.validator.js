import { body } from "express-validator";

export const createPlaylistValidator = [
  body("name").trim().notEmpty().withMessage("Playlist name is required"),
];
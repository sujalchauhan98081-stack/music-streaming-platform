import { body } from "express-validator";

export const artistValidator = [
  body("name").trim().notEmpty().withMessage("Artist name is required"),
];

export const albumValidator = [
  body("title").trim().notEmpty().withMessage("Album title is required"),
  body("artist").notEmpty().withMessage("Artist ID is required"),
];

export const songValidator = [
  body("title").trim().notEmpty().withMessage("Song title is required"),
  body("artist").notEmpty().withMessage("Artist ID is required"),
  body("duration").isNumeric().withMessage("Duration must be a number"),
];
import { body } from "express-validator";

export const moodValidator = [
  body("mood").trim().notEmpty().withMessage("Mood is required"),
];

export const chatValidator = [
  body("message").trim().notEmpty().withMessage("Message is required"),
];

export const smartSearchValidator = [
  body("query").trim().notEmpty().withMessage("Query is required"),
];
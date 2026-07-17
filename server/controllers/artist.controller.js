import Artist from "../models/Artist.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";
import { validationResult } from "express-validator";

// @route  POST /api/v1/artists  (admin only)
export const createArtist = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, bio, genres } = req.body;
  let imageUrl = "";

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, "image");
    imageUrl = result.secure_url;
  }

  const artist = await Artist.create({
    name,
    bio,
    genres: genres ? genres.split(",").map((g) => g.trim()) : [],
    image: imageUrl,
  });

  res.status(201).json({ success: true, artist });
});

// @route  GET /api/v1/artists
export const getAllArtists = asyncHandler(async (req, res) => {
  const artists = await Artist.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: artists.length, artists });
});

// @route  GET /api/v1/artists/:id
export const getArtistById = asyncHandler(async (req, res) => {
  const artist = await Artist.findById(req.params.id);
  if (!artist) {
    const error = new Error("Artist not found");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ success: true, artist });
});

// @route  PUT /api/v1/artists/:id  (admin only)
export const updateArtist = asyncHandler(async (req, res) => {
  const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!artist) {
    const error = new Error("Artist not found");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ success: true, artist });
});

// @route  DELETE /api/v1/artists/:id  (admin only)
export const deleteArtist = asyncHandler(async (req, res) => {
  const artist = await Artist.findByIdAndDelete(req.params.id);
  if (!artist) {
    const error = new Error("Artist not found");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ success: true, message: "Artist deleted successfully" });
});
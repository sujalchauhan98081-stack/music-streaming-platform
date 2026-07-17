import Album from "../models/Album.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";
import { validationResult } from "express-validator";

// @route  POST /api/v1/albums  (admin only)
export const createAlbum = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, artist, genre, releaseDate } = req.body;
  let coverImageUrl = "";

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, "image");
    coverImageUrl = result.secure_url;
  }

  const album = await Album.create({
    title,
    artist,
    genre,
    releaseDate,
    coverImage: coverImageUrl,
  });

  res.status(201).json({ success: true, album });
});

// @route  GET /api/v1/albums
export const getAllAlbums = asyncHandler(async (req, res) => {
  const albums = await Album.find().populate("artist", "name image").sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: albums.length, albums });
});

// @route  GET /api/v1/albums/:id
export const getAlbumById = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id).populate("artist", "name image");
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ success: true, album });
});

// @route  PUT /api/v1/albums/:id  (admin only)
export const updateAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ success: true, album });
});

// @route  DELETE /api/v1/albums/:id  (admin only)
export const deleteAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findByIdAndDelete(req.params.id);
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ success: true, message: "Album deleted successfully" });
});
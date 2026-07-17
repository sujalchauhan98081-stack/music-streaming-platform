import Song from "../models/Song.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";
import { validationResult } from "express-validator";

// @route  POST /api/v1/songs  (admin only)
export const createSong = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, artist, album, duration, genre, isFeatured } = req.body;

  if (!req.files || !req.files.audio) {
    const error = new Error("Audio file is required");
    error.statusCode = 400;
    throw error;
  }

  const audioResult = await uploadToCloudinary(req.files.audio[0].path, "video");
  let coverImageUrl = "";

  if (req.files.cover) {
    const coverResult = await uploadToCloudinary(req.files.cover[0].path, "image");
    coverImageUrl = coverResult.secure_url;
  }

  const song = await Song.create({
    title,
    artist,
    album: album || null,
    duration,
    genre,
    isFeatured: isFeatured === "true",
    audioUrl: audioResult.secure_url,
    coverImage: coverImageUrl,
  });

  res.status(201).json({ success: true, song });
});

// @route  GET /api/v1/songs
export const getAllSongs = asyncHandler(async (req, res) => {
  const songs = await Song.find()
    .populate("artist", "name image")
    .populate("album", "title coverImage")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: songs.length, songs });
});

// @route  GET /api/v1/songs/:id
export const getSongById = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id)
    .populate("artist", "name image")
    .populate("album", "title coverImage");

  if (!song) {
    const error = new Error("Song not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ success: true, song });
});

// @route  PATCH /api/v1/songs/:id/play  (increments play count — used by the player, Phase 7)
export const incrementPlayCount = asyncHandler(async (req, res) => {
  const song = await Song.findByIdAndUpdate(
    req.params.id,
    { $inc: { playCount: 1 } },
    { new: true }
  );

  if (!song) {
    const error = new Error("Song not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ success: true, playCount: song.playCount });
});

// @route  PUT /api/v1/songs/:id  (admin only)
export const updateSong = asyncHandler(async (req, res) => {
  const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!song) {
    const error = new Error("Song not found");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ success: true, song });
});

// @route  DELETE /api/v1/songs/:id  (admin only)
export const deleteSong = asyncHandler(async (req, res) => {
  const song = await Song.findByIdAndDelete(req.params.id);
  if (!song) {
    const error = new Error("Song not found");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ success: true, message: "Song deleted successfully" });
});
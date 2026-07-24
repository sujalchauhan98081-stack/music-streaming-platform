import Playlist from "../models/Playlist.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";

// @route  POST /api/v1/playlists
export const createPlaylist = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, description, isPublic } = req.body;

  const playlist = await Playlist.create({
    name,
    description,
    isPublic,
    owner: req.user._id,
    songs: [],
  });

  res.status(201).json({ success: true, playlist });
});

// @route  GET /api/v1/playlists/me  (current user's own playlists)
export const getMyPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: playlists.length, playlists });
});

// @route  GET /api/v1/playlists/:id
export const getPlaylistById = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id).populate({
    path: "songs",
    populate: { path: "artist", select: "name image" },
  });

  if (!playlist) {
    const error = new Error("Playlist not found");
    error.statusCode = 404;
    throw error;
  }

  // Only the owner can view a private playlist
  if (!playlist.isPublic && playlist.owner.toString() !== req.user._id.toString()) {
    const error = new Error("This playlist is private");
    error.statusCode = 403;
    throw error;
  }

  res.status(200).json({ success: true, playlist });
});

// @route  PUT /api/v1/playlists/:id
export const updatePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    const error = new Error("Playlist not found");
    error.statusCode = 404;
    throw error;
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    const error = new Error("You do not own this playlist");
    error.statusCode = 403;
    throw error;
  }

  const { name, description, isPublic } = req.body;
  if (name !== undefined) playlist.name = name;
  if (description !== undefined) playlist.description = description;
  if (isPublic !== undefined) playlist.isPublic = isPublic;

  await playlist.save();

  res.status(200).json({ success: true, playlist });
});

// @route  DELETE /api/v1/playlists/:id
export const deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    const error = new Error("Playlist not found");
    error.statusCode = 404;
    throw error;
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    const error = new Error("You do not own this playlist");
    error.statusCode = 403;
    throw error;
  }

  await playlist.deleteOne();

  res.status(200).json({ success: true, message: "Playlist deleted successfully" });
});

// @route  PATCH /api/v1/playlists/:id/songs  (add a song)
export const addSongToPlaylist = asyncHandler(async (req, res) => {
  const { songId } = req.body;

  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    const error = new Error("Playlist not found");
    error.statusCode = 404;
    throw error;
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    const error = new Error("You do not own this playlist");
    error.statusCode = 403;
    throw error;
  }

  // Avoid duplicate songs in the same playlist
  if (playlist.songs.includes(songId)) {
    const error = new Error("Song is already in this playlist");
    error.statusCode = 409;
    throw error;
  }

  playlist.songs.push(songId);
  await playlist.save();

  res.status(200).json({ success: true, playlist });
});

// @route  DELETE /api/v1/playlists/:id/songs/:songId  (remove a song)
export const removeSongFromPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    const error = new Error("Playlist not found");
    error.statusCode = 404;
    throw error;
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    const error = new Error("You do not own this playlist");
    error.statusCode = 403;
    throw error;
  }

  playlist.songs = playlist.songs.filter(
    (id) => id.toString() !== req.params.songId
  );
  await playlist.save();

  res.status(200).json({ success: true, playlist });
});

// @route  PATCH /api/v1/playlists/liked/:songId  (toggle like/unlike)
export const toggleLikeSong = asyncHandler(async (req, res) => {
  const user = req.user;
  const { songId } = req.params;

  const alreadyLiked = user.likedSongs.some((id) => id.toString() === songId);

  if (alreadyLiked) {
    user.likedSongs = user.likedSongs.filter((id) => id.toString() !== songId);
  } else {
    user.likedSongs.push(songId);
  }

  await user.save();

  res.status(200).json({
    success: true,
    liked: !alreadyLiked,
    likedSongs: user.likedSongs,
  });
});

// @route  GET /api/v1/playlists/liked  (get liked songs, populated)
export const getLikedSongs = asyncHandler(async (req, res) => {
  const user = await req.user.populate({
    path: "likedSongs",
    populate: { path: "artist", select: "name image" },
  });

  res.status(200).json({ success: true, likedSongs: user.likedSongs });
});
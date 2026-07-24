import ListeningHistory from "../models/ListeningHistory.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route  POST /api/v1/history  (log a play — called by the frontend player)
export const logHistory = asyncHandler(async (req, res) => {
  const { songId } = req.body;

  const entry = await ListeningHistory.create({
    user: req.user._id,
    song: songId,
  });

  res.status(201).json({ success: true, entry });
});

// @route  GET /api/v1/history/recent  (recently played, deduplicated by song)
export const getRecentlyPlayed = asyncHandler(async (req, res) => {
  // Get the most recent 50 raw entries, newest first
  const rawHistory = await ListeningHistory.find({ user: req.user._id })
    .sort({ playedAt: -1 })
    .limit(50)
    .populate({
      path: "song",
      populate: { path: "artist", select: "name image" },
    });

  // Deduplicate by song ID, keeping only the most recent play of each song
  const seen = new Set();
  const deduped = [];

  for (const entry of rawHistory) {
    if (!entry.song) continue; // song may have been deleted
    const songId = entry.song._id.toString();
    if (!seen.has(songId)) {
      seen.add(songId);
      deduped.push(entry.song);
    }
    if (deduped.length >= 20) break; // cap at 20 unique recent songs
  }

  res.status(200).json({ success: true, recentlyPlayed: deduped });
});

// @route  GET /api/v1/history/most-played
export const getMostPlayed = asyncHandler(async (req, res) => {
  const results = await ListeningHistory.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: "$song", playCount: { $sum: 1 } } },
    { $sort: { playCount: -1 } },
    { $limit: 20 },
  ]);

  // Populate song details for each aggregated result
  const Song = (await import("../models/Song.js")).default;
  const songIds = results.map((r) => r._id);
  const songs = await Song.find({ _id: { $in: songIds } }).populate("artist", "name image");

  // Preserve the aggregation's play-count order
  const songMap = new Map(songs.map((s) => [s._id.toString(), s]));
  const orderedSongs = results
    .map((r) => songMap.get(r._id.toString()))
    .filter(Boolean);

  res.status(200).json({ success: true, mostPlayed: orderedSongs });
});
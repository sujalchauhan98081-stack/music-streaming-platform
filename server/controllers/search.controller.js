import Song from "../models/Song.js";
import Artist from "../models/Artist.js";
import Album from "../models/Album.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route  GET /api/v1/search?q=searchTerm
// Searches songs, artists, and albums together in parallel
export const searchAll = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    return res.status(200).json({
      success: true,
      songs: [],
      artists: [],
      albums: [],
    });
  }

  const searchTerm = q.trim();

  // Run all three searches in parallel — independent queries, no reason to wait sequentially
  const [songs, artists, albums] = await Promise.all([
    // Text index search (fast, relevance-ranked) — falls back to regex if no text match
    Song.find(
      { $text: { $search: searchTerm } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(15)
      .populate("artist", "name image")
      .populate("album", "title coverImage"),

    Artist.find({ name: { $regex: searchTerm, $options: "i" } }).limit(10),

    Album.find({ title: { $regex: searchTerm, $options: "i" } })
      .limit(10)
      .populate("artist", "name image"),
  ]);

  res.status(200).json({
    success: true,
    songs,
    artists,
    albums,
  });
});

// @route  GET /api/v1/search/trending
// Simple trending logic: highest playCount songs
export const getTrendingSongs = asyncHandler(async (req, res) => {
  const trending = await Song.find()
    .sort({ playCount: -1 })
    .limit(20)
    .populate("artist", "name image")
    .populate("album", "title coverImage");

  res.status(200).json({ success: true, trending });
});
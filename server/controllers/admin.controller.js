import User from "../models/User.js";
import Song from "../models/Song.js";
import Artist from "../models/Artist.js";
import Album from "../models/Album.js";
import ListeningHistory from "../models/ListeningHistory.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route  GET /api/v1/admin/stats  (dashboard overview cards)
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Run all counts in parallel — independent queries
  const [totalUsers, totalSongs, totalArtists, totalAlbums, totalStreamsResult] =
    await Promise.all([
      User.countDocuments(),
      Song.countDocuments(),
      Artist.countDocuments(),
      Album.countDocuments(),
      Song.aggregate([{ $group: { _id: null, total: { $sum: "$playCount" } } }]),
    ]);

  const totalStreams = totalStreamsResult[0]?.total || 0;

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalSongs,
      totalArtists,
      totalAlbums,
      totalStreams,
    },
  });
});

// @route  GET /api/v1/admin/analytics/top-songs
export const getTopSongsAnalytics = asyncHandler(async (req, res) => {
  const topSongs = await Song.find()
    .sort({ playCount: -1 })
    .limit(10)
    .select("title playCount")
    .populate("artist", "name");

  res.status(200).json({ success: true, topSongs });
});

// @route  GET /api/v1/admin/analytics/streams-over-time
// Groups listening history entries by day for the last 14 days — powers a line chart
export const getStreamsOverTime = asyncHandler(async (req, res) => {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const results = await ListeningHistory.aggregate([
    { $match: { playedAt: { $gte: fourteenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$playedAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const formatted = results.map((r) => ({ date: r._id, streams: r.count }));

  res.status(200).json({ success: true, streamsOverTime: formatted });
});

// @route  GET /api/v1/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, users });
});

// @route  PATCH /api/v1/admin/users/:id/role  (promote/demote admin)
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    const error = new Error("Role must be 'user' or 'admin'");
    error.statusCode = 400;
    throw error;
  }

  // Prevent an admin from accidentally demoting themselves and locking themselves out
  if (req.params.id === req.user._id.toString() && role !== "admin") {
    const error = new Error("You cannot change your own admin role");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ success: true, user });
});

// @route  PATCH /api/v1/admin/songs/:id/toggle-featured
export const toggleFeaturedSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);

  if (!song) {
    const error = new Error("Song not found");
    error.statusCode = 404;
    throw error;
  }

  song.isFeatured = !song.isFeatured;
  await song.save();

  res.status(200).json({ success: true, song });
});
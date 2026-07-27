import { validationResult } from "express-validator";
import ListeningHistory from "../models/ListeningHistory.js";
import Song from "../models/Song.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  generateRecommendations,
  generateMoodPlaylist,
  getChatbotReply,
  parseSmartSearchQuery,
} from "../services/groqService.js";

// Helper: given AI-suggested {title, artist} pairs, try to match them against
// our actual song catalog using fuzzy title matching (regex), since the AI
// only knows song names in general — not what's actually in our database.
const matchSuggestionsToLibrary = async (suggestions) => {
  const matched = [];

  for (const suggestion of suggestions) {
    const song = await Song.findOne({
      title: { $regex: suggestion.title, $options: "i" },
    })
      .populate("artist", "name image")
      .populate("album", "title coverImage");

    if (song) matched.push(song);
  }

  return matched;
};

// @route  GET /api/v1/ai/recommendations
export const getRecommendations = asyncHandler(async (req, res) => {
  const recentHistory = await ListeningHistory.find({ user: req.user._id })
    .sort({ playedAt: -1 })
    .limit(10)
    .populate("song", "title");

  if (recentHistory.length === 0) {
    return res.status(200).json({
      success: true,
      recommendations: [],
      message: "Listen to a few songs first to get personalized recommendations",
    });
  }

  const recentTitles = recentHistory
    .filter((h) => h.song)
    .map((h) => h.song.title);

  const aiResult = await generateRecommendations(recentTitles);
  const matchedSongs = await matchSuggestionsToLibrary(aiResult.recommendations || []);

  res.status(200).json({
    success: true,
    recommendations: matchedSongs,
    aiSuggestions: aiResult.recommendations || [], // raw AI output, in case nothing matched our catalog
    aiSucceeded: (aiResult.recommendations || []).length > 0,
  });
});

// @route  POST /api/v1/ai/mood-playlist
export const getMoodPlaylist = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { mood } = req.body;
  const aiResult = await generateMoodPlaylist(mood);
  const matchedSongs = await matchSuggestionsToLibrary(aiResult.songs || []);

  res.status(200).json({
    success: true,
    playlistName: aiResult.playlistName || `${mood} Mix`,
    songs: matchedSongs,
    aiSuggestions: aiResult.songs || [],
    aiSucceeded: (aiResult.songs || []).length > 0, 
  });
});

// @route  POST /api/v1/ai/chat
export const chatWithAi = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { message, history = [] } = req.body;

  // history comes from frontend as [{ role: "user"/"assistant", content: "..." }]
  const conversationHistory = [...history, { role: "user", content: message }];

  const reply = await getChatbotReply(conversationHistory);

  res.status(200).json({ success: true, reply });
});

// @route  POST /api/v1/ai/smart-search
export const smartSearch = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { query } = req.body;
  const parsed = await parseSmartSearchQuery(query);

  // Build a MongoDB query from the AI's extracted intent
  const searchConditions = [];

  if (parsed.genre) {
    searchConditions.push({ genre: { $regex: parsed.genre, $options: "i" } });
  }
  if (parsed.keywords && parsed.keywords.length > 0) {
    searchConditions.push({
      title: { $regex: parsed.keywords.join("|"), $options: "i" },
    });
  }

  const songs =
    searchConditions.length > 0
      ? await Song.find({ $or: searchConditions })
          .limit(20)
          .populate("artist", "name image")
          .populate("album", "title coverImage")
      : [];

  res.status(200).json({
    success: true,
    parsedIntent: parsed,
    songs,
  });
});
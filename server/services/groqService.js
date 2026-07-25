import groq from "../config/groq.js";

// Using GPT-OSS models — Groq deprecated the Llama 3.x chat models in mid-2026
const CHAT_MODEL = "openai/gpt-oss-120b";   // was: "llama-3.3-70b-versatile"
const FAST_MODEL = "openai/gpt-oss-20b";     // was: "llama3-8b-8192"

// --- Generic chat completion wrapper ---
const getChatCompletion = async (messages, model = CHAT_MODEL, jsonMode = false) => {
  const completion = await groq.chat.completions.create({
    messages,
    model,
    temperature: 0.7,
    max_tokens: 1024,
    ...(jsonMode && { response_format: { type: "json_object" } }),
  });

  return completion.choices[0]?.message?.content || "";
};

// --- 1. AI Music Recommendations based on listening history ---
export const generateRecommendations = async (recentSongTitles) => {
  const prompt = `You are a music recommendation engine. Based on this listener's recent listening history: ${recentSongTitles.join(
    ", "
  )}, suggest 8 song titles and artist names they might enjoy next. Respond ONLY with valid JSON in this exact format, no other text: {"recommendations": [{"title": "...", "artist": "..."}]}`;

  const response = await getChatCompletion(
    [{ role: "user", content: prompt }],
    FAST_MODEL,
    true
  );

  try {
    return JSON.parse(response);
  } catch (err) {
    return { recommendations: [] };
  }
};

// --- 2. Mood-Based Recommendations ---
export const generateMoodPlaylist = async (mood) => {
  const prompt = `Generate a playlist concept for someone feeling "${mood}". Suggest 8 song titles and artist names that match this mood well, and a short creative playlist name. Respond ONLY with valid JSON in this exact format, no other text: {"playlistName": "...", "songs": [{"title": "...", "artist": "..."}]}`;

  const response = await getChatCompletion(
    [{ role: "user", content: prompt }],
    FAST_MODEL,
    true
  );

  try {
    return JSON.parse(response);
  } catch (err) {
    return { playlistName: `${mood} Mix`, songs: [] };
  }
};

// --- 3. AI Music Chatbot (conversational, keeps history) ---
export const getChatbotReply = async (conversationHistory) => {
  const systemMessage = {
    role: "system",
    content:
      "You are Sonique AI, a friendly and knowledgeable music assistant. Help users discover music, answer questions about artists/genres/songs, and give playlist advice. Keep responses conversational and concise (2-4 sentences unless asked for detail).",
  };

  const response = await getChatCompletion([systemMessage, ...conversationHistory], CHAT_MODEL);
  return response;
};

// --- 4. AI Smart Search (natural language -> structured search intent) ---
export const parseSmartSearchQuery = async (naturalLanguageQuery) => {
  const prompt = `A user searched for: "${naturalLanguageQuery}" in a music app. Extract their intent as JSON. Respond ONLY with valid JSON in this exact format, no other text: {"genre": "...", "mood": "...", "keywords": ["...", "..."]}. Use empty string "" for genre/mood if not clearly implied, and an empty array for keywords if none.`;

  const response = await getChatCompletion(
    [{ role: "user", content: prompt }],
    FAST_MODEL,
    true
  );

  try {
    return JSON.parse(response);
  } catch (err) {
    return { genre: "", mood: "", keywords: [naturalLanguageQuery] };
  }
};
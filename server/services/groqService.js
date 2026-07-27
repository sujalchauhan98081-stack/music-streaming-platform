import groq from "../config/groq.js";

// Using GPT-OSS models — Groq deprecated the Llama 3.x chat models in mid-2026
const CHAT_MODEL = "openai/gpt-oss-120b";   // was: "llama-3.3-70b-versatile"
const FAST_MODEL = "openai/gpt-oss-20b";     // was: "llama3-8b-8192"

// --- Generic chat completion wrapper ---
const getChatCompletion = async (messages, model = CHAT_MODEL, jsonMode = false,options={}) => {
  const completion = await groq.chat.completions.create({
    messages,
    model,
    temperature: options.temperature??0.7,
    max_tokens: options.maxTokens ?? 1024,
    ...(jsonMode && { response_format: { type: "json_object" } }),
  });

  return completion.choices[0]?.message?.content || "";
};

// --- Retry helper: JSON-mode structured calls occasionally get truncated or
// malformed, especially with longer non-English output. One retry with the
// larger, more capable model meaningfully reduces the failure rate. ---
const getStructuredJson = async (prompt) => {
  try {
    // First attempt: faster model, generous token budget, lower temperature
    // for more consistent formatting
    const response = await getChatCompletion(
      [{ role: "user", content: prompt }],
      FAST_MODEL,
      true,
      { temperature: 0.4, maxTokens: 1500 }
    );
    return JSON.parse(response);
  } catch (err) {
    console.error("First AI attempt failed, retrying with larger model:", err.message);
    try {
      // Retry with the larger, more instruction-reliable model
      const response = await getChatCompletion(
        [{ role: "user", content: prompt }],
        CHAT_MODEL,
        true,
        { temperature: 0.4, maxTokens: 1500 }
      );
      return JSON.parse(response);
    } catch (retryErr) {
      console.error("Retry with larger model also failed:", retryErr.message);
      throw retryErr; // let the caller's fallback handle this
    }
  }
};

// --- 1. AI Music Recommendations based on listening history ---
export const generateRecommendations = async (recentSongTitles) => {
  const prompt = `You are a music recommendation engine specializing in Hindi and Indian music (Bollywood, Indian pop, Indian indie, regional Indian film music). Based on this listener's recent listening history: ${recentSongTitles.join(
    ", "
  )}, suggest 8 Hindi/Indian song titles and artist names they might enjoy next. Only suggest Hindi or Indian-language songs, not English/Western songs. Use only plain Roman letters for titles and artist names. Respond ONLY with valid, well-formed JSON in this exact format, no markdown, no extra text: {"recommendations": [{"title": "...", "artist": "..."}]}`;

  try {
    return await getStructuredJson(prompt);
  } catch (err) {
    return { recommendations: [] };
  }
};

export const generateMoodPlaylist = async (mood) => {
  const prompt = `Generate a Hindi/Indian music playlist concept for someone feeling "${mood}". Suggest 8 Hindi or Indian-language song titles and artist names (Bollywood, Indian pop, Indian indie, or regional Indian film music) that match this mood well, and a short creative playlist name. Only suggest Hindi or Indian-language songs, not English/Western songs. Use only plain Roman letters for titles and artist names. Respond ONLY with valid, well-formed JSON in this exact format, no markdown, no extra text: {"playlistName": "...", "songs": [{"title": "...", "artist": "..."}]}`;

  try {
    return await getStructuredJson(prompt);
  } catch (err) {
    return { playlistName: `${mood} Mix`, songs: [] };
  }
};

  
// --- 3. AI Music Chatbot (conversational, keeps history) ---

export const getChatbotReply = async (conversationHistory) => {
  const systemMessage = {
    role: "system",
    content:
      "You are Sonique AI, a friendly and knowledgeable music assistant specializing in Hindi and Indian music (Bollywood, Indian pop, Indian indie, regional film music). Help users discover Hindi/Indian music, answer questions about Indian artists/genres/songs, and give playlist advice focused on Indian music. When suggesting songs, prefer Hindi or Indian-language music over English/Western unless the user specifically asks for something else. Keep responses conversational and concise (2-4 sentences unless asked for detail).",
  };

  const response = await getChatCompletion([systemMessage, ...conversationHistory], CHAT_MODEL);
  return response;
};

// --- 4. AI Smart Search (natural language -> structured search intent) ---

export const parseSmartSearchQuery = async (naturalLanguageQuery) => {
  const prompt = `A user searched for: "${naturalLanguageQuery}" in a music app. Extract their intent as JSON. Respond ONLY with valid JSON in this exact format, no other text: {"genre": "...", "mood": "...", "keywords": ["...", "..."]}. Use empty string "" for genre/mood if not clearly implied, and an empty array for keywords if none.`;

  try {
    return await getStructuredJson(prompt);
  } catch (err) {
    return { genre: "", mood: "", keywords: [naturalLanguageQuery] };
  }
};
import axiosInstance from "./axiosInstance";

export const getRecommendationsApi = () => axiosInstance.get("/ai/recommendations");
export const getMoodPlaylistApi = (mood) => axiosInstance.post("/ai/mood-playlist", { mood });
export const chatWithAiApi = (message, history) =>
  axiosInstance.post("/ai/chat", { message, history });
export const smartSearchApi = (query) => axiosInstance.post("/ai/smart-search", { query });
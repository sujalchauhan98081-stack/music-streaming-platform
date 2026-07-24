import axiosInstance from "./axiosInstance";

export const logHistoryApi = (songId) => axiosInstance.post("/history", { songId });
export const getRecentlyPlayedApi = () => axiosInstance.get("/history/recent");
export const getMostPlayedApi = () => axiosInstance.get("/history/most-played");
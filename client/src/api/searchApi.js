import axiosInstance from "./axiosInstance";

export const searchAllApi = (query) =>
  axiosInstance.get(`/search?q=${encodeURIComponent(query)}`);

export const getTrendingSongsApi = () => axiosInstance.get("/search/trending");
import axiosInstance from "./axiosInstance";

export const getDashboardStatsApi = () => axiosInstance.get("/admin/stats");
export const getTopSongsAnalyticsApi = () => axiosInstance.get("/admin/analytics/top-songs");
export const getStreamsOverTimeApi = () => axiosInstance.get("/admin/analytics/streams-over-time");
export const getAllUsersApi = () => axiosInstance.get("/admin/users");
export const updateUserRoleApi = (id, role) =>
  axiosInstance.patch(`/admin/users/${id}/role`, { role });
export const toggleFeaturedSongApi = (id) =>
  axiosInstance.patch(`/admin/songs/${id}/toggle-featured`);
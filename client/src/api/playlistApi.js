import axiosInstance from "./axiosInstance";

export const createPlaylistApi = (data) => axiosInstance.post("/playlists", data);
export const getMyPlaylistsApi = () => axiosInstance.get("/playlists/me");
export const getPlaylistByIdApi = (id) => axiosInstance.get(`/playlists/${id}`);
export const updatePlaylistApi = (id, data) => axiosInstance.put(`/playlists/${id}`, data);
export const deletePlaylistApi = (id) => axiosInstance.delete(`/playlists/${id}`);
export const addSongToPlaylistApi = (id, songId) =>
  axiosInstance.patch(`/playlists/${id}/songs`, { songId });
export const removeSongFromPlaylistApi = (id, songId) =>
  axiosInstance.delete(`/playlists/${id}/songs/${songId}`);
export const toggleLikeSongApi = (songId) =>
  axiosInstance.patch(`/playlists/liked/${songId}`);
export const getLikedSongsApi = () => axiosInstance.get("/playlists/liked");
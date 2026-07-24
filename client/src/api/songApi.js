import axiosInstance from "./axiosInstance";

export const getAllSongsApi = () => axiosInstance.get("/songs");
export const getSongByIdApi = (id) => axiosInstance.get(`/songs/${id}`);
export const incrementPlayCountApi = (id) => axiosInstance.patch(`/songs/${id}/play`);
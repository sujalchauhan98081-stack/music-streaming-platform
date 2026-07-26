import axiosInstance from "./axiosInstance";

export const getAlbumByIdApi = (id) => axiosInstance.get(`/albums/${id}`);
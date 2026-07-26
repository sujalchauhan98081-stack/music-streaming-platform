import axiosInstance from "./axiosInstance";

export const getArtistByIdApi = (id) => axiosInstance.get(`/artists/${id}`);

export const getSongsByArtistApi = (id) => axiosInstance.get(`/artists/${id}/songs`);
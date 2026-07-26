import axiosInstance from "./axiosInstance";

export const registerApi = (data) => axiosInstance.post("/auth/register", data);

export const loginApi = (data) => axiosInstance.post("/auth/login", data);

export const logoutApi = () => axiosInstance.post("/auth/logout");

export const refreshApi = () => axiosInstance.post("/auth/refresh");

export const getCurrentUserApi = () => axiosInstance.get("/auth/me");

export const updateProfileApi = (data) => axiosInstance.put("/auth/profile", data);

export const changePasswordApi = (data) => axiosInstance.put("/auth/change-password", data);
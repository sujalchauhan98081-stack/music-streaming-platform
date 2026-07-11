import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  loginApi,
  registerApi,
  logoutApi,
  getCurrentUserApi,
} from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for a persisted session

  // On app load, try to restore the session using the refresh token cookie
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await getCurrentUserApi();
        setUser(data.user);
      } catch (err) {
        // Access token invalid/expired and refresh failed — clear it
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials) => {
    const { data } = await loginApi(credentials);
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    toast.success("Welcome back!");
  };

  const register = async (formData) => {
    const { data } = await registerApi(formData);
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    toast.success("Account created successfully!");
  };

  const logout = async () => {
    await logoutApi();
    localStorage.removeItem("accessToken");
    setUser(null);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
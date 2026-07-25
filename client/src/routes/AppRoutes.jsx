import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Library from "../pages/Library";
import PlaylistDetail from "../pages/PlaylistDetail";
import LikedSongs from "../pages/LikedSongs";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/NotFound";
import Search from "../pages/Search";
import AiChat from "../pages/AiChat";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminSongs from "../pages/admin/AdminSongs";
import AdminArtists from "../pages/admin/AdminArtists";
import AdminAlbums from "../pages/admin/AdminAlbums";
import AdminUsers from "../pages/admin/AdminUsers";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Library />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/playlist/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PlaylistDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/liked-songs"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LikedSongs />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Search />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-chat"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AiChat />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/songs"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminSongs />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/artists"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminArtists />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/albums"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminAlbums />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
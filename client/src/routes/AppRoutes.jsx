import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../layouts/AdminLayout";
import PageLoader from "../components/ui/PageLoader";

// Lazy-loaded pages — each becomes its own separate JS chunk, downloaded
// only when the user actually navigates there, instead of all upfront
const Home = lazy(() => import("../pages/Home"));
const Library = lazy(() => import("../pages/Library"));
const PlaylistDetail = lazy(() => import("../pages/PlaylistDetail"));
const LikedSongs = lazy(() => import("../pages/LikedSongs"));
const Search = lazy(() => import("../pages/Search"));
const AiChat = lazy(() => import("../pages/AiChat"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const NotFound = lazy(() => import("../pages/NotFound"));
const RecentlyPlayed = lazy(() => import("../pages/RecentlyPlayed"));
const MostPlayed = lazy(() => import("../pages/MostPlayed"));
const ArtistProfile = lazy(() => import("../pages/ArtistProfile"));
const AlbumDetail = lazy(() => import("../pages/AlbumDetail"));
// Admin pages are especially worth lazy-loading — Recharts is a fairly
// large dependency that regular (non-admin) users should never have to download
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminSongs = lazy(() => import("../pages/admin/AdminSongs"));
const AdminArtists = lazy(() => import("../pages/admin/AdminArtists"));
const AdminAlbums = lazy(() => import("../pages/admin/AdminAlbums"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));
const Profile = lazy(() => import("../pages/Profile"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
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
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/artist/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ArtistProfile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/album/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AlbumDetail />
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
          path="/recently-played"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RecentlyPlayed />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/most-played"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MostPlayed />
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
    </Suspense>
  );
};

export default AppRoutes;
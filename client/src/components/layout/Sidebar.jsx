import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Library as LibraryIcon,
  PlusSquare,
  Heart,
  Clock,
  TrendingUp,
  Sparkles,
  X,
} from "lucide-react";
import CreatePlaylistModal from "../playlist/CreatePlaylistModal";

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { icon: <Home size={22} />, label: "Home", to: "/" },
    { icon: <Search size={22} />, label: "Search", to: "/search" },
    { icon: <LibraryIcon size={22} />, label: "Your Library", to: "/library" },
    { icon: <Clock size={22} />, label: "Recently Played", to: "/recently-played" },
    { icon: <TrendingUp size={22} />, label: "Most Played", to: "/most-played" },
    { icon: <Sparkles size={22} />, label: "AI Chat", to: "/ai-chat" },
  ];

  const handlePlaylistCreated = (newPlaylist) => {
    navigate(`/playlist/${newPlaylist._id}`);
    onMobileClose?.();
  };

  // Close the drawer whenever a nav link is tapped — otherwise it stays open
  // and covers the page the user just navigated to
  const handleLinkClick = () => {
    onMobileClose?.();
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-textPrimary">🎵 Sonique</h1>
        {/* Close button — only rendered/visible in the mobile drawer context */}
        <button
          onClick={onMobileClose}
          className="md:hidden text-textSecondary hover:text-textPrimary"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            onClick={handleLinkClick}
            className="flex items-center gap-4 text-textSecondary hover:text-textPrimary transition-colors font-medium"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-surfaceHover my-2" />

      <nav className="flex flex-col gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-4 text-textSecondary hover:text-textPrimary transition-colors font-medium"
        >
          <PlusSquare size={20} />
          Create Playlist
        </button>
        <Link
          to="/liked-songs"
          onClick={handleLinkClick}
          className="flex items-center gap-4 text-textSecondary hover:text-textPrimary transition-colors font-medium"
        >
          <Heart size={20} />
          Liked Songs
        </Link>
      </nav>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handlePlaylistCreated}
      />
    </>
  );

  return (
    <>
      {/* --- Desktop: static sidebar, always visible, unchanged from before --- */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-black p-6 gap-6 sticky top-0">
        {sidebarContent}
      </aside>

      {/* --- Mobile: overlay drawer, only rendered when open --- */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop — tapping it closes the drawer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            {/* Sliding drawer panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 h-screen w-72 max-w-[80vw] bg-black p-6 flex flex-col gap-6 z-50 md:hidden overflow-y-auto"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
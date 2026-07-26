import { Link, useNavigate } from "react-router-dom";
import { Home, Search, Library as LibraryIcon, PlusSquare, Heart } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

import CreatePlaylistModal from "../playlist/CreatePlaylistModal";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";
import { Clock, TrendingUp } from "lucide-react";

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

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
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-black p-6 gap-6 sticky top-0">
      <h1 className="text-2xl font-bold text-textPrimary mb-4">🎵 Sonique</h1><hr />

      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
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
          onClick={()=> setIsModalOpen(true)}
          className="flex items-center gap-4 text-textSecondary hover:text-textPrimary transition-colors font-medium"
        >
          <PlusSquare size={20} />
          Create Playlist
        </button>
        <Link
          to="/liked-songs"
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
    </aside>

    
  );
};

export default Sidebar;
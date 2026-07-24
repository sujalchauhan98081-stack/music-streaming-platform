import { Link, useNavigate } from "react-router-dom";
import { Home, Search, Library as LibraryIcon, PlusSquare, Heart } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { createPlaylistApi } from "../../api/playlistApi";
import toast from "react-hot-toast";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { icon: <Home size={22} />, label: "Home", to: "/" },
    { icon: <Search size={22} />, label: "Search", to: "/search" },
    { icon: <LibraryIcon size={22} />, label: "Your Library", to: "/library" },
  ];

  const handleQuickCreate = async () => {
    try {
      const { data } = await createPlaylistApi({ name: "New Playlist", isPublic: true });
      toast.success("Playlist created!");
      navigate(`/playlist/${data.playlist._id}`);
    } catch (err) {
      toast.error("Failed to create playlist");
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-black p-6 gap-6 sticky top-0">
      <h1 className="text-2xl font-bold text-textPrimary mb-4">🎵 Sonique</h1>

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
          onClick={handleQuickCreate}
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

      <div className="mt-auto">
        <button
          onClick={logout}
          className="text-sm text-textSecondary hover:text-textPrimary"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Heart, Trash2
} from "lucide-react";
import { getMyPlaylistsApi, deletePlaylistApi } from "../api/playlistApi";
import CreatePlaylistModal from "../components/playlist/CreatePlaylistModal";
import toast from "react-hot-toast";
import SkeletonCard from "../components/ui/SkeletonCard";

const Library = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPlaylists = async () => {
    try {
      const { data } = await getMyPlaylistsApi();
      setPlaylists(data.playlists);
    } catch (err) {
      toast.error("Failed to load playlists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreated = (newPlaylist) => {
    setPlaylists((prev) => [newPlaylist, ...prev]);
  };
  const handleDelete = async (e, playlistId, playlistName) => {
    e.preventDefault(); // prevent the <Link> navigation from firing
    e.stopPropagation();

    if (!window.confirm(`Delete "${playlistName}"? This cannot be undone.`)) return;

    try {
      await deletePlaylistApi(playlistId);
      toast.success("Playlist deleted");
      setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete playlist");
    }
  };

  if (loading) {
    return (
      <div className="pt-6">
        <h2 className="text-3xl font-bold mb-6">Your Library</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Your Library</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-surface hover:bg-surfaceHover px-4 py-2 rounded-full text-sm font-medium"
        >
          <Plus size={16} /> New Playlist
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Liked Songs — always shown first, like Spotify's pinned "Liked Songs" */}
        <Link
          to="/liked-songs"
          className="bg-gradient-to-br from-purple-700 to-blue-500 p-4 rounded-md hover:opacity-90 transition-opacity aspect-square flex flex-col justify-end"
        >
          <Heart size={32} fill="white" className="mb-2" />
          <p className="font-bold">Liked Songs</p>
        </Link>

        {playlists.map((playlist) => (
          <Link
            key={playlist._id}
            to={`/playlist/${playlist._id}`}
            className="bg-surface hover:bg-surfaceHover p-4 rounded-md transition-colors relative group"
          >
            <div className="w-full aspect-square bg-surfaceHover rounded-md mb-3 flex items-center justify-center text-textSecondary text-sm">
              {playlist.coverImage ? (
                <img
                  src={playlist.coverImage}
                  alt={playlist.name}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                "No cover"
              )}
            </div>
            <p className="font-medium truncate">{playlist.name}</p>
            <p className="text-sm text-textSecondary">{playlist.songs.length} songs</p>

            <button
              onClick={(e) => handleDelete(e, playlist._id, playlist.name)}
              className="absolute top-2 right-2 bg-black/60 text-textSecondary hover:text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete playlist"
            >
              <Trash2 size={16} />
            </button>
          </Link>
        ))}
      </div>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default Library;
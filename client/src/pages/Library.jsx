import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Heart } from "lucide-react";
import { getMyPlaylistsApi } from "../api/playlistApi";
import CreatePlaylistModal from "../components/playlist/CreatePlaylistModal";
import toast from "react-hot-toast";

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

  if (loading) return <p className="text-textSecondary pt-6">Loading library...</p>;

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
            className="bg-surface hover:bg-surfaceHover p-4 rounded-md transition-colors"
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
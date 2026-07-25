import { useEffect, useState } from "react";
import { Plus, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { toggleFeaturedSongApi } from "../../api/adminApi";
import SongFormModal from "../../components/admin/SongFormModal";
import { formatTime } from "../../utils/formatTime";

const AdminSongs = () => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAll = async () => {
    try {
      const [songsRes, artistsRes, albumsRes] = await Promise.all([
        axiosInstance.get("/songs"),
        axiosInstance.get("/artists"),
        axiosInstance.get("/albums"),
      ]);
      setSongs(songsRes.data.songs);
      setArtists(artistsRes.data.artists);
      setAlbums(albumsRes.data.albums);
    } catch (err) {
      toast.error("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this song permanently?")) return;
    try {
      await axiosInstance.delete(`/songs/${id}`);
      toast.success("Song deleted");
      setSongs((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      toast.error("Failed to delete song");
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const { data } = await toggleFeaturedSongApi(id);
      setSongs((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isFeatured: data.song.isFeatured } : s))
      );
    } catch (err) {
      toast.error("Failed to update featured status");
    }
  };

  if (loading) return <p className="text-textSecondary">Loading songs...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Songs</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform"
        >
          <Plus size={16} /> Add Song
        </button>
      </div>

      <div className="bg-surface rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surfaceHover text-textSecondary text-left">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Artist</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Plays</th>
              <th className="p-4">Featured</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song._id} className="border-t border-surfaceHover">
                <td className="p-4">{song.title}</td>
                <td className="p-4 text-textSecondary">{song.artist?.name || "—"}</td>
                <td className="p-4 text-textSecondary">{formatTime(song.duration)}</td>
                <td className="p-4 text-textSecondary">{song.playCount}</td>
                <td className="p-4">
                  <button onClick={() => handleToggleFeatured(song._id)}>
                    <Star
                      size={18}
                      className={song.isFeatured ? "text-primary" : "text-textSecondary"}
                      fill={song.isFeatured ? "currentColor" : "none"}
                    />
                  </button>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(song._id)}
                    className="text-textSecondary hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {songs.length === 0 && (
          <p className="text-textSecondary text-center py-8">No songs yet.</p>
        )}
      </div>

      <SongFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAll}
        artists={artists}
        albums={albums}
      />
    </div>
  );
};

export default AdminSongs;
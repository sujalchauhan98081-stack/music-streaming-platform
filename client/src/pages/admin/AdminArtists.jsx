import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import ArtistFormModal from "../../components/admin/ArtistFormModal";

const AdminArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchArtists = async () => {
    try {
      const { data } = await axiosInstance.get("/artists");
      setArtists(data.artists);
    } catch (err) {
      toast.error("Failed to load artists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this artist? Songs referencing them may break.")) return;
    try {
      await axiosInstance.delete(`/artists/${id}`);
      toast.success("Artist deleted");
      setArtists((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.error("Failed to delete artist");
    }
  };

  if (loading) return <p className="text-textSecondary">Loading artists...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Artists</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform"
        >
          <Plus size={16} /> Add Artist
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {artists.map((artist) => (
          <div key={artist._id} className="bg-surface rounded-lg p-4 text-center relative group">
            <img
              src={artist.image || "/placeholder-cover.png"}
              alt={artist.name}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
            />
            <p className="font-medium truncate">{artist.name}</p>
            <button
              onClick={() => handleDelete(artist._id)}
              className="absolute top-2 right-2 text-textSecondary hover:text-red-500 opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {artists.length === 0 && (
          <p className="text-textSecondary col-span-full text-center py-8">No artists yet.</p>
        )}
      </div>

      <ArtistFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchArtists}
      />
    </div>
  );
};

export default AdminArtists;
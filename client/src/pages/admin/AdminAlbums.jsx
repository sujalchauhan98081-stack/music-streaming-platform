import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import AlbumFormModal from "../../components/admin/AlbumFormModal";

const AdminAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAll = async () => {
    try {
      const [albumsRes, artistsRes] = await Promise.all([
        axiosInstance.get("/albums"),
        axiosInstance.get("/artists"),
      ]);
      setAlbums(albumsRes.data.albums);
      setArtists(artistsRes.data.artists);
    } catch (err) {
      toast.error("Failed to load albums");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this album? Songs in it will remain but lose their album link.")) return;
    try {
      await axiosInstance.delete(`/albums/${id}`);
      toast.success("Album deleted");
      setAlbums((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.error("Failed to delete album");
    }
  };

  if (loading) return <p className="text-textSecondary">Loading albums...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Albums</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform"
        >
          <Plus size={16} /> Add Album
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {albums.map((album) => (
          <div key={album._id} className="bg-surface rounded-lg p-4 relative group">
            <img
              src={album.coverImage || "/placeholder-cover.png"}
              alt={album.title}
              className="w-full aspect-square object-cover rounded-md mb-3"
            />
            <p className="font-medium truncate">{album.title}</p>
            <p className="text-sm text-textSecondary truncate">{album.artist?.name || "—"}</p>
            <button
              onClick={() => handleDelete(album._id)}
              className="absolute top-2 right-2 text-textSecondary hover:text-red-500 opacity-0 group-hover:opacity-100 bg-black/50 rounded-full p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {albums.length === 0 && (
          <p className="text-textSecondary col-span-full text-center py-8">No albums yet.</p>
        )}
      </div>

      <AlbumFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAll}
        artists={artists}
      />
    </div>
  );
};

export default AdminAlbums;
import { useState, useEffect } from "react";
import { Plus, Check } from "lucide-react";
import toast from "react-hot-toast";
import { getMyPlaylistsApi, addSongToPlaylistApi, createPlaylistApi } from "../../api/playlistApi";

const AddToPlaylistModal = ({ isOpen, onClose, song }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState(new Set()); // tracks which playlists we just added to, for instant checkmark feedback
  const [creatingNew, setCreatingNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchPlaylists = async () => {
      setLoading(true);
      try {
        const { data } = await getMyPlaylistsApi();
        setPlaylists(data.playlists);
      } catch (err) {
        toast.error("Failed to load playlists");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await addSongToPlaylistApi(playlistId, song._id);
      setAddedIds((prev) => new Set(prev).add(playlistId));
      toast.success("Added to playlist");
    } catch (err) {
      // Backend returns 409 if the song is already in that playlist — surface that clearly
      if (err.response?.status === 409) {
        toast.error("Song is already in this playlist");
      } else {
        toast.error("Failed to add song");
      }
    }
  };

  const handleCreateAndAdd = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return toast.error("Playlist name is required");

    try {
      const { data } = await createPlaylistApi({ name: newPlaylistName, isPublic: true });
      await addSongToPlaylistApi(data.playlist._id, song._id);
      setPlaylists((prev) => [data.playlist, ...prev]);
      setAddedIds((prev) => new Set(prev).add(data.playlist._id));
      setNewPlaylistName("");
      setCreatingNew(false);
      toast.success(`Created "${data.playlist.name}" and added song`);
    } catch (err) {
      toast.error("Failed to create playlist");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-lg p-6 w-full max-w-sm max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside the modal itself
      >
        <h2 className="text-lg font-bold mb-1">Add to Playlist</h2>
        <p className="text-sm text-textSecondary truncate mb-4">{song.title}</p>

        <div className="flex-1 overflow-y-auto flex flex-col gap-1 mb-4">
          {loading ? (
            <p className="text-textSecondary text-sm py-4 text-center">Loading playlists...</p>
          ) : playlists.length === 0 ? (
            <p className="text-textSecondary text-sm py-4 text-center">
              You don't have any playlists yet.
            </p>
          ) : (
            playlists.map((playlist) => {
              const isAdded = addedIds.has(playlist._id);
              return (
                <button
                  key={playlist._id}
                  onClick={() => handleAddToPlaylist(playlist._id)}
                  disabled={isAdded}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-surfaceHover text-left disabled:opacity-60"
                >
                  <span className="truncate">{playlist.name}</span>
                  {isAdded && <Check size={16} className="text-primary shrink-0" />}
                </button>
              );
            })
          )}
        </div>

        {creatingNew ? (
          <form onSubmit={handleCreateAndAdd} className="flex gap-2">
            <input
              type="text"
              autoFocus
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name"
              className="flex-1 bg-background px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              type="submit"
              className="bg-primary text-black px-3 py-2 rounded-md text-sm font-medium"
            >
              Create
            </button>
          </form>
        ) : (
          <button
            onClick={() => setCreatingNew(true)}
            className="flex items-center gap-2 text-sm text-textSecondary hover:text-textPrimary px-3 py-2"
          >
            <Plus size={16} /> Create new playlist
          </button>
        )}

        <button
          onClick={onClose}
          className="mt-3 text-sm text-textSecondary hover:text-textPrimary text-center"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
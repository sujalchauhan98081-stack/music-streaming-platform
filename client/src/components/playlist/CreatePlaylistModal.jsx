import { useState } from "react";
import toast from "react-hot-toast";
import { createPlaylistApi } from "../../api/playlistApi";
import Button from "../ui/Button";
import InputField from "../ui/InputField";

const CreatePlaylistModal = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Playlist name is required");

    setLoading(true);
    try {
      const { data } = await createPlaylistApi({ name, isPublic: true });
      toast.success("Playlist created!");
      onCreated(data.playlist);
      setName("");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-surface rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Create Playlist</h2>
        <form onSubmit={handleCreate}>
          <InputField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Playlist"
            autoFocus
          />
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-full border border-surfaceHover text-textSecondary hover:text-textPrimary"
            >
              Cancel
            </button>
            <div className="flex-1">
              <Button type="submit" loading={loading}>
                Create
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
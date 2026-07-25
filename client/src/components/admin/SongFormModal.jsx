import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Button from "../ui/Button";
import InputField from "../ui/InputField";

const SongFormModal = ({ isOpen, onClose, onSuccess, artists, albums }) => {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    duration: "",
    genre: "",
  });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.artist || !formData.duration || !audioFile) {
      return toast.error("Title, artist, duration, and audio file are required");
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("artist", formData.artist);
    if (formData.album) data.append("album", formData.album);
    data.append("duration", formData.duration);
    data.append("genre", formData.genre);
    data.append("audio", audioFile);
    if (coverFile) data.append("cover", coverFile);

    setLoading(true);
    try {
      await axiosInstance.post("/songs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Song created successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create song");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 overflow-y-auto py-8">
      <div className="bg-surface rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Song</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
          <InputField
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="mb-4">
            <label className="text-sm text-textSecondary font-medium block mb-1">Artist</label>
            <select
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              className="w-full bg-background text-textPrimary px-4 py-3 rounded-md outline-none border border-transparent focus:border-primary"
            >
              <option value="">Select an artist</option>
              {artists.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="text-sm text-textSecondary font-medium block mb-1">
              Album (optional)
            </label>
            <select
              value={formData.album}
              onChange={(e) => setFormData({ ...formData, album: e.target.value })}
              className="w-full bg-background text-textPrimary px-4 py-3 rounded-md outline-none border border-transparent focus:border-primary"
            >
              <option value="">No album (single)</option>
              {albums.map((al) => (
                <option key={al._id} value={al._id}>
                  {al.title}
                </option>
              ))}
            </select>
          </div>

          <InputField
            label="Duration (seconds)"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />
          <InputField
            label="Genre"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          />

          <div className="mb-4">
            <label className="text-sm text-textSecondary font-medium block mb-1">
              Audio File
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])}
              className="text-sm text-textSecondary"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-textSecondary font-medium block mb-1">
              Cover Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0])}
              className="text-sm text-textSecondary"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-full border border-surfaceHover text-textSecondary hover:text-textPrimary"
            >
              Cancel
            </button>
            <div className="flex-1">
              <Button type="submit" loading={loading}>
                Create Song
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SongFormModal;
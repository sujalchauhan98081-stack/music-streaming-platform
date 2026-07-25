import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Button from "../ui/Button";
import InputField from "../ui/InputField";

const AlbumFormModal = ({ isOpen, onClose, onSuccess, artists }) => {
  const [formData, setFormData] = useState({ title: "", artist: "", genre: "" });
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.artist) {
      return toast.error("Title and artist are required");
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("artist", formData.artist);
    data.append("genre", formData.genre);
    if (coverFile) data.append("cover", coverFile);

    setLoading(true);
    try {
      await axiosInstance.post("/albums", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Album created successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create album");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-surface rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Album</h2>
        <form onSubmit={handleSubmit}>
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

          <InputField
            label="Genre"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          />

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
                Create Album
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlbumFormModal;
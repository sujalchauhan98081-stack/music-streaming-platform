import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Button from "../ui/Button";
import InputField from "../ui/InputField";

const ArtistFormModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: "", bio: "", genres: "" });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Artist name is required");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("bio", formData.bio);
    data.append("genres", formData.genres);
    if (imageFile) data.append("image", imageFile);

    setLoading(true);
    try {
      await axiosInstance.post("/artists", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Artist created successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create artist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-surface rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Artist</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <InputField
            label="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
          <InputField
            label="Genres (comma-separated)"
            value={formData.genres}
            onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
            placeholder="Pop, Rock"
          />

          <div className="mb-4">
            <label className="text-sm text-textSecondary font-medium block mb-1">
              Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
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
                Create Artist
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArtistFormModal;
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getLikedSongsApi, toggleLikeSongApi } from "../api/playlistApi";
import SongRow from "../components/playlist/SongRow";

const LikedSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLiked = async () => {
    try {
      const { data } = await getLikedSongsApi();
      setSongs(data.likedSongs);
    } catch (err) {
      toast.error("Failed to load liked songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiked();
  }, []);

  const handleToggleLike = async (songId) => {
    try {
      await toggleLikeSongApi(songId);
      // Since this page only shows liked songs, unliking should remove it from the list
      setSongs((prev) => prev.filter((s) => s._id !== songId));
    } catch (err) {
      toast.error("Failed to update like");
    }
  };

  if (loading) return <p className="text-textSecondary pt-6">Loading liked songs...</p>;

  return (
    <div className="pt-6">
      <div className="flex items-end gap-6 mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-700 to-blue-500 rounded-md" />
        <div>
          <p className="text-sm text-textSecondary uppercase">Playlist</p>
          <h1 className="text-4xl font-bold mb-2">Liked Songs</h1>
          <p className="text-textSecondary">{songs.length} songs</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {songs.map((song, index) => (
          <SongRow
            key={song._id}
            song={song}
            songList={songs}
            index={index}
            isLiked={true}
            onToggleLike={handleToggleLike}
          />
        ))}

        {songs.length === 0 && (
          <p className="text-textSecondary px-4 py-8 text-center">
            Songs you like will appear here.
          </p>
        )}
      </div>
    </div>
  );
};

export default LikedSongs;
import { useEffect, useState } from "react";
import { Play, Heart } from "lucide-react";
import { getAllSongsApi } from "../api/songApi";
import { getLikedSongsApi, toggleLikeSongApi } from "../api/playlistApi";
import { usePlayer } from "../hooks/usePlayer";
import toast from "react-hot-toast";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [likedSongIds, setLikedSongIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { playSong, currentSong, isPlaying } = usePlayer();

  const fetchData = async () => {
    try {
      const [songsRes, likedRes] = await Promise.all([
        getAllSongsApi(),
        getLikedSongsApi(),
      ]);
      setSongs(songsRes.data.songs);
      setLikedSongIds(new Set(likedRes.data.likedSongs.map((s) => s._id)));
    } catch (err) {
      toast.error("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleLike = async (e, songId) => {
    e.stopPropagation(); // don't trigger playSong when clicking the heart
    try {
      const { data } = await toggleLikeSongApi(songId);
      setLikedSongIds((prev) => {
        const updated = new Set(prev);
        if (data.liked) {
          updated.add(songId);
          toast.success("Added to Liked Songs");
        } else {
          updated.delete(songId);
          toast.success("Removed from Liked Songs");
        }
        return updated;
      });
    } catch (err) {
      toast.error("Failed to update like");
    }
  };

  if (loading) {
    return <p className="text-textSecondary pt-6">Loading songs...</p>;
  }

  if (songs.length === 0) {
    return (
      <div className="pt-6">
        <h2 className="text-3xl font-bold mb-6">Good evening</h2>
        <p className="text-textSecondary">
          No songs uploaded yet — use the admin API from Phase 6 to add some.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <h2 className="text-3xl font-bold mb-6">Good evening</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {songs.map((song) => {
          const isCurrentlyPlaying = currentSong?._id === song._id && isPlaying;
          const isLiked = likedSongIds.has(song._id);

          return (
            <div
              key={song._id}
              onClick={() => playSong(song, songs)}
              className="bg-surface hover:bg-surfaceHover p-4 rounded-md cursor-pointer group relative transition-colors"
            >
              <img
                src={song.coverImage || "/placeholder-cover.png"}
                alt={song.title}
                className="w-full aspect-square object-cover rounded-md mb-3"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{song.title}</p>
                  <p className="text-sm text-textSecondary truncate">
                    {song.artist?.name || "Unknown Artist"}
                  </p>
                </div>

                <button
                  onClick={(e) => handleToggleLike(e, song._id)}
                  className={`shrink-0 ${
                    isLiked
                      ? "text-primary"
                      : "text-textSecondary opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                </button>
              </div>

              <div
                className={`absolute bottom-24 right-6 bg-primary rounded-full p-3 shadow-lg transition-opacity ${
                  isCurrentlyPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <Play size={16} fill="black" className="text-black" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
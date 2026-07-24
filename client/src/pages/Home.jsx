import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { getAllSongsApi } from "../api/songApi";
import { usePlayer } from "../hooks/usePlayer";
import toast from "react-hot-toast";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data } = await getAllSongsApi();
        setSongs(data.songs);
      } catch (err) {
        toast.error("Failed to load songs");
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

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
              <p className="font-medium truncate">{song.title}</p>
              <p className="text-sm text-textSecondary truncate">
                {song.artist?.name || "Unknown Artist"}
              </p>

              <div
                className={`absolute bottom-16 right-6 bg-primary rounded-full p-3 shadow-lg transition-opacity ${
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
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getAllSongsApi } from "../api/songApi";
import { getLikedSongsApi, toggleLikeSongApi } from "../api/playlistApi";
import { getMoodPlaylistApi } from "../api/aiApi";
import { usePlayer } from "../hooks/usePlayer";
import MoodSelector from "../components/ai/MoodSelector";
import RecommendationSection from "../components/ai/RecommendationSection";
import SkeletonCard from "../components/ui/SkeletonCard";
import SongCard from "../components/song/SongCard";
import { staggerContainer } from "../animations/variants";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [likedSongIds, setLikedSongIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const [moodPlaylist, setMoodPlaylist] = useState(null);
  const [moodLoading, setMoodLoading] = useState(false);

  const { playSong, currentSong, isPlaying } = usePlayer();

  // --- Fetch songs + liked songs together ---
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

  // --- Mood playlist generation (user-triggered — show toast on failure) ---
  const handleMoodSelect = async (mood) => {
    setMoodLoading(true);
    try {
      const { data } = await getMoodPlaylistApi(mood);
      setMoodPlaylist(data);

      if (!data.aiSucceeded) {
        toast.error("AI couldn't generate a playlist right now — please try a different mood or try again");
      } else if (data.songs.length === 0) {
        toast("AI generated a mood playlist, but none of those songs are in your library yet", {
          icon: "🎵",
        });
      }
    } catch (err) {
      toast.error("Failed to generate mood playlist");
    } finally {
      setMoodLoading(false);
    }
  };

  // --- Like/unlike a song from the grid ---
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

  // --- Loading state: skeleton grid instead of plain text ---
  if (loading) {
    return (
      <div className="pt-6">
        <h2 className="text-3xl font-bold mb-6">Good evening</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <h2 className="text-3xl font-bold mb-6">Good evening</h2>

      {/* --- Mood Selector --- */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4">What's your mood?</h3>
        <MoodSelector onSelectMood={handleMoodSelect} loading={moodLoading} />
      </div>

      {/* --- Mood Playlist Results --- */}
      {moodPlaylist && (
        <RecommendationSection
          title={moodPlaylist.playlistName}
          songs={moodPlaylist.songs}
          aiSuggestions={moodPlaylist.aiSuggestions}
        />
      )}

      {/* --- All Songs Grid (staggered entrance animation + memoized cards) --- */}
      {songs.length === 0 ? (
        <p className="text-textSecondary">
          No songs uploaded yet — use the admin API from Phase 6 to add some.
        </p>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-4">All Songs</h3>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {songs.map((song) => {
              const isCurrentlyPlaying = currentSong?._id === song._id && isPlaying;
              const isLiked = likedSongIds.has(song._id);

              return (
                <SongCard
                  key={song._id}
                  song={song}
                  isCurrentlyPlaying={isCurrentlyPlaying}
                  isLiked={isLiked}
                  onPlay={() => playSong(song, songs)}
                  onToggleLike={(e) => handleToggleLike(e, song._id)}
                />
              );
            })}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Home;
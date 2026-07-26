import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getRecentlyPlayedApi } from "../api/historyApi";
import { usePlayer } from "../hooks/usePlayer";
import SongRow from "../components/playlist/SongRow";
import SkeletonRow from "../components/ui/SkeletonRow";

const RecentlyPlayed = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayer();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const { data } = await getRecentlyPlayedApi();
        setSongs(data.recentlyPlayed);
      } catch (err) {
        toast.error("Failed to load recently played songs");
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  // SongRow expects a like-toggle handler even if we don't fully wire likes here —
  // reusing it means we get consistent UI/behavior for free, but likes aren't
  // tracked on this page since we'd need to also fetch liked song IDs separately
  const handleToggleLike = () => {
    toast("Visit Liked Songs or Home to like/unlike this track", { icon: "💡" });
  };

  return (
    <div className="pt-6">
      <div className="flex items-end gap-6 mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-blue-700 to-cyan-500 rounded-md" />
        <div>
          <p className="text-sm text-textSecondary uppercase">Playlist</p>
          <h1 className="text-4xl font-bold mb-2">Recently Played</h1>
          <p className="text-textSecondary">{songs.length} songs</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
        ) : songs.length === 0 ? (
          <p className="text-textSecondary px-4 py-8 text-center">
            Songs you play will show up here.
          </p>
        ) : (
          songs.map((song, index) => (
            <SongRow
              key={song._id}
              song={song}
              songList={songs}
              index={index}
              isLiked={false}
              onToggleLike={handleToggleLike}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RecentlyPlayed;
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMostPlayedApi } from "../api/historyApi";
import SongRow from "../components/playlist/SongRow";
import SkeletonRow from "../components/ui/SkeletonRow";

const MostPlayed = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostPlayed = async () => {
      try {
        const { data } = await getMostPlayedApi();
        setSongs(data.mostPlayed);
      } catch (err) {
        toast.error("Failed to load most played songs");
      } finally {
        setLoading(false);
      }
    };
    fetchMostPlayed();
  }, []);

  const handleToggleLike = () => {
    toast("Visit Liked Songs or Home to like/unlike this track", { icon: "💡" });
  };

  return (
    <div className="pt-6">
      <div className="flex items-end gap-6 mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-orange-600 to-red-500 rounded-md" />
        <div>
          <p className="text-sm text-textSecondary uppercase">Playlist</p>
          <h1 className="text-4xl font-bold mb-2">Most Played</h1>
          <p className="text-textSecondary">{songs.length} songs</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
        ) : songs.length === 0 ? (
          <p className="text-textSecondary px-4 py-8 text-center">
            Play some songs a few times and your favorites will show up here.
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

export default MostPlayed;
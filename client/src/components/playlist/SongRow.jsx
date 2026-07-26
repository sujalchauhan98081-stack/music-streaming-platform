import { useState } from "react";
import { Heart, Play, Pause, MoreHorizontal } from "lucide-react";
import { usePlayer } from "../../hooks/usePlayer";
import { formatTime } from "../../utils/formatTime";
import AddToPlaylistModal from "./AddToPlaylistModal";

const SongRow = ({ song, songList, index, isLiked, onToggleLike }) => {
  const { currentSong, isPlaying, playSong, togglePlayPause } = usePlayer();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const isCurrentSong = currentSong?._id === song._id;

  const handleRowClick = () => {
    if (isCurrentSong) {
      togglePlayPause();
    } else {
      playSong(song, songList);
    }
  };

  return (
    <>
      <div
        onClick={handleRowClick}
        className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-4 py-2 rounded-md hover:bg-surfaceHover cursor-pointer group"
      >
        <div className="w-6 text-center text-textSecondary">
          {isCurrentSong && isPlaying ? (
            <Pause size={14} className="text-primary" />
          ) : (
            <>
              <span className="group-hover:hidden">{index + 1}</span>
              <Play size={14} className="hidden group-hover:block" />
            </>
          )}
        </div>

        <div className="flex items-center gap-3 min-w-0">
          <img
            src={song.coverImage || "/placeholder-cover.png"}
            alt={song.title}
            className="w-10 h-10 rounded object-cover"
          />
          <div className="min-w-0">
            <p className={`truncate ${isCurrentSong ? "text-primary" : "text-textPrimary"}`}>
              {song.title}
            </p>
            <p className="text-sm text-textSecondary truncate">
              {song.artist?.name || "Unknown Artist"}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(song._id);
          }}
          className={isLiked ? "text-primary" : "text-textSecondary opacity-0 group-hover:opacity-100"}
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsAddModalOpen(true);
          }}
          className="text-textSecondary opacity-0 group-hover:opacity-100 hover:text-textPrimary"
          title="Add to playlist"
        >
          <MoreHorizontal size={16} />
        </button>

        <span className="text-sm text-textSecondary w-12 text-right">
          {formatTime(song.duration)}
        </span>
      </div>

      <AddToPlaylistModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        song={song}
      />
    </>
  );
};

export default SongRow;
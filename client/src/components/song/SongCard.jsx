import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Heart, MoreHorizontal } from "lucide-react";
import { fadeInUp } from "../../animations/variants";
import AddToPlaylistModal from "../playlist/AddToPlaylistModal";

const SongCard = memo(({ song, isCurrentlyPlaying, isLiked, onPlay, onToggleLike }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenAddModal = (e) => {
    e.stopPropagation(); // don't trigger onPlay
    setIsAddModalOpen(true);
  };

  return (
    <>
      <motion.div
        variants={fadeInUp}
        onClick={onPlay}
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

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onToggleLike}
              className={
                isLiked ? "text-primary" : "text-textSecondary opacity-0 group-hover:opacity-100"
              }
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            </button>

            <button
              onClick={handleOpenAddModal}
              className="text-textSecondary opacity-0 group-hover:opacity-100 hover:text-textPrimary"
              title="Add to playlist"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        <div
          className={`absolute bottom-24 right-6 bg-primary rounded-full p-3 shadow-lg transition-opacity ${
            isCurrentlyPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <Play size={16} fill="black" className="text-black" />
        </div>
      </motion.div>

      <AddToPlaylistModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        song={song}
      />
    </>
  );
});

SongCard.displayName = "SongCard";

export default SongCard;
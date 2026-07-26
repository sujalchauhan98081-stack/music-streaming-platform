import { memo } from "react";
import { motion } from "framer-motion";
import { Play, Heart } from "lucide-react";
import { fadeInUp } from "../../animations/variants";

// Wrapped in React.memo — this card only re-renders if its own specific props change,
// not whenever an unrelated sibling card's like-status or the parent's other state changes
const SongCard = memo(({ song, isCurrentlyPlaying, isLiked, onPlay, onToggleLike }) => {
  return (
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

        <button
          onClick={onToggleLike}
          className={`shrink-0 ${
            isLiked ? "text-primary" : "text-textSecondary opacity-0 group-hover:opacity-100"
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
    </motion.div>
  );
});

SongCard.displayName = "SongCard"; // helps identify this component in React DevTools since it's wrapped in memo()

export default SongCard;
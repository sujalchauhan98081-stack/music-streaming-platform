import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePlayer } from "../hooks/usePlayer";
import PlayerControls from "./PlayerControls";
import Seekbar from "./Seekbar";

const FullscreenPlayer = () => {
  const {
    currentSong,
    isFullscreenOpen,
    setIsFullscreenOpen,
    isPlaying,
    progress,
    duration,
    isShuffled,
    repeatMode,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    toggleShuffle,
    cycleRepeatMode,
  } = usePlayer();

  return (
    <AnimatePresence>
      {isFullscreenOpen && currentSong && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "tween", duration: 0.35 }}
          className="fixed inset-0 bg-background z-[60] flex flex-col items-center justify-center px-6"
        >
          <button
            onClick={() => setIsFullscreenOpen(false)}
            className="absolute top-6 left-6 text-textSecondary hover:text-textPrimary"
          >
            <ChevronDown size={28} />
          </button>

          <img
            src={currentSong.coverImage || "/placeholder-cover.png"}
            alt={currentSong.title}
            className="w-80 h-80 rounded-lg object-cover shadow-2xl mb-8"
          />

          <h2 className="text-2xl font-bold mb-1 text-center">{currentSong.title}</h2>
          <p className="text-textSecondary mb-8 text-center">
            {currentSong.artist?.name || "Unknown Artist"}
          </p>

          <div className="w-full max-w-md">
            <Seekbar progress={progress} duration={duration} onSeek={seekTo} />
            <div className="mt-6">
              <PlayerControls
                isPlaying={isPlaying}
                isShuffled={isShuffled}
                repeatMode={repeatMode}
                onTogglePlayPause={togglePlayPause}
                onNext={playNext}
                onPrevious={playPrevious}
                onToggleShuffle={toggleShuffle}
                onCycleRepeat={cycleRepeatMode}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullscreenPlayer;
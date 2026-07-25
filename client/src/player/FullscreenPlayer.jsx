import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePlayer } from "../hooks/usePlayer";
import PlayerControls from "./PlayerControls";
import Seekbar from "./Seekbar";
import AudioVisualizer from "../components/effects/AudioVisualizer";
import DynamicBackground from "../components/effects/DynamicBackground";

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
    analyserNode,
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
          className="fixed inset-0 bg-background z-[60] flex flex-col items-center justify-center px-6 overflow-hidden"
        >
          <DynamicBackground imageUrl={currentSong.coverImage} />

          <button
            onClick={() => setIsFullscreenOpen(false)}
            className="absolute top-6 left-6 text-textSecondary hover:text-textPrimary z-10"
          >
            <ChevronDown size={28} />
          </button>

          <motion.img
            key={currentSong._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            src={currentSong.coverImage || "/placeholder-cover.png"}
            alt={currentSong.title}
            className="w-80 h-80 rounded-lg object-cover shadow-2xl mb-6 relative z-10"
          />

          <div className="mb-4 relative z-10">
            <AudioVisualizer analyserNode={analyserNode} isPlaying={isPlaying} />
          </div>

          <h2 className="text-2xl font-bold mb-1 text-center relative z-10">
            {currentSong.title}
          </h2>
          <p className="text-textSecondary mb-8 text-center relative z-10">
            {currentSong.artist?.name || "Unknown Artist"}
          </p>

          <div className="w-full max-w-md relative z-10">
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
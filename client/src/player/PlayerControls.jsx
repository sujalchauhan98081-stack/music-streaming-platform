import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Repeat1 } from "lucide-react";

const PlayerControls = ({
  isPlaying,
  isShuffled,
  repeatMode,
  onTogglePlayPause,
  onNext,
  onPrevious,
  onToggleShuffle,
  onCycleRepeat,
}) => {
  return (
    <div className="flex items-center justify-center gap-5">
      <button
        onClick={onToggleShuffle}
        className={`transition-colors ${
          isShuffled ? "text-primary" : "text-textSecondary hover:text-textPrimary"
        }`}
        title="Shuffle"
      >
        <Shuffle size={18} />
      </button>

      <button
        onClick={onPrevious}
        className="text-textSecondary hover:text-textPrimary"
        title="Previous"
      >
        <SkipBack size={20} fill="currentColor" />
      </button>

      <button
        onClick={onTogglePlayPause}
        className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
      </button>

      <button
        onClick={onNext}
        className="text-textSecondary hover:text-textPrimary"
        title="Next"
      >
        <SkipForward size={20} fill="currentColor" />
      </button>

      <button
        onClick={onCycleRepeat}
        className={`transition-colors ${
          repeatMode !== "off" ? "text-primary" : "text-textSecondary hover:text-textPrimary"
        }`}
        title={`Repeat: ${repeatMode}`}
      >
        {repeatMode === "one" ? <Repeat1 size={18} /> : <Repeat size={18} />}
      </button>
    </div>
  );
};

export default PlayerControls;
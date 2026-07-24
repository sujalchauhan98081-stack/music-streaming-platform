import { Maximize2 } from "lucide-react";
import { usePlayer } from "../hooks/usePlayer";
import PlayerControls from "./PlayerControls";
import Seekbar from "./Seekbar";
import VolumeControl from "./VolumeControl";

const MiniPlayer = () => {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    isShuffled,
    repeatMode,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    changeVolume,
    toggleShuffle,
    cycleRepeatMode,
    setIsFullscreenOpen,
  } = usePlayer();

  // Don't render the player bar at all until a song has been played
  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-surface border-t border-surfaceHover px-4 flex items-center justify-between z-50">
      {/* Left: song info */}
      <div className="flex items-center gap-3 w-1/4 min-w-0">
        <img
          src={currentSong.coverImage || "/placeholder-cover.png"}
          alt={currentSong.title}
          className="w-14 h-14 rounded-md object-cover cursor-pointer"
          onClick={() => setIsFullscreenOpen(true)}
        />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{currentSong.title}</p>
          <p className="text-xs text-textSecondary truncate">
            {currentSong.artist?.name || "Unknown Artist"}
          </p>
        </div>
      </div>

      {/* Center: controls + seekbar */}
      <div className="flex flex-col items-center gap-2 w-1/2 max-w-xl">
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
        <Seekbar progress={progress} duration={duration} onSeek={seekTo} />
      </div>

      {/* Right: volume + fullscreen toggle */}
      <div className="flex items-center gap-4 w-1/4 justify-end">
        <VolumeControl volume={volume} onVolumeChange={changeVolume} />
        <button
          onClick={() => setIsFullscreenOpen(true)}
          className="text-textSecondary hover:text-textPrimary"
          title="Fullscreen"
        >
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
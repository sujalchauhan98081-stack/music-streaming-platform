import { Volume2, VolumeX, Volume1 } from "lucide-react";

const VolumeControl = ({ volume, onVolumeChange }) => {
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-2 w-32">
      <button
        onClick={() => onVolumeChange(volume === 0 ? 0.8 : 0)}
        className="text-textSecondary hover:text-textPrimary"
      >
        <VolumeIcon size={18} />
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        className="flex-1 h-1 rounded-full appearance-none bg-surfaceHover accent-primary cursor-pointer"
      />
    </div>
  );
};

export default VolumeControl;
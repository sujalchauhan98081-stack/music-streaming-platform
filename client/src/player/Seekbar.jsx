import { formatTime } from "../utils/formatTime";

const Seekbar = ({ progress, duration, onSeek }) => {
  const handleChange = (e) => {
    onSeek(Number(e.target.value));
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-xs text-textSecondary w-10 text-right">
        {formatTime(progress)}
      </span>

      <input
        type="range"
        min={0}
        max={duration || 0}
        value={progress}
        onChange={handleChange}
        className="flex-1 h-1 rounded-full appearance-none bg-surfaceHover accent-primary cursor-pointer"
      />

      <span className="text-xs text-textSecondary w-10">{formatTime(duration)}</span>
    </div>
  );
};

export default Seekbar;
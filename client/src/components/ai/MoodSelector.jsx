const MOODS = ["Happy", "Sad", "Relaxed", "Energetic", "Focused", "Romantic"];

const MoodSelector = ({ onSelectMood, loading }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {MOODS.map((mood) => (
        <button
          key={mood}
          onClick={() => onSelectMood(mood)}
          disabled={loading}
          className="px-5 py-2 rounded-full bg-surface hover:bg-surfaceHover text-sm font-medium transition-colors disabled:opacity-50"
        >
          {mood}
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
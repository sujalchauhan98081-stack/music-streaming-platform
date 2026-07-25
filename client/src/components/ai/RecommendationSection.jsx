import { Play, Sparkles } from "lucide-react";
import { usePlayer } from "../../hooks/usePlayer";

const RecommendationSection = ({ title, songs, aiSuggestions }) => {
  const { playSong } = usePlayer();

  const hasMatchedSongs = songs && songs.length > 0;
  const hasRawSuggestions = aiSuggestions && aiSuggestions.length > 0;

  // Nothing to show at all — AI call likely failed or returned nothing
  if (!hasMatchedSongs && !hasRawSuggestions) return null;

  return (
    <section className="mb-10">
      <h3 className="text-xl font-bold mb-4">{title}</h3>

      {hasMatchedSongs ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {songs.map((song) => (
            <div
              key={song._id}
              onClick={() => playSong(song, songs)}
              className="bg-surface hover:bg-surfaceHover p-4 rounded-md cursor-pointer group relative transition-colors"
            >
              <img
                src={song.coverImage || "/placeholder-cover.png"}
                alt={song.title}
                className="w-full aspect-square object-cover rounded-md mb-3"
              />
              <p className="font-medium truncate">{song.title}</p>
              <p className="text-sm text-textSecondary truncate">
                {song.artist?.name || "Unknown Artist"}
              </p>
              <div className="absolute bottom-16 right-6 bg-primary rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={16} fill="black" className="text-black" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Fallback: show the AI's raw suggestions as plain text, since none
        // of these songs exist in our catalog yet to actually play
        <div className="bg-surface/50 rounded-lg p-5">
          <div className="flex items-center gap-2 text-textSecondary text-sm mb-4">
            <Sparkles size={16} className="text-primary" />
            <span>
              AI suggestions — not yet in your library, so these aren't playable
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-3 py-2 rounded-md bg-surface/60"
              >
                <span className="text-textSecondary text-sm w-6">{index + 1}</span>
                <div className="min-w-0">
                  <p className="truncate">{suggestion.title}</p>
                  <p className="text-sm text-textSecondary truncate">
                    {suggestion.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default RecommendationSection;
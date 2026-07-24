import { usePlayer } from "../../hooks/usePlayer";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const SearchResults = ({ results }) => {
  const { playSong } = usePlayer();
  const { songs, artists, albums } = results;

  const hasNoResults = songs.length === 0 && artists.length === 0 && albums.length === 0;

  if (hasNoResults) {
    return <p className="text-textSecondary pt-8 text-center">No results found.</p>;
  }

  return (
    <div className="flex flex-col gap-10 pt-4">
      {songs.length > 0 && (
        <section>
          <h3 className="text-xl font-bold mb-4">Songs</h3>
          <div className="flex flex-col gap-1">
            {songs.map((song) => (
              <div
                key={song._id}
                onClick={() => playSong(song, songs)}
                className="flex items-center gap-4 px-4 py-2 rounded-md hover:bg-surfaceHover cursor-pointer group"
              >
                <div className="relative w-10 h-10 shrink-0">
                  <img
                    src={song.coverImage || "/placeholder-cover.png"}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Play size={14} fill="white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="truncate">{song.title}</p>
                  <p className="text-sm text-textSecondary truncate">
                    {song.artist?.name || "Unknown Artist"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {artists.length > 0 && (
        <section>
          <h3 className="text-xl font-bold mb-4">Artists</h3>
          <div className="flex gap-4 flex-wrap">
            {artists.map((artist) => (
              <div key={artist._id} className="w-32 text-center">
                <img
                  src={artist.image || "/placeholder-cover.png"}
                  alt={artist.name}
                  className="w-32 h-32 rounded-full object-cover mb-2"
                />
                <p className="truncate font-medium">{artist.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {albums.length > 0 && (
        <section>
          <h3 className="text-xl font-bold mb-4">Albums</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((album) => (
              <div key={album._id} className="bg-surface hover:bg-surfaceHover p-4 rounded-md transition-colors">
                <img
                  src={album.coverImage || "/placeholder-cover.png"}
                  alt={album.title}
                  className="w-full aspect-square object-cover rounded-md mb-3"
                />
                <p className="font-medium truncate">{album.title}</p>
                <p className="text-sm text-textSecondary truncate">
                  {album.artist?.name || "Unknown Artist"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SearchBar from "../components/search/SearchBar";
import SearchResults from "../components/search/SearchResults";
import { useDebounce } from "../hooks/useDebounce";
import { searchAllApi, getTrendingSongsApi } from "../api/searchApi";
import { usePlayer } from "../hooks/usePlayer";
import { Play } from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ songs: [], artists: [], albums: [] });
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const { playSong } = usePlayer();

  const debouncedQuery = useDebounce(query, 400);

  // Load trending songs once, shown when there's no active search
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await getTrendingSongsApi();
        setTrending(data.trending);
      } catch (err) {
        toast.error("Failed to load trending songs");
      }
    };
    fetchTrending();
  }, []);

  // Fire the actual search only when the debounced value changes
  useEffect(() => {
    const runSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults({ songs: [], artists: [], albums: [] });
        return;
      }

      setLoading(true);
      try {
        const { data } = await searchAllApi(debouncedQuery);
        setResults({ songs: data.songs, artists: data.artists, albums: data.albums });
      } catch (err) {
        toast.error("Search failed");
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [debouncedQuery]);

  const isSearchActive = query.trim().length > 0;

  return (
    <div className="pt-6">
      <SearchBar value={query} onChange={setQuery} />

      {isSearchActive ? (
        loading ? (
          <p className="text-textSecondary pt-8 text-center">Searching...</p>
        ) : (
          <SearchResults results={results} />
        )
      ) : (
        <div className="pt-8">
          <h3 className="text-xl font-bold mb-4">Trending Now</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trending.map((song) => (
              <div
                key={song._id}
                onClick={() => playSong(song, trending)}
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

            {trending.length === 0 && (
              <p className="text-textSecondary col-span-full">
                No trending songs yet — play count updates as users listen.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
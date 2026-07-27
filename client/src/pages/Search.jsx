import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import SearchBar from "../components/search/SearchBar";
import SearchResults from "../components/search/SearchResults";
import { useDebounce } from "../hooks/useDebounce";
import { searchAllApi, getTrendingSongsApi } from "../api/searchApi";
import { getRecommendationsApi } from "../api/aiApi";
import { usePlayer } from "../hooks/usePlayer";
import { Play } from "lucide-react";
import SkeletonRow from "../components/ui/SkeletonRow";
import RecommendationSection from "../components/ai/RecommendationSection";

// How often to silently refresh the trending list while the user is on this
// page, so ranking shifts as play counts change without needing a manual reload
const TRENDING_REFRESH_INTERVAL = 15000; // 15 seconds

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    songs: [],
    artists: [],
    albums: [],
  });
  const [trending, setTrending] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationSuggestions, setRecommendationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { playSong } = usePlayer();
  const intervalRef = useRef(null);

  const debouncedQuery = useDebounce(query, 400);

  // Fetch trending once immediately, then keep silently refreshing it on an
  // interval — this is what makes rank shuffling feel "real-time" without
  // needing WebSockets. A song overtaking another in play count will visibly
  // reorder on the next refresh cycle.
  useEffect(() => {
    const fetchTrending = async (isBackgroundRefresh = false) => {
      try {
        const { data } = await getTrendingSongsApi();
        setTrending(data.trending);
      } catch (err) {
        // Only show an error toast on the very first load — silent on
        // background refresh failures, since those shouldn't interrupt the user
        if (!isBackgroundRefresh) toast.error("Failed to load trending songs");
      }
    };

    fetchTrending(false); // initial load

    intervalRef.current = setInterval(() => fetchTrending(true), TRENDING_REFRESH_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await getRecommendationsApi();
        setRecommendations(data.recommendations);
        setRecommendationSuggestions(data.aiSuggestions || []);
      } catch (err) {
        // Silently fail — recommendations are a nice-to-have, not critical to the page loading
      }
    };
    fetchRecommendations();
  }, []);

  useEffect(() => {
    const runSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults({
          songs: [],
          artists: [],
          albums: [],
        });
        return;
      }

      setLoading(true);

      try {
        const { data } = await searchAllApi(debouncedQuery);

        setResults({
          songs: data.songs,
          artists: data.artists,
          albums: data.albums,
        });
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
          <div className="pt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : (
          <SearchResults results={results} />
        )
      ) : (
        <div className="pt-8">
          <h3 className="text-xl font-bold mb-4">Trending Now</h3>

          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            <AnimatePresence>
              {trending.map((song, index) => (
                <motion.div
                  key={song._id}
                  layout // animates this card sliding to its new grid position when rank order changes
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => playSong(song, trending)}
                  className="bg-surface hover:bg-surfaceHover p-4 rounded-md cursor-pointer group relative transition-colors"
                >
                  {/* Rank badge — #1 is the most played song, since the backend
                      already sorts by playCount descending */}
                  <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-primary">
                    {index + 1}
                  </div>

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
                </motion.div>
              ))}
            </AnimatePresence>

            {trending.length === 0 && (
              <p className="text-textSecondary col-span-full">
                No trending songs yet — play count updates as users listen.
              </p>
            )}
          </motion.div>
          &nbsp;

          <RecommendationSection
            title="Made For You"
            songs={recommendations}
            aiSuggestions={recommendationSuggestions}
          />
        </div>
      )}
    </div>
  );
};

export default Search;
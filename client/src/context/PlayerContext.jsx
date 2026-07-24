import { createContext, useRef, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { incrementPlayCountApi } from "../api/songApi";

export const PlayerContext = createContext();

// Repeat modes cycle: off -> all -> one -> off
const REPEAT_MODES = ["off", "all", "one"];

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());

  const [queue, setQueue] = useState([]); // array of song objects
  const [currentIndex, setCurrentIndex] = useState(-1); // index into queue
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // current playback time in seconds
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : null;

  // --- Load a new song into the audio element whenever currentSong changes ---
  useEffect(() => {
    if (!currentSong) return;

    const audio = audioRef.current;
    audio.src = currentSong.audioUrl;
    audio.volume = volume;
    audio.play().catch(() => {
      // Autoplay can be blocked by browsers if not triggered by direct user interaction —
      // we silently ignore here since play() was already called from a click handler
    });
    setIsPlaying(true);

    // Fire-and-forget play count increment — doesn't block playback if it fails
    incrementPlayCountApi(currentSong._id).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?._id]);

  // --- Wire up audio element event listeners once ---
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => handleSongEnd();

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, repeatMode, isShuffled, queue.length]);

  // --- Core controls ---
  const playSong = useCallback((song, songList = null) => {
    // If a full list is provided (e.g. clicking a song inside an album), set it as the queue
    if (songList) {
      const index = songList.findIndex((s) => s._id === song._id);
      setQueue(songList);
      setCurrentIndex(index);
    } else {
      // Otherwise just play this single song, replacing the queue
      setQueue([song]);
      setCurrentIndex(0);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  }, [isPlaying, currentSong]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      setCurrentIndex(randomIndex);
      return;
    }

    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (repeatMode === "all") {
      setCurrentIndex(0); // loop back to start
    } else {
      setIsPlaying(false); // reached end of queue, no repeat
    }
  }, [queue, currentIndex, isShuffled, repeatMode]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;

    // If more than 3 seconds into the song, restart it instead of going to previous track
    // (this matches standard Spotify/media-player UX behavior)
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (repeatMode === "all") {
      setCurrentIndex(queue.length - 1);
    }
  }, [queue, currentIndex, repeatMode]);

  const handleSongEnd = useCallback(() => {
    if (repeatMode === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    playNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeatMode, playNext]);

  const seekTo = useCallback((time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  }, []);

  const changeVolume = useCallback((newVolume) => {
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  }, []);

  const toggleShuffle = useCallback(() => setIsShuffled((prev) => !prev), []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      const currentPos = REPEAT_MODES.indexOf(prev);
      return REPEAT_MODES[(currentPos + 1) % REPEAT_MODES.length];
    });
  }, []);

  const addToQueue = useCallback((song) => {
    setQueue((prev) => [...prev, song]);
    toast.success(`Added "${song.title}" to queue`);
  }, []);

  const playNow = useCallback(
    (song) => {
      // "Play Next" feature — inserts right after the current song
      setQueue((prev) => {
        const newQueue = [...prev];
        newQueue.splice(currentIndex + 1, 0, song);
        return newQueue;
      });
    },
    [currentIndex]
  );

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        isPlaying,
        progress,
        duration,
        volume,
        isShuffled,
        repeatMode,
        isFullscreenOpen,
        setIsFullscreenOpen,
        playSong,
        togglePlayPause,
        playNext,
        playPrevious,
        seekTo,
        changeVolume,
        toggleShuffle,
        cycleRepeatMode,
        addToQueue,
        playNow,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
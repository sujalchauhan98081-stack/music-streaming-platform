import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "./usePlayer";

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { togglePlayPause, seekTo, progress, duration, currentSong } = usePlayer();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Never hijack keystrokes while the user is typing in an input, textarea,
      // or contentEditable element — this is the single most important guard here,
      // without it, Space would block typing spaces into the search bar, chat, etc.
      const target = e.target;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

      // Ctrl+K (or Cmd+K on Mac) — jump to Search, works everywhere, even while typing
      // elsewhere, since it's a deliberate two-key combo unlikely to be accidental
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); // stop the browser's own Ctrl+K behavior (e.g. address bar focus in some browsers)
        navigate("/search");
        return;
      }

      // Everything below only makes sense if a song is actually loaded
      if (!currentSong) return;

      if (e.code === "Space") {
        e.preventDefault(); // stop the page from scrolling down, which Space does by default
        togglePlayPause();
        return;
      }

      if (e.code === "ArrowRight") {
        e.preventDefault();
        seekTo(Math.min(progress + 5, duration)); // skip forward 5 seconds, clamped to song length
        return;
      }

      if (e.code === "ArrowLeft") {
        e.preventDefault();
        seekTo(Math.max(progress - 5, 0)); // skip back 5 seconds, clamped to 0
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, togglePlayPause, seekTo, progress, duration, currentSong]);
};
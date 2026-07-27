import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, ListPlus, ListMusic, Plus } from "lucide-react";
import { usePlayer } from "../../hooks/usePlayer";
import AddToPlaylistModal from "../playlist/AddToPlaylistModal";

const SongOptionsMenu = ({ song }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const { playNow, addToQueue } = usePlayer();

  // Close the dropdown if the user clicks anywhere outside of it (or its trigger button)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggle = (e) => {
    e.stopPropagation();

    if (!isOpen) {
      // Calculate the button's exact screen position so the portal-rendered
      // menu can be placed correctly, regardless of which card/row it's in
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 130; // approximate rendered height of our 3-item menu
      const menuWidth = 176; // matches w-44

      // Flip the menu upward if there isn't enough room below (e.g. bottom row,
      // near the fixed Mini Player) — this is the actual fix for the clipping bug
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < menuHeight + 16;

      setMenuPosition({
        top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
        left: Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8),
      });
    }

    setIsOpen((prev) => !prev);
  };

  const handlePlayNext = (e) => {
    e.stopPropagation();
    playNow(song);
    setIsOpen(false);
  };

  const handleAddToQueue = (e) => {
    e.stopPropagation();
    addToQueue(song);
    setIsOpen(false);
  };

  const handleOpenAddToPlaylist = (e) => {
    e.stopPropagation();
    setIsAddModalOpen(true);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="text-textSecondary opacity-0 group-hover:opacity-100 hover:text-textPrimary transition-opacity"
        title="More options"
      >
        <MoreHorizontal size={18} />
      </button>

      {/* Rendered via portal directly into <body> — completely independent of
          this card's stacking context, so it can never be clipped or hidden
          behind the fixed Mini Player or any other card again */}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            style={{ position: "fixed", top: menuPosition.top, left: menuPosition.left }}
            className="bg-surfaceHover rounded-md shadow-2xl py-1 w-44 z-[200]"
          >
            <button
              onClick={handlePlayNext}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-black/20"
            >
              <ListMusic size={14} /> Play Next
            </button>
            <button
              onClick={handleAddToQueue}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-black/20"
            >
              <ListPlus size={14} /> Add to Queue
            </button>
            <button
              onClick={handleOpenAddToPlaylist}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-black/20"
            >
              <Plus size={14} /> Add to Playlist
            </button>
          </div>,
          document.body
        )}

      <AddToPlaylistModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        song={song}
      />
    </div>
  );
};

export default SongOptionsMenu;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getPlaylistByIdApi,
  toggleLikeSongApi,
  getLikedSongsApi,
} from "../api/playlistApi";
import SongRow from "../components/playlist/SongRow";

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [likedSongIds, setLikedSongIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [playlistRes, likedRes] = await Promise.all([
        getPlaylistByIdApi(id),
        getLikedSongsApi(),
      ]);
      setPlaylist(playlistRes.data.playlist);
      setLikedSongIds(new Set(likedRes.data.likedSongs.map((s) => s._id)));
    } catch (err) {
      toast.error("Failed to load playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleToggleLike = async (songId) => {
    try {
      const { data } = await toggleLikeSongApi(songId);
      setLikedSongIds((prev) => {
        const updated = new Set(prev);
        if (data.liked) updated.add(songId);
        else updated.delete(songId);
        return updated;
      });
    } catch (err) {
      toast.error("Failed to update like");
    }
  };

  if (loading) return <p className="text-textSecondary pt-6">Loading playlist...</p>;
  if (!playlist) return <p className="text-textSecondary pt-6">Playlist not found.</p>;

  return (
    <div className="pt-6">
      <div className="flex items-end gap-6 mb-8">
        <div className="w-48 h-48 bg-surfaceHover rounded-md flex items-center justify-center text-textSecondary">
          {playlist.coverImage ? (
            <img
              src={playlist.coverImage}
              alt={playlist.name}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            "No cover"
          )}
        </div>
        <div>
          <p className="text-sm text-textSecondary uppercase">Playlist</p>
          <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-textSecondary">{playlist.songs.length} songs</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {playlist.songs.map((song, index) => (
          <SongRow
            key={song._id}
            song={song}
            songList={playlist.songs}
            index={index}
            isLiked={likedSongIds.has(song._id)}
            onToggleLike={handleToggleLike}
          />
        ))}

        {playlist.songs.length === 0 && (
          <p className="text-textSecondary px-4 py-8 text-center">
            This playlist is empty — add songs from the Home page.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
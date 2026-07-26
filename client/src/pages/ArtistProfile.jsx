import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getArtistByIdApi, getSongsByArtistApi } from "../api/artistApi";
import { getLikedSongsApi, toggleLikeSongApi } from "../api/playlistApi";
import SongRow from "../components/playlist/SongRow";
import SkeletonRow from "../components/ui/SkeletonRow";

const ArtistProfile = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [likedSongIds, setLikedSongIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [artistRes, songsRes, likedRes] = await Promise.all([
        getArtistByIdApi(id),
        getSongsByArtistApi(id),
        getLikedSongsApi(),
      ]);
      setArtist(artistRes.data.artist);
      setSongs(songsRes.data.songs);
      setLikedSongIds(new Set(likedRes.data.likedSongs.map((s) => s._id)));
    } catch (err) {
      toast.error("Failed to load artist");
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

  if (loading) {
    return (
      <div className="pt-6">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    );
  }

  if (!artist) return <p className="text-textSecondary pt-6">Artist not found.</p>;

  return (
    <div className="pt-6">
      <div className="flex items-end gap-6 mb-8">
        <img
          src={artist.image || "/placeholder-cover.png"}
          alt={artist.name}
          className="w-48 h-48 rounded-full object-cover shadow-2xl"
        />
        <div>
          <p className="text-sm text-textSecondary uppercase">Artist</p>
          <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
          {artist.genres?.length > 0 && (
            <p className="text-textSecondary text-sm mb-1">{artist.genres.join(", ")}</p>
          )}
          <p className="text-textSecondary">{songs.length} songs</p>
        </div>
      </div>

      {artist.bio && (
        <p className="text-textSecondary max-w-2xl mb-8 leading-relaxed">{artist.bio}</p>
      )}

      <h3 className="text-xl font-bold mb-4">Songs</h3>
      <div className="flex flex-col gap-1">
        {songs.length === 0 ? (
          <p className="text-textSecondary py-8 text-center">
            No songs from this artist yet.
          </p>
        ) : (
          songs.map((song, index) => (
            <SongRow
              key={song._id}
              song={song}
              songList={songs}
              index={index}
              isLiked={likedSongIds.has(song._id)}
              onToggleLike={handleToggleLike}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ArtistProfile;
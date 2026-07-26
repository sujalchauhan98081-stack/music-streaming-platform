import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAlbumByIdApi } from "../api/albumApi";
import { getLikedSongsApi, toggleLikeSongApi } from "../api/playlistApi";
import { getAllSongsApi } from "../api/songApi";
import SongRow from "../components/playlist/SongRow";
import SkeletonRow from "../components/ui/SkeletonRow";

const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [likedSongIds, setLikedSongIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Album model doesn't store its own song list (Song references Album, not
      // the reverse), so we fetch all songs and filter — acceptable at this scale,
      // same trade-off noted for Artist songs, but without a dedicated endpoint
      // this time since Album pages are viewed far less often than artist pages
      const [albumRes, allSongsRes, likedRes] = await Promise.all([
        getAlbumByIdApi(id),
        getAllSongsApi(),
        getLikedSongsApi(),
      ]);
      setAlbum(albumRes.data.album);
      setSongs(allSongsRes.data.songs.filter((s) => s.album?._id === id));
      setLikedSongIds(new Set(likedRes.data.likedSongs.map((s) => s._id)));
    } catch (err) {
      toast.error("Failed to load album");
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

  if (!album) return <p className="text-textSecondary pt-6">Album not found.</p>;

  return (
    <div className="pt-6">
      <div className="flex items-end gap-6 mb-8">
        <img
          src={album.coverImage || "/placeholder-cover.png"}
          alt={album.title}
          className="w-48 h-48 rounded-md object-cover shadow-2xl"
        />
        <div>
          <p className="text-sm text-textSecondary uppercase">Album</p>
          <h1 className="text-4xl font-bold mb-2">{album.title}</h1>
          {album.artist && (
            <Link
              to={`/artist/${album.artist._id}`}
              className="text-textSecondary hover:text-textPrimary hover:underline"
            >
              {album.artist.name}
            </Link>
          )}
          <p className="text-textSecondary mt-1">{songs.length} songs</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {songs.length === 0 ? (
          <p className="text-textSecondary py-8 text-center">No songs in this album yet.</p>
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

export default AlbumDetail;
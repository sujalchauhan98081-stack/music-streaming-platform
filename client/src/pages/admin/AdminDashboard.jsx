import { useEffect, useState } from "react";
import { Users, Music, Mic2, Disc3, Radio } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import toast from "react-hot-toast";
import StatCard from "../../components/admin/StatCard";
import {
  getDashboardStatsApi,
  getTopSongsAnalyticsApi,
  getStreamsOverTimeApi,
} from "../../api/adminApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [topSongs, setTopSongs] = useState([]);
  const [streamsOverTime, setStreamsOverTime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, topSongsRes, streamsRes] = await Promise.all([
          getDashboardStatsApi(),
          getTopSongsAnalyticsApi(),
          getStreamsOverTimeApi(),
        ]);
        setStats(statsRes.data.stats);
        setTopSongs(topSongsRes.data.topSongs);
        setStreamsOverTime(streamsRes.data.streamsOverTime);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <p className="text-textSecondary">Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <StatCard icon={<Users size={20} />} label="Total Users" value={stats.totalUsers} />
        <StatCard icon={<Music size={20} />} label="Total Songs" value={stats.totalSongs} />
        <StatCard icon={<Mic2 size={20} />} label="Total Artists" value={stats.totalArtists} />
        <StatCard icon={<Disc3 size={20} />} label="Total Albums" value={stats.totalAlbums} />
        <StatCard icon={<Radio size={20} />} label="Total Streams" value={stats.totalStreams} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- Top Songs Bar Chart --- */}
        <div className="bg-surface rounded-lg p-5">
          <h3 className="font-bold mb-4">Top 10 Songs by Plays</h3>
          {topSongs.length === 0 ? (
            <p className="text-textSecondary text-sm">No play data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSongs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="title" tick={{ fill: "#b3b3b3", fontSize: 12 }} />
                <YAxis tick={{ fill: "#b3b3b3" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#181818", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="playCount" fill="#1db954" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* --- Streams Over Time Line Chart --- */}
        <div className="bg-surface rounded-lg p-5">
          <h3 className="font-bold mb-4">Streams — Last 14 Days</h3>
          {streamsOverTime.length === 0 ? (
            <p className="text-textSecondary text-sm">No streaming data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={streamsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" tick={{ fill: "#b3b3b3", fontSize: 11 }} />
                <YAxis tick={{ fill: "#b3b3b3" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#181818", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="streams" stroke="#1db954" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
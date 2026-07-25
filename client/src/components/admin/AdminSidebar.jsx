import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Music, Mic2, Disc3, Users, ArrowLeft } from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", to: "/admin" },
    { icon: <Music size={20} />, label: "Songs", to: "/admin/songs" },
    { icon: <Mic2 size={20} />, label: "Artists", to: "/admin/artists" },
    { icon: <Disc3 size={20} />, label: "Albums", to: "/admin/albums" },
    { icon: <Users size={20} />, label: "Users", to: "/admin/users" },
  ];

  return (
    <aside className="w-64 h-screen bg-black p-6 flex flex-col gap-6 sticky top-0">
      <h1 className="text-xl font-bold">🛠️ Admin Panel</h1>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-primary text-black font-medium"
                  : "text-textSecondary hover:text-textPrimary hover:bg-surfaceHover"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link
          to="/"
          className="flex items-center gap-3 text-textSecondary hover:text-textPrimary text-sm"
        >
          <ArrowLeft size={16} />
          Back to App
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Music, Mic2, Disc3, Users, ArrowLeft, X } from "lucide-react";

const AdminSidebar = ({ isMobileOpen, onMobileClose }) => {
  const location = useLocation();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", to: "/admin" },
    { icon: <Music size={20} />, label: "Songs", to: "/admin/songs" },
    { icon: <Mic2 size={20} />, label: "Artists", to: "/admin/artists" },
    { icon: <Disc3 size={20} />, label: "Albums", to: "/admin/albums" },
    { icon: <Users size={20} />, label: "Users", to: "/admin/users" },
  ];

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">🛠️ Admin Panel</h1>
        <button
          onClick={onMobileClose}
          className="md:hidden text-textSecondary hover:text-textPrimary"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={onMobileClose}
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
          onClick={onMobileClose}
          className="flex items-center gap-3 text-textSecondary hover:text-textPrimary text-sm"
        >
          <ArrowLeft size={16} />
          Back to App
        </Link>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden md:flex w-64 h-screen bg-black p-6 flex-col gap-6 sticky top-0">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 h-screen w-72 max-w-[80vw] bg-black p-6 flex flex-col gap-6 z-50 md:hidden overflow-y-auto"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
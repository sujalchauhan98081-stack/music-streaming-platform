import { ChevronLeft, ChevronRight, User, LogOut, Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Hamburger — only visible below the md breakpoint, where the sidebar is hidden */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-full bg-surface hover:bg-surfaceHover"
          title="Open menu"
        >
          <Menu size={20} />
        </button>

        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-surface hover:bg-surfaceHover"
          title="Go back"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => navigate(1)}
          className="p-2 rounded-full bg-surface hover:bg-surfaceHover"
          title="Go forward"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/profile"
          className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-surfaceHover"
          title="Profile"
        >
          <User size={18} />
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-textSecondary hover:text-textPrimary px-3 py-2 rounded-full hover:bg-surface transition-colors"
          title="Log out"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </header>
  );
};

export default Navbar;
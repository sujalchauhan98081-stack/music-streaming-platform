import { ChevronLeft, ChevronRight, User } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full bg-surface hover:bg-surfaceHover">
          <ChevronLeft size={20} />
        </button>
        <button className="p-2 rounded-full bg-surface hover:bg-surfaceHover">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="px-4 py-2 rounded-full bg-primary text-black font-semibold text-sm hover:scale-105 transition-transform">
          Upgrade
        </button>
        <button className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-surfaceHover">
          <User size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
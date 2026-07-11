import { Home, Search, Library, PlusSquare, Heart } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { icon: <Home size={22} />, label: "Home" },
    { icon: <Search size={22} />, label: "Search" },
    { icon: <Library size={22} />, label: "Your Library" },
  ];

  const libraryItems = [
    { icon: <PlusSquare size={20} />, label: "Create Playlist" },
    { icon: <Heart size={20} />, label: "Liked Songs" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-black p-6 gap-6 sticky top-0">
      <h1 className="text-2xl font-bold text-textPrimary mb-4">🎵 Sonique</h1>

      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-4 text-textSecondary hover:text-textPrimary transition-colors font-medium"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-surfaceHover my-2" />

      <nav className="flex flex-col gap-4">
        {libraryItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-4 text-textSecondary hover:text-textPrimary transition-colors font-medium"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
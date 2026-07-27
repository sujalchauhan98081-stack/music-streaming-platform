import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex bg-background min-h-screen text-textPrimary">
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 min-w-0">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden m-4 p-2 rounded-full bg-surface hover:bg-surfaceHover"
        >
          <Menu size={20} />
        </button>
        <main className="p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

AdminLayout.displayName = "AdminLayout";

export default AdminLayout;
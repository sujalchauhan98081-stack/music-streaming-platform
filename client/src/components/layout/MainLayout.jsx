import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 px-6 pb-32 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
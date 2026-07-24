import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { PlayerProvider } from "./context/PlayerContext";
import AppRoutes from "./routes/AppRoutes";
import MiniPlayer from "./player/MiniPlayer";
import FullscreenPlayer from "./player/FullscreenPlayer";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
          <AppRoutes />
          <MiniPlayer />
          <FullscreenPlayer />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
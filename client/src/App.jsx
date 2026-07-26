import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { PlayerProvider } from "./context/PlayerContext";
import AppRoutes from "./routes/AppRoutes";
import MiniPlayer from "./player/MiniPlayer";
import FullscreenPlayer from "./player/FullscreenPlayer";
import ErrorBoundary from "./components/ErrorBoundary";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

// Small internal component whose only job is to activate the keyboard
// shortcuts hook — it needs to render inside both BrowserRouter and
// PlayerProvider, so it can't just live directly in App() before those wrap it
const KeyboardShortcutsListener = () => {
  useKeyboardShortcuts();
  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <PlayerProvider>
            <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
            <KeyboardShortcutsListener />
            <AppRoutes />
            <MiniPlayer />
            <FullscreenPlayer />
          </PlayerProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
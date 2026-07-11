import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While we're still checking for a persisted session, don't redirect yet —
  // otherwise a logged-in user gets bounced to /login on every refresh
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-textSecondary">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
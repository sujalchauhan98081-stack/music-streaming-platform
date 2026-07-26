import { Component } from "react";
import { RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Called during the render phase when a descendant throws — updates state
  // so the next render shows the fallback UI instead of the crashed tree
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Called after an error has been thrown — good place for logging (console for
  // now; in a real production app this is where you'd send to an error-tracking
  // service like Sentry)
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
          <p className="text-textSecondary mb-8 max-w-md">
            Sonique hit an unexpected error. This has been logged — try reloading
            the page, or head back to Home.
          </p>

          {/* Only show the raw error message in development — never expose
              internal error details to real users in production */}
          {import.meta.env.DEV && this.state.error && (
            <pre className="bg-surface text-red-400 text-xs p-4 rounded-md mb-8 max-w-lg overflow-x-auto text-left">
              {this.state.error.toString()}
            </pre>
          )}

          <div className="flex gap-4">
            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 bg-primary text-black px-5 py-2.5 rounded-full font-medium hover:scale-105 transition-transform"
            >
              <RefreshCw size={16} /> Reload
            </button>
            <button
              onClick={this.handleGoHome}
              className="flex items-center gap-2 bg-surface text-textPrimary px-5 py-2.5 rounded-full font-medium hover:bg-surfaceHover transition-colors"
            >
              <Home size={16} /> Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Always log server-side for our own visibility — but keep it concise in production
  if (process.env.NODE_ENV === "development") {
    console.error(`❌ Error: ${err.message}`);
    console.error(err.stack);
  } else {
    // In production, log the message without the full stack trace cluttering logs,
    // unless it's a genuine unexpected 500 (not a normal 4xx client error)
    if (statusCode >= 500) {
      console.error(`❌ [${new Date().toISOString()}] ${err.message}`);
    }
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Stack traces NEVER go to the client in production — this was already correct,
    // but worth re-confirming now that we're hardening everything else
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
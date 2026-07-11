// Centralized error handler — every controller can just throw/next(error)
// instead of writing try/catch res.status().json() everywhere
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(`❌ Error: ${err.message}`);
  

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only show stack trace in development — never leak it in production
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

// Handles requests to routes that don't exist
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
// Wraps async controller functions so we don't need try/catch in every single one.
// Any thrown error automatically gets forwarded to our errorHandler middleware.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
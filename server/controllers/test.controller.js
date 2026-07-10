// This is a throwaway controller just to prove the MVC wiring works end-to-end.
// We'll delete/replace it once real controllers exist in Phase 3.
export const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy and MVC wiring works 🎵",
    timestamp: new Date().toISOString(),
  });
};
// Centralizing messages avoids typos across controllers and makes
// future i18n (multi-language) support easy later.
export const ERROR_MESSAGES = {
  USER_EXISTS: "User already exists with this email",
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  UNAUTHORIZED: "Not authorized, please log in",
  TOKEN_EXPIRED: "Session expired, please log in again",
  INVALID_TOKEN: "Invalid token",
  NO_REFRESH_TOKEN: "No refresh token provided",
};
// Custom NoSQL-injection sanitizer — replaces express-mongo-sanitize, which is
// incompatible with Express 5 (it tries to reassign req.query, which Express 5
// made read-only). This mutates objects in place instead, which is still allowed.

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") return;

  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
      continue;
    }

    if (typeof obj[key] === "object" && obj[key] !== null) {
      sanitizeObject(obj[key]); // recurse into nested objects/arrays
    }
  }
};

export const sanitizeRequest = (req, res, next) => {
  sanitizeObject(req.body);
  sanitizeObject(req.params);
  sanitizeObject(req.query); // mutating in place — never reassigning req.query itself
  next();
};
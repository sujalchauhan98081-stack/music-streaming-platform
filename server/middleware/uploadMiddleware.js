import multer from "multer";
import path from "path";

// Store files temporarily in /uploads before pushing to Cloudinary,
// then we delete the local copy (see cloudinaryService.js)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Restrict file types based on field name (song audio vs image covers)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "audio") {
    if (!file.mimetype.startsWith("audio/")) {
      return cb(new Error("Only audio files are allowed for the audio field"));
    }
  }
  if (file.fieldname === "image" || file.fieldname === "cover") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed for image/cover fields"));
    }
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max — reasonable for songs + covers
});
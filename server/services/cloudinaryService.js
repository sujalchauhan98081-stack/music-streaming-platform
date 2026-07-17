import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Uploads a local temp file to Cloudinary and deletes the local copy afterward
export const uploadToCloudinary = async (localFilePath, resourceType = "auto") => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType, // "video" is used for audio files in Cloudinary's API
      folder: "music-streaming-platform",
    });

    fs.unlinkSync(localFilePath); // clean up temp file regardless of success
    return result;
  } catch (error) {
    // Still clean up temp file even if upload fails
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    throw error;
  }
};
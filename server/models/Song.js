import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Song title is required"],
      trim: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      default: null, // songs can exist as singles, without an album
    },
    audioUrl: {
      type: String, // Cloudinary URL
      required: [true, "Audio file URL is required"],
    },
    coverImage: {
      type: String, // Cloudinary URL — falls back to album cover on the frontend if empty
      default: "",
    },
    duration: {
      type: Number, // in seconds
      required: [true, "Duration is required"],
    },
    genre: {
      type: String,
      default: "",
    },
    playCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for fast search on title (Phase 9 will use this heavily)
songSchema.index({ title: "text", genre: "text" });

const Song = mongoose.model("Song", songSchema);
export default Song;
import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Album title is required"],
      trim: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    coverImage: {
      type: String, // Cloudinary URL
      default: "",
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    genre: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Album = mongoose.model("Album", albumSchema);
export default Album;
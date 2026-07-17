import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Artist name is required"],
      trim: true,
    },
    bio: {
      type: String,
      default: "",
    },
    image: {
      type: String, // Cloudinary URL
      default: "",
    },
    genres: [{ type: String }],
    monthlyListeners: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Artist = mongoose.model("Artist", artistSchema);
export default Artist;
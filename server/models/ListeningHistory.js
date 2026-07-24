import mongoose from "mongoose";

const listeningHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: true,
    },
    playedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false } // we only care about playedAt, not createdAt/updatedAt
);

// Index for fast "recently played" queries (sorted by playedAt, filtered by user)
listeningHistorySchema.index({ user: 1, playedAt: -1 });

const ListeningHistory = mongoose.model("ListeningHistory", listeningHistorySchema);
export default ListeningHistory;
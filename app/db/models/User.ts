import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    image: String,
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sentLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    receivedLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

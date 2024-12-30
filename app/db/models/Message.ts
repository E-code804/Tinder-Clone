import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", messageSchema);
//db.find({ $or: [{ sender: userA, receiver: userB }, { sender: userB, receiver: userA }]}.sort({ timestamp: -1 }).skip(offset).limit(limit)

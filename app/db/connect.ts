import mongoose from "mongoose";

// Track connection status
let isConnected = false;

const connectMongoDB = async () => {
  const mongoUri = process.env.MONGO_CONNECTION_STRING;

  if (!mongoUri) {
    throw new Error("Missing MONGO_CONNECTION_STRING in env variables.");
  }

  if (isConnected) {
    console.log("Using existing DB connection.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Could not connect to MongoDB");
    console.log(error);
  }
};

export default connectMongoDB;

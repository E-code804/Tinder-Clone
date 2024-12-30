import connectMongoDB from "@/app/db/connect";
import Message from "@/app/db/models/Message";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sender = searchParams.get("sender");
    const receiver = searchParams.get("receiver");

    if (!sender || !receiver) {
      return NextResponse.json(
        { error: "Sender and receiver are required." },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(sender) ||
      !mongoose.Types.ObjectId.isValid(receiver)
    ) {
      return NextResponse.json(
        { error: "Invalid sender or receiver ID." },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const messages = await Message.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    }); //.sort({ createdAt: 1 });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
      status: 500,
    });
  }
}

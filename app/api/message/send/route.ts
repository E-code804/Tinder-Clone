import connectMongoDB from "@/app/db/connect";
import Message from "@/app/db/models/Message";
import { NextRequest, NextResponse } from "next/server";

// TODO: Sanitize messages and encrypt. Make sure ALL POST reqs are sanitized and parameterized.
export async function POST(req: NextRequest) {
  try {
    const { sender, receiver, message } = await req.json(); // have check to ensure sender, recipient is valid and in messages.
    await connectMongoDB();

    await Message.create({
      sender: sender,
      receiver: receiver,
      message: message,
    });

    return NextResponse.json({ message: "Sent messages" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
      status: 500,
    });
  }
}

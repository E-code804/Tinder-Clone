import connectMongoDB from "@/app/db/connect";
import User from "@/app/db/models/User";
import { UserParams } from "@/app/interfaces/UserInterfaces";
import { NextRequest, NextResponse } from "next/server";

// TODO: when an undo is done, must remove ID from received/sent likes arrays.
// Send a like from current user to another user
export async function POST(req: NextRequest, { params }: { params: UserParams }) {
  const { userId } = params;
  const { likedUserId } = await req.json();

  await connectMongoDB();

  const currentUser = await User.findById(userId); // turn this into a function
  const likedUser = await User.findById(likedUserId); // turn this into a function DO NOT NEED HERE

  if (!currentUser || !likedUser) {
    return NextResponse.json({ error: "No such user" }, { status: 404 });
  }

  // Check if likedUser is in currentUser's sent likes (this is a match)

  // Otherwise, add currentUser's ID to likedUser's received and likedUser to currentUser's sent
  // MAKE SURE NOT ALREADY IN SENT/RECEIVED
  try {
    const [likedUserResult, currentUserResult] = await Promise.all([
      User.updateOne({ _id: likedUserId }, { $push: { receivedLikes: userId } }),
      User.updateOne({ _id: userId }, { $push: { sentLikes: likedUserId } }),
    ]);

    // Check if both updates succeeded
    if (likedUserResult.modifiedCount === 0) {
      return NextResponse.json({ message: "Liked user not found" }, { status: 404 });
    }

    if (currentUserResult.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Current user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Successfully registered like." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

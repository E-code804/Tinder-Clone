import connectMongoDB from "@/app/db/connect";
import Message from "@/app/db/models/Message";
import User from "@/app/db/models/User";
import { UserParams } from "@/app/interfaces/UserInterfaces";
import { NextRequest, NextResponse } from "next/server";

// Return users in the current user's received likes list
export async function GET(req: NextRequest, { params }: { params: UserParams }) {
  try {
    const { userId } = params;
    await connectMongoDB();
    const userReceivedLikes = await User.findById(userId, { receivedLikes: 1 });

    if (!userReceivedLikes) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ userReceivedLikes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

// User accepts a received liked. Will likely have to consider if trying to accept an id the DNE, authorization here.
export async function POST(req: NextRequest, { params }: { params: UserParams }) {
  // When a user accepts from their received list, must:
  // 1. remove userId from acceptedUserId's sent likes list.
  // 2. remove acceptedUserID from userId's received list.
  // 3. Add both IDs to the other's respective matches list.
  try {
    const { userId } = params;
    const { acceptedUserId } = await req.json();
    await connectMongoDB();

    const [
      removeUserIdFromSent,
      removeAcceptedIdFromReceived,
      addUserIdToMatches,
      addAcceptedIdToMatches,
    ] = await Promise.all([
      User.updateOne({ _id: acceptedUserId }, { $pull: { sentLikes: userId } }),
      User.updateOne({ _id: userId }, { $pull: { receivedLikes: acceptedUserId } }),
      User.updateOne({ _id: userId }, { $push: { matches: acceptedUserId } }),
      User.updateOne({ _id: acceptedUserId }, { $push: { matches: userId } }),
    ]);

    if (removeUserIdFromSent.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Could not remove user from likes sent." },
        { status: 404 }
      );
    }

    if (removeAcceptedIdFromReceived.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Could not remove accepted user from received likes." },
        { status: 404 }
      );
    }

    if (addUserIdToMatches.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Could not add user to matches." },
        { status: 404 }
      );
    }

    if (addAcceptedIdToMatches.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Could not add accepted user to matches." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Successfully matched!" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error occurred. ${error.message}` },
      { status: 500 }
    );
  }
}

import connectMongoDB from "@/app/db/connect";
import User from "@/app/db/models/User";
import { UserParams } from "@/app/interfaces/UserInterfaces";
import { NextRequest, NextResponse } from "next/server";
// TODO: when an undo is done, must remove ID from received/sent likes arrays.

// Send a like from current user to another user
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<UserParams> }
) {
  const { userId } = await params;
  const { likedUserId } = await req.json();
  let likedUser;

  try {
    await connectMongoDB();

    likedUser = await User.findById(likedUserId); // turn this into a function
    if (!likedUser) {
      return NextResponse.json(
        { message: "Could not find liked user to matches." },
        { status: 404 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error occurred. ${error.message}` },
      { status: 500 }
    );
  }

  // Check if currentUser is in likedUser's sent likes (this is a match). make this logic into utils if possible for matches route.
  try {
    if (likedUser.sentLikes.includes(userId)) {
      const [
        removedUserFromSent,
        removedLikedFromUserReceived,
        addUserToLikedMatches,
        addLikedToUserMatches,
      ] = await Promise.all([
        // Remove userId from likedUser's sentLikes and remove likedUserId from userId's received
        User.updateOne({ _id: likedUserId }, { $pull: { sentLikes: userId } }),
        User.updateOne({ _id: userId }, { $pull: { receivedLikes: likedUserId } }),
        // Put userId in likedUser's matches and vice versa
        User.updateOne({ _id: likedUserId }, { $push: { matches: userId } }),
        User.updateOne({ _id: userId }, { $push: { matches: likedUserId } }),
      ]);

      if (removedUserFromSent.modifiedCount === 0) {
        return NextResponse.json(
          { message: "Could not remove user from likes sent." },
          { status: 404 }
        );
      }

      if (removedLikedFromUserReceived.modifiedCount === 0) {
        return NextResponse.json(
          { message: "Could not remove user from received likes." },
          { status: 404 }
        );
      }

      if (addUserToLikedMatches.modifiedCount === 0) {
        return NextResponse.json(
          { message: "Could not add user to matches." },
          { status: 404 }
        );
      }

      if (addLikedToUserMatches.modifiedCount === 0) {
        return NextResponse.json(
          { message: "Could not add liked user to matches." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "Successfully matched!" },
        { status: 201 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error occurred. ${error.message}` },
      { status: 500 }
    );
  }

  // Otherwise, add currentUser's ID to likedUser's received and likedUser to currentUser's sent
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
    return NextResponse.json(
      { error: "Error occurred. Internal server error." },
      { status: 500 }
    );
  }
}

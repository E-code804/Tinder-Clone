import connectMongoDB from "@/app/db/connect";
import User from "@/app/db/models/User";
import { UserParams } from "@/app/interfaces/UserInterfaces";
import { NextRequest, NextResponse } from "next/server";

// Return users in the current user's matches list
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<UserParams> }
) {
  try {
    const { userId } = await params;
    await connectMongoDB();
    const userMatches = await User.findById(userId, { matches: 1 });

    if (!userMatches) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    // Could validate the IDs in userMatches if nec.
    const matchedUsers = await User.find({ _id: { $in: userMatches.matches } });

    return NextResponse.json({ matchedUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

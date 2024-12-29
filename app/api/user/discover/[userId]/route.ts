import connectMongoDB from "@/app/db/connect";
import User from "@/app/db/models/User";
import { UserParams } from "@/app/interfaces/UserInterfaces";
import { NextRequest, NextResponse } from "next/server";

// Getting other profiles to display in user's discover
export async function GET(req: NextRequest, { params }: { params: UserParams }) {
  const { userId } = params;
  await connectMongoDB();
  const user = await User.findById(userId);

  if (!user) {
    return NextResponse.json({ error: "No such user" }, { status: 404 });
  }

  const { matches, sentLikes } = user;
  const seenUsers = [...matches, ...sentLikes, userId];
  const discoverUsers = await User.find({ _id: { $nin: seenUsers } });

  // In case user has no one left to discover
  if (discoverUsers.length === 0) {
    return NextResponse.json(
      { message: "No new users to discover" },
      { status: 200 }
    );
  }
  return NextResponse.json({ users: discoverUsers }, { status: 200 });
}
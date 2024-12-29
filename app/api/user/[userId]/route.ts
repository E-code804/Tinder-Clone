import connectMongoDB from "@/app/db/connect";
import User from "@/app/db/models/User";
import { UserParams } from "@/app/interfaces/UserInterfaces";
import { NextRequest, NextResponse } from "next/server";

// Get the current user
export async function GET(req: NextRequest, { params }: { params: UserParams }) {
  const { userId } = params;
  await connectMongoDB();
  const user = await User.findById(userId);

  if (!user) {
    return NextResponse.json({ error: "No such user" }, { status: 404 });
  }
  return NextResponse.json({ user }, { status: 200 });
}

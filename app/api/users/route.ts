import connectMongoDB from "@/app/db/connect";
import User from "@/app/db/models/User";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

const saltRounds = 10;

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// Create a new user
export async function POST(req: NextRequest) {
  await connectMongoDB();
  const { name, email, password, image } = await req.json();
  const user = await User.findOne({ email });

  if (user) {
    return NextResponse.json(
      { message: "User already exists" },
      {
        status: 409,
      }
    );
  }

  try {
    const hashedPassword = await hashPassword(password);
    await User.create({ name, email, hashedPassword, image });
    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (err: unknown) {
    // Type guard to check if err is an instance of Error
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message, status: 500 });
    }
    // Handle cases where err might not be an Error (fallback)
    return NextResponse.json({
      error: "An unknown error occurred",
      status: 500,
    });
  }
}

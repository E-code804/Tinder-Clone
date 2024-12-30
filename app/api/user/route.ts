import connectMongoDB from "@/app/db/connect";
import User from "@/app/db/models/User";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

const saltRounds = 10;

// Hash password
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}

export async function GET() {
  try {
    const users = await User.find({});
    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
      status: 500,
    });
  }
}

// Create new user with image upload, TODO: sanitize inputs
export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const image = formData.get("image") as File;

    if (!name || !email || !password || !image) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    // Convert image to Base64
    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = buffer.toString("base64");

    await User.create({
      name,
      email,
      password: hashedPassword,
      image: base64Image,
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
      status: 500,
    });
  }
}

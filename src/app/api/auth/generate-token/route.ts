import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken } from "@/utils/jwt";

const dummyUsers = [
  { id: "1", email: "john@example.com", role: "user" },
  { id: "2", email: "admin@example.com", role: "admin" },
  { id: "3", email: "jane@example.com", role: "user" }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const user = dummyUsers.find(u => u.id === id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const token = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err: any) {
    console.error("Error generating token:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
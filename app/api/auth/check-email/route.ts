import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if email exists in users table
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    // Check if email exists in invitations table
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        status: "PENDING"
      }
    });

    const isAllowed = existingUser || existingInvitation;

    return NextResponse.json({
      isAllowed,
      message: isAllowed 
        ? "Email is allowed to sign in" 
        : "Email is not allowed to sign in"
    });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json(
      { error: "Failed to check email" },
      { status: 500 }
    );
  }
} 
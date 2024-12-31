import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test database connection
    const test = await prisma.user.findFirst();
    return NextResponse.json({ status: "Connected to database", test });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "Failed to connect to database", details: error },
      { status: 500 }
    );
  }
} 
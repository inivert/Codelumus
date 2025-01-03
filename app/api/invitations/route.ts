import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { sendInvitationEmail } from "@/lib/invitation";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { email } = await req.json();

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    await sendInvitationEmail(
      email,
      session.user.name || "The Admin Team"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[INVITATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
import { Resend } from "resend";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const session = await auth();
    console.log("Session:", session); // Debug log

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User ID:", session.user.id); // Debug log

    try {
      const messages = await prisma.supportMessage.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          subject: true,
          website: true,
          message: true,
          createdAt: true,
        },
      });

      return NextResponse.json({ messages });
    } catch (dbError) {
      console.error("Database error:", dbError); // Debug log
      return NextResponse.json(
        { error: "Database error", details: dbError },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in GET /api/support:", error); // Debug log
    return NextResponse.json(
      { error: "Failed to fetch messages", details: error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    console.log("POST Session:", session); // Debug log

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, website, message } = await req.json();
    console.log("POST Data:", { subject, website, message }); // Debug log

    try {
      // Create support message in database
      const supportMessage = await prisma.supportMessage.create({
        data: {
          subject,
          website,
          message,
          userId: session.user.id,
        },
      });

      // Send email
      if (process.env.RESEND_API_KEY) {
        const { error: emailError } = await resend.emails.send({
          from: "Codelumus Support <support@codelumus.com>",
          to: "carlos@codelumus.com",
          subject: `Support Request: ${subject}`,
          text: `
From: ${session.user.email}
Name: ${session.user.name}
Website: ${website}

Subject: ${subject}

Message:
${message}
          `,
        });

        if (emailError) {
          console.error("Error sending email:", emailError);
        }
      }

      return NextResponse.json({ message: supportMessage });
    } catch (dbError) {
      console.error("Database error in POST:", dbError); // Debug log
      return NextResponse.json(
        { error: "Database error", details: dbError },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in POST /api/support:", error); // Debug log
    return NextResponse.json(
      { error: "Failed to create support message", details: error },
      { status: 500 }
    );
  }
} 
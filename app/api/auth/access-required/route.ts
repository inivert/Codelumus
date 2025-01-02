import { NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";
import AccessRequiredEmail from "@/emails/access-required-email";

// Validate environment variables
if (!env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set");
}

if (!env.EMAIL_FROM) {
  throw new Error("EMAIL_FROM is not set");
}

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log("Processing request for email:", email);

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log("User already exists:", email);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Send access required email
    try {
      console.log("Attempting to send email with Resend...");
      console.log("From:", env.EMAIL_FROM);
      console.log("To:", email);

      const emailResponse = await resend.emails.send({
        from: env.EMAIL_FROM,
        to: email,
        subject: "Access Required - Thank You for Your Interest",
        react: AccessRequiredEmail({ userEmail: email }),
        text: `Thank you for your interest in our platform. Please schedule a consultation to discuss access.`, // Fallback plain text
      });

      console.log("Resend API Response:", JSON.stringify(emailResponse, null, 2));

      return NextResponse.json(
        { 
          message: "Access required email sent successfully",
          data: emailResponse
        },
        { status: 200 }
      );
    } catch (emailError: any) {
      // Log the full error details
      console.error("Resend API Error Details:", {
        error: emailError,
        message: emailError.message,
        name: emailError.name,
        code: emailError.code,
        statusCode: emailError.statusCode,
        response: emailError.response,
        stack: emailError.stack,
      });

      // Check for specific error types
      if (emailError.statusCode === 429) {
        return NextResponse.json(
          { 
            error: "Rate limit exceeded",
            details: "Too many email requests. Please try again later."
          },
          { status: 429 }
        );
      }

      if (emailError.statusCode === 401) {
        return NextResponse.json(
          { 
            error: "Authentication failed",
            details: "Invalid API key or authentication error."
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { 
          error: "Failed to send email",
          details: emailError.message,
          code: emailError.code
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Request Processing Error:", {
      error,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error.message
      },
      { status: 500 }
    );
  }
} 
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { InvitationEmail } from "@/emails/invitation-email";
import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendInvitationEmail(inviteeEmail: string, inviterName: string, inviterId: string) {
  try {
    console.log('Starting invitation process for:', inviteeEmail);
    
    // First, create or update the user in the database
    const user = await prisma.user.upsert({
      where: { email: inviteeEmail },
      update: {}, // If user exists, don't update anything
      create: {
        email: inviteeEmail,
        role: "USER",
      },
    });

    console.log('User upserted:', user);

    // Create invitation record
    const invitation = await prisma.invitation.create({
      data: {
        email: inviteeEmail,
        inviterId: inviterId,
        status: "PENDING",
      },
    });

    console.log('Invitation record created:', invitation);

    // Generate the sign-in URL (this should point to your login page)
    const actionUrl = `${env.NEXT_PUBLIC_APP_URL}/login`;

    console.log('Sending email with config:', {
      from: env.EMAIL_FROM,
      to: inviteeEmail,
      subject: `You've been invited to join ${siteConfig.name}!`
    });

    // Send the invitation email
    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: inviteeEmail,
      subject: `You've been invited to join ${siteConfig.name}!`,
      react: InvitationEmail({
        inviteeEmail,
        inviterName,
        actionUrl,
        siteName: siteConfig.name,
      }),
      headers: {
        "X-Entity-Ref-ID": new Date().getTime() + "",
      },
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error(error.message);
    }

    console.log('Email sent successfully:', data);

    return { success: true, data, invitation };
  } catch (error) {
    console.error("Failed to send invitation email:", error);
    // Log the full error object for debugging
    console.error("Full error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    throw error;
  }
}

export async function getInvitations() {
  try {
    const invitations = await prisma.invitation.findMany({
      include: {
        invitedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return invitations;
  } catch (error) {
    console.error("Failed to fetch invitations:", error);
    throw error;
  }
} 
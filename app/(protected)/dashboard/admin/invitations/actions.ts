"use server";

import { auth } from "@/auth";
import { resend } from "@/lib/email";
import { InvitationEmail } from "@/emails/invitation-email";
import { siteConfig } from "@/config/site";

export async function sendInvitation(email: string) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const invitationToken = crypto.randomUUID();
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`;

    const { data, error } = await resend.emails.send({
      from: `${siteConfig.name} <${process.env.EMAIL_FROM}>`,
      to: process.env.NODE_ENV === "development" ? "delivered@resend.dev" : email,
      subject: `You've been invited to join ${siteConfig.name}!`,
      react: InvitationEmail({
        inviteeEmail: email,
        inviterName: session.user.name || "An administrator",
        actionUrl: invitationUrl,
        siteName: siteConfig.name,
      }),
      headers: {
        "X-Entity-Ref-ID": new Date().getTime() + "",
      },
    });

    if (error) {
      console.error("Failed to send invitation email:", error);
      throw new Error("Failed to send invitation email");
    }

    // TODO: Store invitation in database (will be implemented in next step)

    return { success: true };
  } catch (error) {
    console.error("Error sending invitation:", error);
    throw error;
  }
} 
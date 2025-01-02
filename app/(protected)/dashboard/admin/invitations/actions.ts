"use server";

import { auth } from "@/auth";
import { sendInvitationEmail, getInvitations } from "@/lib/invitation";

export async function sendInvitation(email: string) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== "ADMIN" || !session.user.id) {
      throw new Error("Unauthorized");
    }

    await sendInvitationEmail(
      email,
      session.user.name || "An administrator",
      session.user.id
    );

    return { success: true };
  } catch (error) {
    console.error("Error sending invitation:", error);
    throw error;
  }
}

export { getInvitations }; 
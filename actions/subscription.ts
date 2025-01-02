"use server";

import { auth } from "@/auth";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { prisma } from "@/lib/db";

export async function getSubscription() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return null;
    }

    // First check if we have subscription data in the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        stripeSubscriptionId: true,
        stripeCurrentPeriodEnd: true,
        stripeCustomerId: true,
        stripePriceId: true,
      }
    });

    if (!user?.stripeSubscriptionId) {
      return null;
    }

    // If we have subscription data, get the full plan details
    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id);
    return subscriptionPlan;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
} 
"use server";

import { auth } from "@/auth";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { prisma } from "@/lib/db";
import { pricingData } from "@/config/subscriptions";

const defaultPlan = {
  ...pricingData[0],
  stripePriceId: null,
  stripeSubscriptionId: null,
  stripeCustomerId: null,
  stripeCurrentPeriodEnd: null,
  isPaid: false,
  interval: null,
  isCanceled: false,
  activeAddons: [],
};

export async function getSubscription() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return defaultPlan;
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

    // If no subscription data, return default plan
    if (!user?.stripeSubscriptionId) {
      return defaultPlan;
    }

    // If we have subscription data, get the full plan details
    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id);
    return subscriptionPlan;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    // Return default plan on error
    return defaultPlan;
  }
} 
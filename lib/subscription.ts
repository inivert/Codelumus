// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { pricingData } from "@/config/subscriptions";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { UserSubscriptionPlan } from "types";

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  if(!userId) throw new Error("Missing parameters");

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Debug log
  console.log("Subscription data:", {
    stripeSubscriptionId: user.stripeSubscriptionId,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
    stripeCustomerId: user.stripeCustomerId,
    stripePriceId: user.stripePriceId
  });

  // Check if user is on a paid plan - less strict check for test mode
  const isPaid = !!(
    user.stripeCustomerId && 
    user.stripeSubscriptionId
  );

  // Find the pricing data corresponding to the user's plan
  const userPlan =
    pricingData.find((plan) => plan.stripeIds.monthly === user.stripePriceId) ||
    pricingData.find((plan) => plan.stripeIds.yearly === user.stripePriceId);

  const plan = isPaid && userPlan ? userPlan : pricingData[0]

  const interval = isPaid
    ? userPlan?.stripeIds.monthly === user.stripePriceId
      ? "month"
      : userPlan?.stripeIds.yearly === user.stripePriceId
      ? "year"
      : null
    : null;

  // Only check cancellation status if subscription exists
  let isCanceled = false;
  if (isPaid && user.stripeSubscriptionId) {
    try {
      const stripePlan = await stripe.subscriptions.retrieve(
        user.stripeSubscriptionId
      )
      isCanceled = stripePlan.cancel_at_period_end
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  }

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime(),
    isPaid,
    interval,
    isCanceled
  }
}

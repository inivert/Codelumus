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

  const plan = isPaid && userPlan ? userPlan : pricingData[0];

  const interval = isPaid
    ? userPlan?.stripeIds.monthly === user.stripePriceId
      ? "month"
      : userPlan?.stripeIds.yearly === user.stripePriceId
      ? "year"
      : null
    : null;

  // Only check cancellation status and add-ons if subscription exists
  let isCanceled = false;
  let activeAddons: string[] = [];

  if (isPaid && user.stripeSubscriptionId) {
    try {
      console.log("Fetching subscription details from Stripe...");
      const stripePlan = await stripe.subscriptions.retrieve(
        user.stripeSubscriptionId,
        {
          expand: ['items.data.price.product']
        }
      );
      
      console.log("Stripe subscription items:", stripePlan.items.data);
      
      isCanceled = stripePlan.cancel_at_period_end;

      // Get active add-ons from subscription items
      activeAddons = stripePlan.items.data
        .filter(item => {
          console.log("Item product metadata:", item.price.product.metadata);
          return item.price.product.metadata.type === 'addon';
        })
        .map(item => {
          console.log("Found addon with ID:", item.price.product.metadata.addonId);
          return item.price.product.metadata.addonId;
        });

      console.log("Active addons:", activeAddons);

    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  }

  const subscriptionPlan = {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime(),
    isPaid,
    interval,
    isCanceled,
    activeAddons
  };

  console.log("Final subscription plan:", subscriptionPlan);
  return subscriptionPlan;
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { pricingData } from "@/config/subscriptions";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function GET() {
  try {
    const session = await auth();
    console.log("Session data:", session);

    if (!session?.user?.email) {
      console.log("Unauthorized - Missing session or email");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("Authenticated user:", {
      email: session.user.email,
      id: session.user.id
    });

    // Get user with their subscription data
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get or create Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId && user.email) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      });
    }

    // Get the base plan
    const plan = pricingData[0];

    // Initialize subscription details
    let isSubscriptionActive = false;
    let isCanceled = false;
    let interval: "month" | "year" | undefined = undefined;
    let activeAddons: string[] = [];
    let stripePriceId = user.stripePriceId;

    // If user has a subscription, get details from Stripe
    if (user.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          user.stripeSubscriptionId,
          {
            expand: ['items.data.price.product']
          }
        );

        isSubscriptionActive = subscription.status === 'active';
        isCanceled = subscription.cancel_at_period_end;

        // Find the base subscription item
        const baseItem = subscription.items.data.find(
          item => {
            const product = item.price.product as Stripe.Product;
            return !product.metadata.type || product.metadata.type !== 'addon';
          }
        );

        if (baseItem) {
          stripePriceId = baseItem.price.id;
          interval = baseItem.price.recurring?.interval === 'month' ? 'month' : 'year';
        }

        // Get active addons
        activeAddons = subscription.items.data
          .filter(item => {
            const product = item.price.product as Stripe.Product;
            return product.metadata.type === 'addon';
          })
          .map(item => {
            const product = item.price.product as Stripe.Product;
            return product.metadata.addonId;
          })
          .filter((id): id is string => typeof id === 'string');

        console.log("Stripe subscription details:", {
          status: subscription.status,
          isCanceled: subscription.cancel_at_period_end,
          interval,
          baseItem: baseItem?.price.id,
          activeAddons,
        });
      } catch (error) {
        console.error("Error fetching Stripe subscription:", error);
      }
    }

    // Construct the subscription plan object
    const subscriptionPlan = {
      ...plan,
      stripeCustomerId: stripeCustomerId || "",
      stripeSubscriptionId: user.stripeSubscriptionId || "",
      stripePriceId: stripePriceId || "",
      stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime() || Date.now(),
      isPaid: isSubscriptionActive,
      interval: interval || null,
      isCanceled,
      activeAddons,
    };

    console.log("Returning subscription plan:", subscriptionPlan);
    return NextResponse.json(subscriptionPlan);
  } catch (error) {
    console.error("[SUBSCRIPTION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

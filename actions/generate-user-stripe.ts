"use server";

import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { prisma } from "@/lib/db";

interface AddonItem {
  priceId: string;
  quantity: number;
}

export async function generateUserStripe(
  mainPriceId: string | null,
  addons: AddonItem[] = []
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.email) {
      throw new Error("User not found");
    }

    // Get user's Stripe data
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        stripeCustomerId: true,
        stripeSubscriptionId: true,
      },
    });

    if (!dbUser) {
      throw new Error("User not found in database");
    }

    // If there's no main price and no addons, throw error
    if (!mainPriceId && addons.length === 0) {
      throw new Error("No items selected for purchase");
    }

    // Validate mainPriceId exists in Stripe if provided
    if (mainPriceId) {
      try {
        await stripe.prices.retrieve(mainPriceId);
      } catch (error) {
        console.error("Invalid main price ID:", mainPriceId);
        throw new Error("Invalid main price ID");
      }
    }

    // Validate addon price IDs exist in Stripe
    for (const addon of addons) {
      try {
        await stripe.prices.retrieve(addon.priceId);
      } catch (error) {
        console.error("Invalid addon price ID:", addon.priceId);
        throw new Error(`Invalid addon price ID: ${addon.priceId}`);
      }
    }

    const billingUrl = absoluteUrl("/dashboard/billing");

    // Prepare line items
    const lineItems = [
      ...(mainPriceId ? [{
        price: mainPriceId,
        quantity: 1,
      }] : []),
      ...addons.map((addon) => ({
        price: addon.priceId,
        quantity: addon.quantity,
      })),
    ];

    console.log("Creating Stripe session with line items:", JSON.stringify(lineItems, null, 2));

    // Create session configuration
    const sessionConfig: any = {
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      metadata: {
        userId: user.id,
      },
      allow_promotion_codes: true,
      line_items: lineItems,
    };

    // If user already has a Stripe customer ID, use it
    if (dbUser.stripeCustomerId) {
      sessionConfig.customer = dbUser.stripeCustomerId;
    } else {
      sessionConfig.customer_email = user.email;
    }

    // If user has an existing subscription and is adding addons
    if (dbUser.stripeSubscriptionId && addons.length > 0 && !mainPriceId) {
      // Update subscription directly instead of creating a payment session
      try {
        const subscription = await stripe.subscriptions.retrieve(dbUser.stripeSubscriptionId);
        
        // Add new items to the subscription
        for (const addon of addons) {
          await stripe.subscriptionItems.create({
            subscription: dbUser.stripeSubscriptionId,
            price: addon.priceId,
            quantity: addon.quantity,
          });

          // Record the addon in the database
          await prisma.userAddon.create({
            data: {
              userId: user.id,
              addonId: addon.priceId,
              active: true,
              stripePriceId: addon.priceId,
            },
          });
        }

        // Return to billing page
        return { url: billingUrl };
      } catch (error) {
        console.error("Error updating subscription with addons:", error);
        throw new Error("Failed to add addons to subscription");
      }
    } else {
      sessionConfig.mode = "subscription";
    }

    const stripeSession = await stripe.checkout.sessions.create(sessionConfig);

    if (!stripeSession?.url) {
      throw new Error("No URL in Stripe session response");
    }

    return { url: stripeSession.url };
  } catch (error) {
    console.error("Detailed error in generateUserStripe:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to generate user stripe session");
  }
}
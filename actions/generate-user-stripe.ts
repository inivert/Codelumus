"use server";

import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

interface AddonItem {
  priceId: string;
  quantity: number;
}

export async function generateUserStripe(
  mainPriceId: string,
  addons: AddonItem[] = []
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.email) {
      throw new Error("User not found");
    }

    if (!mainPriceId) {
      throw new Error("Main price ID is required");
    }

    // Validate mainPriceId exists in Stripe
    try {
      await stripe.prices.retrieve(mainPriceId);
    } catch (error) {
      console.error("Invalid main price ID:", mainPriceId);
      throw new Error("Invalid main price ID");
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
    const lineItems = [
      {
        price: mainPriceId,
        quantity: 1,
      },
      ...addons.map((addon) => ({
        price: addon.priceId,
        quantity: addon.quantity,
      })),
    ];

    console.log("Creating Stripe session with line items:", JSON.stringify(lineItems, null, 2));

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.email,
      line_items: lineItems,
      metadata: {
        userId: user.id,
      },
      allow_promotion_codes: true,
    });

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
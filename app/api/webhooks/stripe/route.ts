import { headers } from "next/headers";
import Stripe from "stripe";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
    console.log("Webhook event received:", event.type);
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout session completed:", {
        sessionId: session.id,
        customerId: session.customer,
        userId: session?.metadata?.userId
      });

      // Retrieve the subscription details from Stripe.
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );
      console.log("Subscription details:", {
        subscriptionId: subscription.id,
        priceId: subscription.items.data[0].price.id,
        periodEnd: new Date(subscription.current_period_end * 1000)
      });

      // Update the user stripe info in our database.
      const updatedUser = await prisma.user.update({
        where: {
          id: session?.metadata?.userId,
        },
        data: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        },
      });
      console.log("User updated with subscription data:", {
        userId: updatedUser.id,
        subscriptionId: updatedUser.stripeSubscriptionId,
        priceId: updatedUser.stripePriceId
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      const session = event.data.object as Stripe.Invoice;
      console.log("Invoice payment succeeded:", {
        invoiceId: session.id,
        subscriptionId: session.subscription,
        customerId: session.customer
      });

      // If the billing reason is not subscription_create, it means the customer has updated their subscription.
      if (session.billing_reason !== "subscription_create") {
        // Retrieve the subscription details from Stripe.
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );
        console.log("Updated subscription details:", {
          subscriptionId: subscription.id,
          priceId: subscription.items.data[0].price.id,
          periodEnd: new Date(subscription.current_period_end * 1000)
        });

        // Update the price id and set the new period end.
        const updatedUser = await prisma.user.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ),
          },
        });
        console.log("User updated after subscription change:", {
          userId: updatedUser.id,
          subscriptionId: updatedUser.stripeSubscriptionId,
          priceId: updatedUser.stripePriceId
        });
      }
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
}

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
      {
        expand: ["items.data.price"]
      }
    );

    // Find the base subscription item
    const baseSubscriptionItem = subscription.items.data.find(
      (item: any) => !item.price.metadata.isAddon
    );

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    // Update user's subscription information
    await prisma.user.update({
      where: {
        id: session.metadata.userId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: baseSubscriptionItem?.price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        subscriptionStatus: subscription.status,
      },
    });
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as any;
    const userId = subscription.metadata.userId;

    if (userId) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          subscriptionStatus: subscription.status,
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as any;
    const userId = subscription.metadata.userId;

    if (userId) {
      await prisma.user.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          subscriptionStatus: "canceled",
          stripePriceId: null,
          stripeSubscriptionId: null,
        },
      });

      // Deactivate all add-ons
      await prisma.userAddon.updateMany({
        where: {
          userId: userId,
          active: true,
        },
        data: {
          active: false,
        },
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { addonId } = body;

    if (!addonId) {
      return new NextResponse("Addon ID is required", { status: 400 });
    }

    // Get user's subscription data
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        stripeSubscriptionId: true,
      },
    });

    if (!user?.stripeSubscriptionId) {
      return new NextResponse("No active subscription found", { status: 400 });
    }

    // Get the subscription and find the addon subscription item
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
      expand: ['items.data.price.product']
    });

    const addonItem = subscription.items.data.find(item => {
      const product = item.price.product as Stripe.Product;
      return product.metadata.type === 'addon' && product.metadata.addonId === addonId;
    });

    if (!addonItem) {
      return new NextResponse("Addon not found in subscription", { status: 404 });
    }

    // Remove the addon from the subscription
    await stripe.subscriptionItems.del(addonItem.id);

    // Update the addon status in the database
    await prisma.userAddon.updateMany({
      where: {
        userId: user.id,
        addonId: addonId,
        active: true,
      },
      data: {
        active: false,
      },
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[ADDON_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
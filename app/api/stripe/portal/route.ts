import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscriptionPlan } from "@/lib/subscription";

export async function POST() {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id);

    if (!subscriptionPlan?.stripeCustomerId) {
      return new NextResponse("No customer ID found", { status: 400 });
    }

    const { url } = await stripe.billingPortal.sessions.create({
      customer: subscriptionPlan.stripeCustomerId,
      return_url: absoluteUrl("/dashboard/billing"),
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 
"use client";

import { useTransition } from "react";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import { SubscriptionPlan, UserSubscriptionPlan, AddOn } from "@/types";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface BillingFormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
  selectedAddons?: AddOn[];
  size?: "default" | "sm" | "lg" | "icon";
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
  selectedAddons = [],
  className,
  size,
  ...props
}: BillingFormButtonProps) {
  let [isPending, startTransition] = useTransition();
  
  const generateUserStripeSession = async () => {
    try {
      const mainPriceId = offer.stripeIds[year ? "yearly" : "monthly"];
      if (!mainPriceId) {
        throw new Error("Main price ID is missing");
      }
      console.log("Main price ID:", mainPriceId);

      const addons = selectedAddons.map(addon => {
        const priceId = addon.stripeIds[year ? "yearly" : "monthly"];
        if (!priceId) {
          throw new Error(`Price ID is missing for addon: ${addon.title}`);
        }
        console.log(`Addon ${addon.title} price ID:`, priceId);
        return {
          priceId,
          quantity: 1,
        };
      });

      console.log("Selected addons:", selectedAddons);
      console.log("Prepared addons for Stripe:", addons);

      const response = await generateUserStripe(mainPriceId, addons);
      
      if (response?.url) {
        window.location.href = response.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Error in generateUserStripeSession:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create checkout session");
    }
  };

  const stripeSessionAction = () =>
    startTransition(async () => await generateUserStripeSession());

  const userOffer =
    subscriptionPlan.stripePriceId ===
    offer.stripeIds[year ? "yearly" : "monthly"];

  return (
    <Button
      variant={userOffer ? "default" : "outline"}
      className={className}
      disabled={isPending}
      onClick={stripeSessionAction}
      size={size}
      {...props}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>{userOffer ? "Manage Subscription" : "Upgrade"}</>
      )}
    </Button>
  );
}

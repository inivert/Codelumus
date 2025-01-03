"use client";

import Link from "next/link";
import * as React from "react";
import { useSubscriptionPlan } from "@/hooks/use-subscription";
import { useSession } from "next-auth/react";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import { Zap } from "lucide-react";

import { CustomerPortalButton } from "@/components/forms/customer-portal-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";
import { cn } from "@/lib/utils";
import { pricingData, addOns } from "@/config/subscriptions";
import { UserSubscriptionPlan } from "@/types";
import { toast } from "sonner";

const defaultPlan = {
  ...pricingData[0],
  stripeCustomerId: "",
  stripePriceId: "",
  stripeSubscriptionId: "",
  stripeCurrentPeriodEnd: null,
  isPaid: false,
  isCanceled: false,
  activeAddons: [],
};

interface BillingInfoProps {
  initialData: UserSubscriptionPlan;
}

export function BillingInfo({ initialData }: BillingInfoProps) {
  const [plan, setPlan] = React.useState<UserSubscriptionPlan>(initialData || defaultPlan);
  const [isPending, startTransition] = React.useTransition();
  const { data: session } = useSession();

  // Update plan when subscription changes
  const { subscriptionPlan } = useSubscriptionPlan();
  React.useEffect(() => {
    if (subscriptionPlan) {
      setPlan(subscriptionPlan);
    }
  }, [subscriptionPlan]);

  const handleUpgrade = async () => {
    try {
      startTransition(async () => {
        const mainPriceId = pricingData[0].stripeIds.monthly; // Default to monthly
        const response = await generateUserStripe(mainPriceId, []);
        
        if (response?.url) {
          window.location.href = response.url;
        } else {
          throw new Error("No checkout URL received");
        }
      });
    } catch (error) {
      console.error("Error upgrading:", error);
      toast.error("Failed to start upgrade process");
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
            <CardDescription className="mt-2">
              {plan.description}
            </CardDescription>
          </div>
          <div className={cn(
            "rounded-full px-3 py-1 text-sm font-medium",
            plan.isPaid 
              ? plan.isCanceled 
                ? "bg-yellow-100 text-yellow-700" 
                : "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          )}>
            {plan.isPaid ? (plan.isCanceled ? "Canceled" : "Active") : "Free Plan"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {plan.isPaid ? (
          // Show subscription details for paid users
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {plan.isCanceled ? (
                <p>Your subscription will end on {new Date(plan.stripeCurrentPeriodEnd!).toLocaleDateString()}</p>
              ) : (
                <p>Next billing date: {new Date(plan.stripeCurrentPeriodEnd!).toLocaleDateString()}</p>
              )}
            </div>
            <CustomerPortalButton size="sm">
              {plan.isCanceled ? "Renew Subscription" : "Manage Plan"}
            </CustomerPortalButton>
          </div>
        ) : (
          // Show upgrade button for free users
          <div className="space-y-4 rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Upgrade to Starter Plan</h3>
              <p className="text-sm text-muted-foreground">
                Unlock all features and get unlimited access to our support team.
              </p>
            </div>
            <Button
              onClick={handleUpgrade}
              disabled={isPending}
              className="w-full"
              size="lg"
            >
              {isPending ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Loading...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" /> Upgrade to Starter Plan
                </>
              )}
            </Button>
          </div>
        )}

        {plan.activeAddons && plan.activeAddons.length > 0 && (
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Active Add-ons</h3>
            <div className="mt-4 space-y-4">
              {plan.activeAddons.map((addonId) => {
                const addon = addOns.find(a => a.id === addonId);
                if (!addon) return null;
                return (
                  <div key={addon.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{addon.title}</h4>
                      <span className="text-sm text-muted-foreground">
                        ${plan.interval === "month" ? addon.price.monthly : addon.price.yearly}/{plan.interval}ly
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{addon.description}</p>
                    <ul className="mt-2 grid gap-1">
                      {addon.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icons.check className="size-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

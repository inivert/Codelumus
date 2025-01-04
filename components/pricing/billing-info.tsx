"use client";

import Link from "next/link";
import * as React from "react";
import { useSubscriptionPlan } from "@/hooks/use-subscription";
import { useSession } from "next-auth/react";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import { Zap, Star } from "lucide-react";

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
import { AddonManager } from "@/components/pricing/addon-manager";

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
          <>
            {/* Base Plan Details */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Base Plan Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Billing Period</span>
                  <span className="font-medium capitalize">{plan.interval}ly</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Next Payment</span>
                  <span className="font-medium">
                    {new Date(plan.stripeCurrentPeriodEnd!).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    ${plan.interval === "month" ? plan.prices.monthly : plan.prices.yearly}/{plan.interval}ly
                  </span>
                </div>
              </div>
            </div>

            {/* Active Add-ons */}
            <AddonManager subscriptionPlan={plan} />

            {/* Total Cost */}
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Monthly Cost</span>
                <span className="text-xl font-bold">
                  ${plan.interval === "month" 
                    ? plan.prices.monthly + plan.activeAddons.reduce((sum, addonId) => {
                        const addon = addOns.find(a => a.id === addonId);
                        return sum + (addon?.price.monthly || 0);
                      }, 0)
                    : plan.prices.yearly + plan.activeAddons.reduce((sum, addonId) => {
                        const addon = addOns.find(a => a.id === addonId);
                        return sum + (addon?.price.yearly || 0);
                      }, 0)
                  }/{plan.interval}ly
                </span>
              </div>
            </div>

            {/* Manage Subscription Button */}
            <div className="mt-4">
              <CustomerPortalButton className="w-full" />
              <p className="mt-2 text-xs text-muted-foreground text-center">
                Manage your subscription in the Stripe Customer Portal
              </p>
            </div>
          </>
        ) : (
          // Show upgrade section for free users
          <div className="space-y-6">
            <div className="rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Upgrade to Starter Plan</h3>
                <p className="text-muted-foreground">
                  Unlock all features and get unlimited access to our support team.
                </p>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {plan.benefits.slice(0, 6).map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Icons.check className="h-5 w-5 text-primary" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleUpgrade}
                disabled={isPending}
                className="mt-6 w-full"
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

            <div className="rounded-lg border bg-muted/50 p-6">
              <h4 className="font-medium">Why Upgrade?</h4>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Professional website design and development</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-primary" />
                  <span>24/7 priority support and maintenance</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-primary" />
                  <span>SEO optimization and analytics integration</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

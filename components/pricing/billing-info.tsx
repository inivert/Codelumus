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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

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
            "rounded-full px-3.5 py-1 text-sm inline-flex items-center whitespace-nowrap",
            plan.isPaid 
              ? plan.isCanceled 
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400" 
                : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
              : "bg-white text-zinc-950 font-medium"
          )}>
            {plan.isPaid ? (plan.isCanceled ? "Canceled" : "Active") : "Free Plan"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">
        {/* Important Messages */}
        <div className="space-y-4">
          <Alert className="border-primary bg-primary/10">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="font-medium">Let's Discuss Your Website</AlertTitle>
            <AlertDescription className="mt-1">
              As your dedicated web developer, I'd love to discuss which add-ons would work best for your website. Let's work together to find the perfect solutions for your needs.
            </AlertDescription>
          </Alert>

          <Alert className="border-yellow-600 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="font-medium">Billing Information</AlertTitle>
            <AlertDescription className="mt-1">
              I believe in delivering value first. You'll only start your subscription after I've completed your website to your satisfaction. This ensures you get exactly what you're paying for.
            </AlertDescription>
          </Alert>
        </div>

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

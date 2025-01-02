"use client";

import Link from "next/link";
import * as React from "react";
import { useSubscriptionPlan } from "@/hooks/use-subscription";

import { CustomerPortalButton } from "@/components/forms/customer-portal-button";
import { buttonVariants } from "@/components/ui/button";
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
import { pricingData } from "@/config/subscriptions";
import { UserSubscriptionPlan } from "types";

const defaultPlan = {
  ...pricingData[0],
  stripeCustomerId: "",
  stripePriceId: "",
  stripeSubscriptionId: "",
  stripeCurrentPeriodEnd: null,
  isPaid: false,
  isCanceled: false,
};

interface BillingInfoProps {
  initialData: UserSubscriptionPlan;
}

export function BillingInfo({ initialData }: BillingInfoProps) {
  const [plan, setPlan] = React.useState<UserSubscriptionPlan>(initialData || defaultPlan);

  // Update plan when subscription changes
  const { subscriptionPlan } = useSubscriptionPlan();
  React.useEffect(() => {
    if (subscriptionPlan) {
      setPlan(subscriptionPlan);
    }
  }, [subscriptionPlan]);

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
      <CardContent className="flex-1">
        <div className="space-y-6">
          {plan.isPaid && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">Subscription Details</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Billing Period</span>
                  <span className="font-medium">
                    {plan.stripeCurrentPeriodEnd
                      ? new Date(plan.stripeCurrentPeriodEnd).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Plan Type</span>
                  <span className="font-medium">{plan.title}</span>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Features & Benefits</h3>
            <ul className="mt-4 grid gap-3">
              {plan.benefits.map((feature) => (
                <li key={feature} className="flex items-center gap-x-3 text-sm">
                  <Icons.check className="shrink-0 text-green-500 size-5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-6">
        {plan.isPaid && plan.stripeCustomerId ? (
          <div className="w-full">
            <CustomerPortalButton 
              userStripeId={plan.stripeCustomerId} 
              className="w-full"
            />
            <p className="mt-2.5 text-center text-sm text-muted-foreground">
              Manage your subscription in the Stripe Customer Portal
            </p>
          </div>
        ) : (
          <div className="w-full">
            <Link href="/pricing" className={cn(buttonVariants(), "w-full")}>
              Upgrade Plan
            </Link>
            <p className="mt-2.5 text-center text-sm text-muted-foreground">
              Upgrade to unlock all features
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

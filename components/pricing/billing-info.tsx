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
import { pricingData, addOns } from "@/config/subscriptions";
import { UserSubscriptionPlan } from "@/types";

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

  // Update plan when subscription changes
  const { subscriptionPlan } = useSubscriptionPlan();
  React.useEffect(() => {
    if (subscriptionPlan) {
      console.log("Subscription plan updated:", subscriptionPlan);
      console.log("Active addons:", subscriptionPlan.activeAddons);
      setPlan(subscriptionPlan);
    }
  }, [subscriptionPlan]);

  // Log when active addons section renders
  React.useEffect(() => {
    if (plan.activeAddons?.length) {
      console.log("Rendering active addons:", plan.activeAddons);
      console.log("Found addons:", plan.activeAddons.map(id => addOns.find(a => a.id === id)));
    }
  }, [plan.activeAddons]);

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
                {plan.interval && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Billing Interval</span>
                    <span className="font-medium capitalize">{plan.interval}ly</span>
                  </div>
                )}
              </div>
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

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Features & Benefits</h3>
            <ul className="mt-4 grid gap-3">
              {plan.benefits.map((feature) => (
                <li key={feature} className="flex items-center gap-x-3 text-sm">
                  <Icons.check className="size-5 shrink-0 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>

      {plan.isPaid && plan.stripeCustomerId && (
        <CardFooter>
          <CustomerPortalButton userStripeId={plan.stripeCustomerId} className="w-full" />
        </CardFooter>
      )}
    </Card>
  );
}

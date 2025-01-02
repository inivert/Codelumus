"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BillingFormButton } from "@/components/forms/billing-form-button";
import { CustomerPortalButton } from "@/components/forms/customer-portal-button";
import { useModal } from "@/components/providers/modal-provider";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { pricingData, addOns, specialDeals, includedFeatures } from "@/config/subscriptions";
import { useSubscriptionPlan } from "@/hooks/use-subscription";
import { Icons } from "@/components/shared/icons";

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "yearly", label: "Yearly", priceSuffix: "/year" },
];

interface PricingCardsProps {
  redirect?: string;
}

export function PricingCards({ redirect }: PricingCardsProps) {
  const [frequency, setFrequency] = useState<"monthly" | "yearly">("monthly");
  const { data: session } = useSession();
  const { setShowSignInModal } = useModal();
  const { subscriptionPlan, isLoading } = useSubscriptionPlan();
  const plan = pricingData[0];

  return (
    <MaxWidthWrapper className="mb-8 mt-24">
      <HeaderSection
        title="Simple, transparent pricing"
        description="Get started with our comprehensive starter plan"
      />

      <div className="mt-8 flex justify-center">
        <ToggleGroup
          type="single"
          value={frequency}
          onValueChange={(value) => {
            if (value) setFrequency(value as "monthly" | "yearly");
          }}
        >
          {frequencies.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="relative h-8 px-3 text-sm font-medium transition-all"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <Card className="ring-2 ring-primary rounded-3xl p-8 xl:p-10">
          <div className="flex items-center justify-between gap-x-4">
            <h3 className="text-2xl font-bold text-foreground">
              {plan.title}
            </h3>
          </div>
          <p className="mt-4 text-muted-foreground">
            {plan.description}
          </p>
          <p className="mt-6 flex items-baseline gap-x-1">
            <span className="text-5xl font-bold tracking-tight">
              ${frequency === "monthly" ? plan.prices.monthly : plan.prices.yearly}
            </span>
            <span className="text-sm font-semibold text-muted-foreground">
              {frequency === "monthly" ? "/month" : "/year"}
            </span>
          </p>
          {session ? (
            isLoading ? (
              <Button className="mt-6 w-full" disabled>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </Button>
            ) : subscriptionPlan?.isPaid ? (
              <CustomerPortalButton 
                userStripeId={subscriptionPlan.stripeCustomerId} 
                className="mt-6 w-full"
              />
            ) : (
              <BillingFormButton
                offer={plan}
                subscriptionPlan={{
                  ...plan,
                  stripePriceId: null,
                  stripeSubscriptionId: null,
                  stripeCustomerId: null,
                  stripeCurrentPeriodEnd: null,
                  isPaid: false,
                  interval: null,
                  isCanceled: false
                }}
                year={frequency === "yearly"}
              />
            )
          ) : (
            <Button
              onClick={() => setShowSignInModal(true)}
              className="mt-6 w-full"
              variant="default"
            >
              Get Started
            </Button>
          )}
          <ul className="mt-8 space-y-3">
            {plan.benefits.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <Check className="h-6 w-5 flex-none text-primary" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center mb-8">Add-Ons</h3>
        <div className="space-y-6 max-w-4xl mx-auto">
          {addOns.map((addon) => (
            <Card key={addon.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold mb-2">{addon.title}</h4>
                  <p className="text-muted-foreground mb-4">{addon.description}</p>
                  <ul className="space-y-2">
                    {addon.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <Check className="h-5 w-5 flex-none text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:w-64 flex flex-col items-center lg:items-start">
                  <div className="space-y-1 text-center lg:text-left mb-4 w-full">
                    <div className="flex items-baseline justify-center lg:justify-start gap-x-1">
                      <span className="text-3xl font-bold">
                        ${frequency === "monthly" ? addon.price.monthly : addon.price.yearly}
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">
                        /{frequency}
                      </span>
                    </div>
                    {frequency === "yearly" && (
                      <p className="text-sm text-muted-foreground">
                        ${addon.price.monthly} billed monthly
                      </p>
                    )}
                  </div>
                  <Button className="w-full" variant="outline">
                    Add to Plan
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center mb-8">Special Deals</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {specialDeals.map((deal, index) => (
            <Card key={index} className="p-6 text-center">
              <p className="font-semibold">{deal}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center mb-8">All Plans Include</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {includedFeatures.map((feature, index) => (
            <Card key={index} className="p-4 text-center">
              <Check className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="font-medium">{feature}</p>
            </Card>
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

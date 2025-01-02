"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Check, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BillingFormButton } from "@/components/forms/billing-form-button";
import { CustomerPortalButton } from "@/components/forms/customer-portal-button";
import { useModal } from "@/components/providers/modal-provider";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { pricingData, addOns } from "@/config/subscriptions";
import { specialDeals, includedFeatures } from "@/config/pricing-data";
import { useSubscriptionPlan } from "@/hooks/use-subscription";
import { Icons } from "@/components/shared/icons";
import { AddonSelector } from "@/components/pricing/addon-selector";
import { AddOn, UserSubscriptionPlan } from "@/types";

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "yearly", label: "Yearly", priceSuffix: "/year" },
];

interface PricingCardsProps {
  redirect?: string;
}

const AnimatedPrice = ({ value, className = "text-6xl" }: { value: number, className?: string }) => (
  <motion.span
    key={value}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
    className={`${className} font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80`}
  >
    ${value}
  </motion.span>
);

export function PricingCards({ redirect }: PricingCardsProps) {
  const [frequency, setFrequency] = useState<"monthly" | "yearly">("monthly");
  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>([]);
  const { data: session } = useSession();
  const { setShowSignInModal } = useModal();
  const { subscriptionPlan, isLoading: isLoadingSubscription } = useSubscriptionPlan();
  const plan = pricingData[0];

  const handleAddonSelect = (addon: AddOn) => {
    setSelectedAddons(current => {
      const isSelected = current.some(a => a.id === addon.id);
      if (isSelected) {
        return current.filter(a => a.id !== addon.id);
      } else {
        return [...current, addon];
      }
    });
  };

  const totalPrice = frequency === "monthly"
    ? plan.prices.monthly + selectedAddons.reduce((sum, addon) => sum + addon.price.monthly, 0)
    : plan.prices.yearly + selectedAddons.reduce((sum, addon) => sum + addon.price.yearly, 0);

  const dummyPlan: UserSubscriptionPlan = {
    ...plan,
    stripePriceId: null,
    stripeSubscriptionId: null,
    stripeCustomerId: null,
    stripeCurrentPeriodEnd: null,
    isPaid: false,
    interval: null,
    isCanceled: false
  };

  const renderActionButton = () => {
    if (!session) {
      return (
        <Button
          onClick={() => setShowSignInModal(true)}
          className="mt-8 w-full"
          size="lg"
        >
          Get Started
        </Button>
      );
    }

    if (isLoadingSubscription) {
      return (
        <Button className="mt-8 w-full" size="lg" disabled>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      );
    }

    if (subscriptionPlan?.isPaid) {
      return (
        <CustomerPortalButton 
          userStripeId={subscriptionPlan.stripeCustomerId || ''} 
          className="mt-8 w-full"
          size="lg"
        />
      );
    }

    return (
      <BillingFormButton
        offer={plan}
        subscriptionPlan={dummyPlan}
        year={frequency === "yearly"}
        selectedAddons={selectedAddons}
        className="mt-8 w-full"
        size="lg"
      />
    );
  };

  return (
    <MaxWidthWrapper className="mb-8 mt-24">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Get started with our comprehensive starter plan. No hidden fees.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <Card className="p-1">
          <ToggleGroup
            type="single"
            value={frequency}
            onValueChange={(value) => {
              if (value) setFrequency(value as "monthly" | "yearly");
            }}
            className="bg-muted/50"
          >
            {frequencies.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                className="relative h-9 px-6 text-sm font-medium transition-all data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Card>
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <Card className="relative overflow-hidden rounded-3xl border-2 border-primary/20 p-8 shadow-xl xl:p-12">
          <div className="relative">
            <div className="flex items-center justify-between gap-x-4">
              <h3 className="text-2xl font-bold text-foreground">
                {plan.title}
              </h3>
              {frequency === "yearly" && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                  Save 17%
                </span>
              )}
            </div>
            <p className="mt-4 text-muted-foreground text-lg">
              {plan.description}
            </p>
            <div className="mt-6 flex items-baseline gap-x-2">
              <AnimatePresence mode="wait">
                <AnimatedPrice value={totalPrice} />
              </AnimatePresence>
              <span className="text-xl font-medium text-muted-foreground">
                /{frequency}
              </span>
            </div>

            {renderActionButton()}

            <div className="mt-12 space-y-8">
              {specialDeals.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">Special Offers</h4>
                  <ul className="space-y-3">
                    {specialDeals.map((deal, idx) => (
                      <li key={idx} className="flex items-center gap-x-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{deal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4">What's included</h4>
                <ul className="space-y-3">
                  {plan.benefits.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-24">
        <AddonSelector
          addons={addOns}
          selectedAddons={selectedAddons}
          onSelect={handleAddonSelect}
          frequency={frequency}
        />
      </div>

      <div className="mt-24">
        <h3 className="text-xl font-semibold text-center mb-8">All Plans Include</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {includedFeatures.map((feature, index) => (
            <Card key={index} className="p-6 text-center bg-muted/50 border-none">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <p className="font-medium text-sm">{feature}</p>
            </Card>
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

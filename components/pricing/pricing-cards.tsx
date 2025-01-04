"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Check, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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

  // Debug logging
  console.log("Subscription state:", {
    isLoading: isLoadingSubscription,
    isPaid: subscriptionPlan?.isPaid,
    isCanceled: subscriptionPlan?.isCanceled,
    interval: subscriptionPlan?.interval,
    stripeSubscriptionId: subscriptionPlan?.stripeSubscriptionId,
    activeAddons: subscriptionPlan?.activeAddons
  });

  const handleAddonSelect = (addon: AddOn) => {
    if (!subscriptionPlan || !subscriptionPlan.isPaid || subscriptionPlan.isCanceled) {
      toast.error("You need an active subscription to add add-ons");
      return;
    }

    if (subscriptionPlan.activeAddons?.includes(addon.id)) {
      toast.error("You already have this add-on");
      return;
    }

    setSelectedAddons(current => {
      const isSelected = current.some(a => a.id === addon.id);
      if (isSelected) {
        return current.filter(a => a.id !== addon.id);
      } else {
        return [...current, addon];
      }
    });
  };

  const availableAddons = addOns.filter(
    addon => !subscriptionPlan?.activeAddons?.includes(addon.id)
  );

  const totalPrice = frequency === "monthly"
    ? (subscriptionPlan?.isPaid ? 0 : plan.prices.monthly) + 
      selectedAddons.reduce((sum, addon) => sum + addon.price.monthly, 0)
    : (subscriptionPlan?.isPaid ? 0 : plan.prices.yearly) + 
      selectedAddons.reduce((sum, addon) => sum + addon.price.yearly, 0);

  const dummyPlan: UserSubscriptionPlan = {
    ...plan,
    stripePriceId: "",
    stripeSubscriptionId: "",
    stripeCustomerId: "",
    stripeCurrentPeriodEnd: Date.now(),
    isPaid: false,
    interval: null,
    isCanceled: false,
    activeAddons: []
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

    if (subscriptionPlan?.isPaid && selectedAddons.length > 0) {
      return (
        <BillingFormButton
          offer={plan}
          subscriptionPlan={subscriptionPlan}
          year={frequency === "yearly"}
          selectedAddons={selectedAddons}
          className="mt-8 w-full"
          size="lg"
        />
      );
    }

    if (subscriptionPlan?.isPaid) {
      return (
        <CustomerPortalButton 
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
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8 flex justify-center">
        <ToggleGroup
          type="single"
          value={frequency}
          onValueChange={(value) => value && setFrequency(value as "monthly" | "yearly")}
        >
          {frequencies.map((freq) => (
            <ToggleGroupItem
              key={freq.value}
              value={freq.value}
              aria-label={`${freq.label} billing`}
              className="px-4"
            >
              {freq.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="grid gap-8">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {subscriptionPlan?.isPaid ? "Manage Your Plan" : "Simple, transparent pricing"}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {subscriptionPlan?.isPaid 
                ? "Manage your subscription and add-ons through our customer portal."
                : "Get started with our comprehensive starter plan. No hidden fees."
              }
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
                    {subscriptionPlan?.isPaid ? "Current Plan: " : ""}{plan.title}
                  </h3>
                  {frequency === "yearly" && !subscriptionPlan?.isPaid && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                      Save 17%
                    </span>
                  )}
                </div>
                <p className="mt-4 text-muted-foreground text-lg">
                  {plan.description}
                </p>
                {!subscriptionPlan?.isPaid && (
                  <div className="mt-6 flex items-baseline gap-x-2">
                    <AnimatePresence mode="wait">
                      <AnimatedPrice value={plan.prices[frequency === "yearly" ? "yearly" : "monthly"]} />
                    </AnimatePresence>
                    <span className="text-xl font-medium text-muted-foreground">
                      /{frequency}
                    </span>
                  </div>
                )}

                {renderActionButton()}

                {!subscriptionPlan?.isPaid && (
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
                )}
              </div>
            </Card>
          </div>
        </Card>

        {(subscriptionPlan?.isPaid || availableAddons.length > 0) && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Available Add-ons</h3>
            <AddonSelector
              addons={availableAddons}
              selectedAddons={selectedAddons}
              onSelect={handleAddonSelect}
              frequency={frequency}
            />
          </div>
        )}

        {(selectedAddons.length > 0 || !subscriptionPlan?.isPaid) && (
          <div className="mt-8 rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total</span>
              <div className="text-2xl font-bold">
                ${totalPrice}
                <span className="text-sm text-muted-foreground ml-1">
                  /{frequency}
                </span>
              </div>
            </div>
            {renderActionButton()}
          </div>
        )}
      </div>
    </div>
  );
}

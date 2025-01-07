"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { useSession } from "next-auth/react";
import { Check, Star, ShoppingCart, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";

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
import { AddOn, UserSubscriptionPlan } from "@/types";

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "yearly", label: "Yearly", priceSuffix: "/year" },
];

interface PricingCardsProps {
  redirect?: string;
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
}

// Dynamically import heavy components
const DynamicComparePlans = dynamic(() => import("@/components/pricing/compare-plans").then(mod => ({ default: mod.ComparePlans })), {
  ssr: false,
  loading: () => <div className="h-[200px]" /> // Placeholder height
});

const DynamicPricingFaq = dynamic(() => import("@/components/pricing/pricing-faq").then(mod => ({ default: mod.PricingFaq })), {
  ssr: false,
  loading: () => <div className="h-[200px]" />
});

// Memoize the AnimatedPrice component
const AnimatedPrice = memo(({ value, className = "text-6xl" }: { value: number, className?: string }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {inView && (
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
      )}
    </div>
  );
});
AnimatedPrice.displayName = "AnimatedPrice";

// Define defaultPlan
const defaultPlan: UserSubscriptionPlan = {
  title: pricingData[0].title,
  description: pricingData[0].description,
  benefits: pricingData[0].benefits,
  limitations: pricingData[0].limitations,
  prices: pricingData[0].prices,
  stripeIds: pricingData[0].stripeIds,
  stripePriceId: "",
  stripeSubscriptionId: "",
  stripeCustomerId: "",
  stripeCurrentPeriodEnd: Date.now(),
  isPaid: false,
  interval: null,
  isCanceled: false,
  activeAddons: []
};

// Optimize the PublicPricingView
const PublicPricingView = memo(({ 
  frequency, 
  setFrequency, 
  setShowSignInModal 
}: { 
  frequency: "monthly" | "yearly";
  setFrequency: (value: "monthly" | "yearly") => void;
  setShowSignInModal: () => void;
}) => {
  const plan = useMemo(() => pricingData[0], []);
  
  const handleFrequencyChange = useCallback((value: string) => {
    value && setFrequency(value as "monthly" | "yearly");
  }, [setFrequency]);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Get started with our comprehensive starter plan. No hidden fees.
        </p>
      </div>

      <div className="flex justify-center">
        <ToggleGroup
          type="single"
          value={frequency}
          onValueChange={handleFrequencyChange}
          className="bg-muted/50 p-1 rounded-lg"
        >
          {frequencies.map((freq) => (
            <ToggleGroupItem
              key={freq.value}
              value={freq.value}
              className="px-6 py-2 data-[state=on]:bg-background data-[state=on]:shadow"
            >
              {freq.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <Card className="mx-auto max-w-3xl overflow-hidden rounded-3xl border-2 border-primary/20 p-8 shadow-xl">
        <div className="flex items-center justify-between gap-x-4">
          <h3 className="text-2xl font-bold">{plan.title}</h3>
          {frequency === "yearly" && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
              Save 17%
            </span>
          )}
        </div>
        
        <p className="mt-4 text-lg text-muted-foreground">{plan.description}</p>
        
        <div className="mt-6 flex items-baseline gap-x-2">
          <AnimatePresence mode="wait">
            <AnimatedPrice value={frequency === "yearly" ? plan.prices.yearly : plan.prices.monthly} />
          </AnimatePresence>
          <span className="text-xl font-medium text-muted-foreground">/{frequency}</span>
        </div>

        <Button
          onClick={() => setShowSignInModal()}
          className="mt-8 w-full"
          size="lg"
        >
          Get Started
        </Button>

        <div className="mt-12 space-y-8">
          {specialDeals.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Special Offers</h4>
              <ul className="space-y-3">
                {specialDeals.map((deal, idx) => (
                  <li key={idx} className="flex items-center gap-x-3">
                    <Star className="h-4 w-4 text-primary" />
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
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <div className="mt-24">
        <h3 className="text-xl font-semibold text-center mb-8">All Plans Include</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {useMemo(() => 
            includedFeatures.map((feature, index) => (
              <Card key={index} className="p-6 text-center bg-muted/50 border-none">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium text-sm">{feature}</p>
              </Card>
            )),
            []
          )}
        </div>
      </div>
    </div>
  );
});
PublicPricingView.displayName = "PublicPricingView";

// Optimize the AuthenticatedPricingView similarly
const AuthenticatedPricingView = memo(({
  frequency,
  setFrequency,
  subscriptionPlan,
  selectedAddons,
  setSelectedAddons,
  isLoadingSubscription
}: {
  frequency: "monthly" | "yearly";
  setFrequency: (value: "monthly" | "yearly") => void;
  subscriptionPlan: UserSubscriptionPlan;
  selectedAddons: AddOn[];
  setSelectedAddons: React.Dispatch<React.SetStateAction<AddOn[]>>;
  isLoadingSubscription: boolean;
}) => {
  const handleFrequencyChange = useCallback((value: string) => {
    value && setFrequency(value as "monthly" | "yearly");
  }, [setFrequency]);

  const handleAddonSelect = useCallback((addon: AddOn) => {
    setSelectedAddons(current => {
      const isSelected = current.some(a => a.id === addon.id);
      if (isSelected) {
        return current.filter(a => a.id !== addon.id);
      } else {
        return [...current, addon];
      }
    });
  }, [setSelectedAddons]);

  const availableAddons = useMemo(() => 
    addOns.filter(addon => !subscriptionPlan.activeAddons?.includes(addon.id)),
    [subscriptionPlan.activeAddons]
  );

  const totalPrice = useMemo(() => 
    selectedAddons.reduce((sum, addon) => 
      sum + (frequency === "monthly" ? addon.price.monthly : addon.price.yearly), 0
    ),
    [selectedAddons, frequency]
  );

  if (isLoadingSubscription) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
        <div>
          <h2 className="font-semibold">Current Plan: {subscriptionPlan.title}</h2>
          <p className="text-sm text-muted-foreground">
            Status: {subscriptionPlan.isPaid ? "Active" : "Inactive"} 
            {subscriptionPlan.isPaid && ` (Next billing: ${new Date(subscriptionPlan.stripeCurrentPeriodEnd).toLocaleDateString()})`}
          </p>
          <p className="text-sm text-muted-foreground">
            Subscription ID: {subscriptionPlan.stripeSubscriptionId || "None"}
          </p>
        </div>
        <CustomerPortalButton className="w-auto">
          Manage Subscription
        </CustomerPortalButton>
      </div>

      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={frequency}
          onValueChange={handleFrequencyChange}
          className="bg-muted/50 p-1 rounded-lg"
        >
          {frequencies.map((freq) => (
            <ToggleGroupItem
              key={freq.value}
              value={freq.value}
              className="px-4 py-1 data-[state=on]:bg-background data-[state=on]:shadow"
            >
              {freq.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {!subscriptionPlan.isPaid && (
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold">Get Started with a Base Plan</h3>
              <p className="text-sm text-muted-foreground">
                Subscribe to our base plan to unlock powerful add-ons
              </p>
            </div>
            <BillingFormButton
              offer={pricingData[0]}
              subscriptionPlan={subscriptionPlan}
              year={frequency === "yearly"}
              selectedAddons={[]}
              size="lg"
            >
              Subscribe Now
            </BillingFormButton>
          </div>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableAddons.map((addon) => (
          <Card key={addon.id} className={cn(
            "relative overflow-hidden transition-all",
            selectedAddons.some(a => a.id === addon.id) && "ring-2 ring-primary"
          )}>
            <div className="p-6">
              <h3 className="text-xl font-semibold">{addon.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{addon.description}</p>
              <div className="mt-4 flex items-baseline gap-x-2">
                <span className="text-3xl font-bold">
                  ${frequency === "yearly" ? addon.price.yearly : addon.price.monthly}
                </span>
                <span className="text-sm text-muted-foreground">/{frequency}</span>
              </div>
              <Button
                onClick={() => handleAddonSelect(addon)}
                variant={selectedAddons.some(a => a.id === addon.id) ? "default" : "outline"}
                className="mt-4 w-full"
                // Remove the disabled state temporarily to debug button behavior
                // disabled={!subscriptionPlan.isPaid}
              >
                {selectedAddons.some(a => a.id === addon.id) ? (
                  <>
                    <Minus className="mr-2 h-4 w-4" />
                    Remove from Cart
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
            <div className="border-t bg-muted/50 px-6 py-4">
              <ul className="space-y-2">
                {addon.features.map((feature, idx) => (
                  <li key={idx} className="flex text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {selectedAddons.length > 0 && (
        <Card className="sticky bottom-4 p-6 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-primary/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Selected Add-ons: {selectedAddons.length}</div>
              <div className="text-2xl font-bold">
                Total: ${totalPrice}/{frequency}
              </div>
            </div>
            <BillingFormButton
              offer={pricingData[0]}
              subscriptionPlan={subscriptionPlan}
              year={frequency === "yearly"}
              selectedAddons={selectedAddons}
              className="min-w-[200px]"
              size="lg"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Proceed to Checkout
            </BillingFormButton>
          </div>
        </Card>
      )}
    </div>
  );
});
AuthenticatedPricingView.displayName = "AuthenticatedPricingView";

export function PricingCards({ redirect, userId, subscriptionPlan: initialSubscriptionPlan }: PricingCardsProps) {
  const [frequency, setFrequency] = useState<"monthly" | "yearly">("monthly");
  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>([]);
  const { data: session } = useSession();
  const { setShowSignInModal } = useModal();
  const { subscriptionPlan: fetchedPlan, isLoading: isLoadingSubscription } = useSubscriptionPlan();

  const subscriptionPlan = useMemo(() => {
    if (initialSubscriptionPlan) return initialSubscriptionPlan;
    if (!fetchedPlan) return defaultPlan;
    return {
      ...fetchedPlan,
      stripeCurrentPeriodEnd: fetchedPlan.stripeCurrentPeriodEnd || Date.now(),
      activeAddons: fetchedPlan.activeAddons || [],
      isPaid: Boolean(fetchedPlan.stripeSubscriptionId && !fetchedPlan.isCanceled)
    };
  }, [fetchedPlan, initialSubscriptionPlan]);

  if (session && isLoadingSubscription) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      {!session ? (
        <PublicPricingView 
          frequency={frequency}
          setFrequency={setFrequency}
          setShowSignInModal={() => setShowSignInModal(true)}
        />
      ) : (
        <AuthenticatedPricingView
          frequency={frequency}
          setFrequency={setFrequency}
          subscriptionPlan={subscriptionPlan}
          selectedAddons={selectedAddons}
          setSelectedAddons={setSelectedAddons}
          isLoadingSubscription={isLoadingSubscription}
        />
      )}

      {/* Dynamically load heavy components */}
      <DynamicComparePlans />
      <DynamicPricingFaq />
    </div>
  );
}

"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BillingFormButton } from "@/components/forms/billing-form-button";
import { useModal } from "@/components/providers/modal-provider";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "annually", label: "Annually", priceSuffix: "/year" },
];

const tiers = [
  {
    name: "Free",
    id: "free",
    href: "#",
    price: { monthly: 0, annually: 0 },
    description: "Get started with the basics",
    features: [
      "Up to 3 active projects",
      "Basic analytics",
      "48-hour support response time",
    ],
    mostPopular: false,
  },
  {
    name: "Pro",
    id: "pro",
    href: "#",
    price: { monthly: 15, annually: 144 },
    description: "For growing businesses",
    features: [
      "Everything in Free",
      "Unlimited active projects",
      "Advanced analytics",
      "24-hour support response time",
      "Custom reporting",
    ],
    mostPopular: true,
  },
  {
    name: "Enterprise",
    id: "enterprise",
    href: "#",
    price: { monthly: 39, annually: 420 },
    description: "For large-scale operations",
    features: [
      "Everything in Pro",
      "Priority support",
      "1-hour, dedicated support response time",
      "Custom integrations",
      "Custom training",
      "Audit logs",
    ],
    mostPopular: false,
  },
];

interface PricingCardsProps {
  redirect?: boolean;
}

export function PricingCards({ redirect }: PricingCardsProps) {
  const [frequency, setFrequency] = useState<"monthly" | "annually">("monthly");
  const { data: session } = useSession();
  const { setShowSignInModal } = useModal();

  return (
    <MaxWidthWrapper className="mb-8 mt-24 text-center">
      <HeaderSection
        title="Simple, transparent pricing"
        description="Unlock all features including unlimited projects and premium support"
      />

      <div className="mt-8">
        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            value={frequency}
            onValueChange={(value) => {
              if (value) setFrequency(value as "monthly" | "annually");
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

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={cn(
                tier.mostPopular
                  ? "ring-2 ring-primary"
                  : "ring-1 ring-ring",
                "rounded-3xl p-8 xl:p-10",
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className="text-lg font-semibold leading-8 text-foreground"
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  ${tier.price[frequency]}
                </span>
                <span className="text-sm font-semibold leading-6 text-muted-foreground">
                  {frequencies.find((f) => f.value === frequency)?.priceSuffix}
                </span>
              </p>
              {session ? (
                tier.id === "free" ? (
                  <Button
                    className="mt-6"
                    variant="default"
                    disabled
                    aria-describedby={tier.id}
                  >
                    Current Plan
                  </Button>
                ) : (
                  <BillingFormButton
                    className="mt-6"
                    variant="default"
                    planId={tier.id}
                  />
                )
              ) : (
                <Button
                  onClick={() => setShowSignInModal(true)}
                  className="mt-6"
                  variant="default"
                  aria-describedby={tier.id}
                >
                  Get Started
                </Button>
              )}
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className="h-6 w-5 flex-none text-primary"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

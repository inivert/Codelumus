"use client";

import { useTransition } from "react";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { pricingData } from "@/config/subscriptions";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useState } from "react";

export function UpgradeBanner() {
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(true);

  const handleUpgrade = async () => {
    try {
      startTransition(async () => {
        const mainPriceId = pricingData[0].stripeIds.monthly;
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

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden rounded-lg bg-background p-8">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Upgrade to Pro</h2>
        <p className="text-muted-foreground">
          Unlock all features and get unlimited access to our support team.
        </p>
      </div>
      
      <Button
        onClick={handleUpgrade}
        disabled={isPending}
        size="lg"
        className="mt-6 w-full bg-white text-black hover:bg-white/90"
      >
        {isPending ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Loading...
          </>
        ) : (
          "Upgrade"
        )}
      </Button>
    </div>
  );
} 
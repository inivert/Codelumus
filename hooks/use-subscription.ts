"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { UserSubscriptionPlan } from "@/types";
import { pricingData } from "@/config/subscriptions";

export function useSubscriptionPlan() {
  const { data: session, status } = useSession();

  const { data: subscriptionPlan, isLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      if (!session?.user?.email) {
        return pricingData[0]; // Return default plan if no session
      }

      try {
        const response = await fetch("/api/subscription", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error("Unauthorized - Session may have expired");
            return pricingData[0]; // Return default plan on auth error
          }
          throw new Error("Failed to fetch subscription");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching subscription:", error);
        return pricingData[0]; // Return default plan on error
      }
    },
    enabled: status === "authenticated" && !!session?.user?.email,
  });

  return {
    subscriptionPlan: subscriptionPlan || pricingData[0],
    isLoading: status === "loading" || isLoading,
  };
} 
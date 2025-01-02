"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getSubscription } from "@/actions/subscription";

export function useSubscriptionPlan() {
  const { data: session } = useSession();

  const { data: subscriptionPlan, isLoading } = useQuery({
    queryKey: ["subscription", session?.user?.id],
    queryFn: getSubscription,
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 1, // Only retry once if the request fails
  });

  return {
    subscriptionPlan,
    isLoading: isLoading && !!session?.user?.id
  };
} 
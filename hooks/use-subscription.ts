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
    staleTime: 1000 * 60, // Cache for 1 minute
    refetchInterval: 1000 * 60, // Refetch every minute
    refetchOnWindowFocus: true,
  });

  return {
    subscriptionPlan,
    isLoading: isLoading && !!session?.user?.id
  };
} 
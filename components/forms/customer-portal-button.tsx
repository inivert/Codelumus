"use client";

import { useTransition } from "react";
import { openCustomerPortal } from "@/actions/open-customer-portal";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { cn } from "@/lib/utils";

interface CustomerPortalButtonProps {
  userStripeId: string;
  className?: string;
  text?: string;
}

export function CustomerPortalButton({
  userStripeId,
  className,
  text = "Manage Subscription"
}: CustomerPortalButtonProps) {
  let [isPending, startTransition] = useTransition();
  const generateUserStripeSession = openCustomerPortal.bind(null, userStripeId);

  const stripeSessionAction = () =>
    startTransition(async () => await generateUserStripeSession());

  return (
    <Button 
      disabled={isPending} 
      onClick={stripeSessionAction}
      className={cn(className)}
    >
      {isPending ? (
        <Icons.spinner className="mr-2 size-4 animate-spin" />
      ) : null}
      {text}
    </Button>
  );
}

"use client";

import { useTransition } from "react";
import { generateUserStripe } from "@/actions/generate-user-stripe";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface CustomerPortalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  userStripeId: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function CustomerPortalButton({
  userStripeId,
  className,
  size,
  ...props
}: CustomerPortalButtonProps) {
  let [isPending, startTransition] = useTransition();

  const stripeSessionAction = () =>
    startTransition(async () => await generateUserStripe(userStripeId));

  return (
    <Button
      variant="default"
      className={className}
      disabled={isPending}
      onClick={stripeSessionAction}
      size={size}
      {...props}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        "Manage Subscription"
      )}
    </Button>
  );
}

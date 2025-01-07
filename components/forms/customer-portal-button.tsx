"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { toast } from "sonner";

interface CustomerPortalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "default" | "sm" | "lg" | "icon";
  userStripeId?: string | null;
}

export function CustomerPortalButton({
  className,
  size,
  children,
  userStripeId,
  ...props
}: CustomerPortalButtonProps) {
  let [isPending, startTransition] = useTransition();

  const handlePortalAccess = async () => {
    try {
      startTransition(async () => {
        const response = await fetch("/api/stripe/portal", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerId: userStripeId }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to access customer portal");
        }

        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error("No portal URL received");
        }
      });
    } catch (error) {
      console.error("Error accessing portal:", error);
      toast.error("Failed to access customer portal");
    }
  };

  return (
    <Button
      variant="default"
      className={className}
      disabled={isPending}
      onClick={handlePortalAccess}
      size={size}
      {...props}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        children || "Manage Subscription"
      )}
    </Button>
  );
}

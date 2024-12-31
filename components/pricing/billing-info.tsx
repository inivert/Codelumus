import Link from "next/link";
import * as React from "react";

import { CustomerPortalButton } from "@/components/forms/customer-portal-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";
import { cn } from "@/lib/utils";
import { UserSubscriptionPlan } from "types";

interface BillingInfoProps extends React.HTMLAttributes<HTMLFormElement> {
  userSubscriptionPlan: UserSubscriptionPlan;
}

export function BillingInfo({ userSubscriptionPlan }: BillingInfoProps) {
  const {
    title,
    description,
    benefits,
    stripeCustomerId,
    isPaid,
    isCanceled,
  } = userSubscriptionPlan;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Features</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {benefits.map((feature) => (
            <li key={feature} className="flex items-center gap-x-2 text-sm">
              <Icons.check className="size-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
        {isPaid ? (
          <div className="flex flex-col gap-2">
            <CustomerPortalButton userStripeId={stripeCustomerId} />
            <p className="text-xs text-muted-foreground">
              Manage your subscription in the Stripe Customer Portal
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link href="/pricing" className={cn(buttonVariants())}>
              Upgrade Plan
            </Link>
            <p className="text-xs text-muted-foreground">
              Upgrade to unlock all features
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

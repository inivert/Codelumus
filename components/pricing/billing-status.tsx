"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useSubscriptionPlan } from "@/hooks/use-subscription";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { CustomerPortalButton } from "@/components/forms/customer-portal-button";

export function BillingStatus() {
  const { subscriptionPlan, isLoading } = useSubscriptionPlan();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>Your current plan and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" disabled>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionPlan) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
        <CardDescription>Your current plan and status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Plan</span>
          <span className="font-medium">{subscriptionPlan.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Status</span>
          <span className={`font-medium ${subscriptionPlan.isPaid ? "text-green-600" : "text-yellow-600"}`}>
            {subscriptionPlan.isPaid ? "Active" : "Free Plan"}
          </span>
        </div>
        {subscriptionPlan.isPaid && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Billing Period</span>
              <span className="font-medium capitalize">{subscriptionPlan.interval}ly</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Next Payment</span>
              <span className="font-medium">
                {formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}
              </span>
            </div>
            {subscriptionPlan.isCanceled && (
              <div className="mt-2 rounded-md bg-destructive/10 p-4">
                <p className="text-sm font-medium text-destructive">
                  Your subscription will end on {formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}
                </p>
              </div>
            )}
            <div className="mt-4">
              <CustomerPortalButton userStripeId={subscriptionPlan.stripeCustomerId} />
              <p className="mt-2 text-xs text-muted-foreground">
                Manage your subscription in the Stripe Customer Portal
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 
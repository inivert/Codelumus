import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardHeader } from "@/components/dashboard/header";
import { BillingInfo } from "@/components/pricing/billing-info";
import { Icons } from "@/components/shared/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Billing – Dashboard",
  description: "Manage your subscription and billing details.",
});

export default async function BillingPage() {
  const user = await getCurrentUser();

  if (!user || !user.id || user.role !== "USER") {
    redirect("/login");
  }

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader
        heading="Billing"
        text="Manage your subscription and billing details."
      />

      <Alert className="!pl-14">
        <Icons.warning />
        <AlertTitle>This is a demo app.</AlertTitle>
        <AlertDescription>
          You can test the subscriptions with{" "}
          <a
            href="https://stripe.com/docs/testing#cards"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Stripe test cards
          </a>
          . You won&apos;t be charged.
        </AlertDescription>
      </Alert>

      <div className="grid gap-8 md:grid-cols-2">
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
              </>
            )}
          </CardContent>
        </Card>

        <BillingInfo userSubscriptionPlan={subscriptionPlan} />
      </div>
    </div>
  );
}

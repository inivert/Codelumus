import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { BillingInfo } from "@/components/pricing/billing-info";

export const metadata = constructMetadata({
  title: "Billing – Dashboard",
  description: "Manage your subscription and billing details.",
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BillingPage() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    redirect("/error?error=not_registered");
  }

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader
        heading="Billing"
        text="Manage your subscription and billing details."
      />

      <div className="grid gap-8 md:grid-cols-2">
        <BillingInfo initialData={subscriptionPlan} />
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { getCurrentUser } from "@/lib/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsButton } from "@/components/analytics/analytics-button";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        heading="Analytics"
        text="Monitor your website performance and user engagement"
      />
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Website Analytics</CardTitle>
            <CardDescription>
              View detailed analytics for your website including traffic, user behavior, and engagement metrics.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-6">
            <AnalyticsButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
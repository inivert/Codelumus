import { redirect } from "next/navigation";
import { BarChart } from "lucide-react";

import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { getCurrentUser } from "@/lib/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshButton } from "@/components/analytics/refresh-button";
import { UmamiModal } from "@/components/modals/umami-modal";
import { prisma } from "@/lib/db";

export const metadata = constructMetadata({
  title: "Website Analytics",
  description: "Monitor your website performance and user engagement",
});

export default async function UserAnalyticsPage() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/login");
    }

    // Get user's Umami URL from the database
    const analytics = await prisma.userAnalytics.findUnique({
      where: {
        userId: user.id
      },
      select: {
        umamiUrl: true
      }
    });

    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader
          heading="Website Analytics"
          text="Monitor your website performance and user engagement"
        />
        <div className="flex-1 p-4 md:p-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>
                    {analytics ? "View your website analytics" : "Analytics setup in progress"}
                  </CardDescription>
                </div>
                <BarChart className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {analytics ? (
                <div className="flex justify-center">
                  <UmamiModal analyticsUrl={analytics.umamiUrl} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Alert className="max-w-lg">
                    <AlertTitle>Analytics Setup Required</AlertTitle>
                    <AlertDescription>
                      Your analytics dashboard is being configured by an administrator. Once ready, you&apos;ll have access to detailed metrics and insights.
                    </AlertDescription>
                  </Alert>
                  <RefreshButton>
                    Check Availability
                  </RefreshButton>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in analytics page:", error);
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader
          heading="Website Analytics"
          text="Monitor your website performance and user engagement"
        />
        <div className="flex-1 p-4 md:p-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : "Error loading analytics. Please try again later."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
} 
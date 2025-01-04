import { redirect } from "next/navigation";
import { BarChart } from "lucide-react";

import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { getCurrentUser } from "@/lib/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { RefreshButton } from "@/components/analytics/refresh-button";
import { AnalyticsButton } from "@/components/analytics/analytics-button";
import { prisma } from "@/lib/db";
import { Info } from "lucide-react";

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

    // Get user's analytics data from the database
    const analytics = await prisma.userAnalytics.findUnique({
      where: {
        userId: user.id
      }
    });

    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader
          heading="Website Analytics"
          text="Monitor your website performance and user engagement"
        />
        <div className="flex-1 p-4 md:p-8 space-y-6">
          {/* Important Messages */}
          <div className="max-w-2xl mx-auto space-y-4">
            <Alert className="border-primary bg-primary/10">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle className="font-medium">Website Add-ons</AlertTitle>
              <AlertDescription className="mt-1">
                Want to enhance your website with additional features? Please reach out to discuss which add-ons would best suit your needs. We'll help you make the right choice for your business.
              </AlertDescription>
            </Alert>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>
                    View detailed analytics for your website including traffic, user behavior, and engagement metrics.
                  </CardDescription>
                </div>
                <BarChart className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-6">
              <AnalyticsButton analyticsUrl={analytics?.umamiUrl} />
            </CardContent>
          </Card>

          {/* Progress bar card underneath */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-sm">Website Development Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.progress === 100 ? (
                <div className="space-y-4">
                  <Alert className="bg-green-500/15 border-green-500/30">
                    <AlertTitle className="text-green-500">Congratulations! 🎉</AlertTitle>
                    <AlertDescription className="text-green-500/90">
                      Your website is now complete and ready to go! You can now start monitoring your website analytics.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Development Complete</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <AlertTitle>Website Under Development</AlertTitle>
                    <AlertDescription>
                      Our team is working on your website. You can track the progress here. Once complete, you'll have access to your website analytics.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Development Progress</span>
                      <span>{analytics?.progress || 0}%</span>
                    </div>
                    <Progress value={analytics?.progress || 0} className="h-2" />
                  </div>
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
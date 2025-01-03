import { redirect } from "next/navigation";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { getCurrentUser } from "@/lib/session";
import { UmamiModal } from "@/components/modals/umami-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { WebsiteForm } from "@/components/forms/website-form";
import { prisma } from "@/lib/db";

export const metadata = constructMetadata({
  title: "Analytics",
  description: "Website analytics and user statistics",
});

export default async function AnalyticsPage() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      redirect("/dashboard");
    }

    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader
          heading="Analytics"
          text="Monitor website traffic and user engagement"
        />
        <div className="flex-1 space-y-4 p-4 md:p-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle>Website Analytics</CardTitle>
                  <CardDescription>
                    Track page views, visitors, and engagement metrics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <UmamiModal />
                  <p className="text-sm text-muted-foreground">
                    View your website analytics in a beautiful dashboard
                  </p>
                </div>

                <div className="border-t pt-8">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Website Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Coming soon: View your websites survey results.
                    </p>
                  </div>
                </div>
              </div>
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
          heading="Analytics"
          text="Monitor website traffic and user engagement"
        />
        <div className="flex-1 space-y-4 p-4 md:p-8">
          <Card>
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
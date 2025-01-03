import { redirect } from "next/navigation";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { getCurrentUser } from "@/lib/session";
import { UmamiModal } from "@/components/modals/umami-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export const metadata = constructMetadata({
  title: "Analytics",
  description: "Monitor website traffic and user engagement",
});

export default async function AnalyticsPage() {
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
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                View detailed analytics for your website including page views, unique visitors,
                bounce rates, and more.
              </p>
              <UmamiModal />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

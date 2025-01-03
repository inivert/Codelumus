import { redirect } from "next/navigation";
import { BarChart, LineChart, Activity, Users } from "lucide-react";

import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { getCurrentUser } from "@/lib/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = constructMetadata({
  title: "Analytics",
  description: "Monitor your website performance and user engagement",
});

export default async function AnalyticsPage() {
  try {
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
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0m</div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Analytics Section */}
          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Analytics Overview</CardTitle>
                  <CardDescription>
                    Detailed view of your website performance
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Download Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="traffic" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="traffic">Traffic</TabsTrigger>
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                  <TabsTrigger value="sources">Sources</TabsTrigger>
                  <TabsTrigger value="pages">Pages</TabsTrigger>
                </TabsList>
                <TabsContent value="traffic" className="space-y-4">
                  <div className="h-[300px] w-full border rounded-lg bg-muted/10 flex items-center justify-center">
                    <p className="text-muted-foreground">Traffic chart will be displayed here</p>
                  </div>
                </TabsContent>
                <TabsContent value="engagement" className="space-y-4">
                  <div className="h-[300px] w-full border rounded-lg bg-muted/10 flex items-center justify-center">
                    <p className="text-muted-foreground">Engagement metrics will be displayed here</p>
                  </div>
                </TabsContent>
                <TabsContent value="sources" className="space-y-4">
                  <div className="h-[300px] w-full border rounded-lg bg-muted/10 flex items-center justify-center">
                    <p className="text-muted-foreground">Traffic sources will be displayed here</p>
                  </div>
                </TabsContent>
                <TabsContent value="pages" className="space-y-4">
                  <div className="h-[300px] w-full border rounded-lg bg-muted/10 flex items-center justify-center">
                    <p className="text-muted-foreground">Top pages will be displayed here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Additional Analytics Features */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Visitors</CardTitle>
                <CardDescription>
                  Current active users on your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full border rounded-lg bg-muted/10 flex items-center justify-center">
                  <p className="text-muted-foreground">Real-time data will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Flow</CardTitle>
                <CardDescription>
                  How users navigate through your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full border rounded-lg bg-muted/10 flex items-center justify-center">
                  <p className="text-muted-foreground">User flow diagram will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Conversion Goals</CardTitle>
                <CardDescription>
                  Track your website conversion metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full border rounded-lg bg-muted/10 flex items-center justify-center">
                  <p className="text-muted-foreground">Conversion metrics will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in analytics page:", error);
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader
          heading="Analytics"
          text="Monitor your website performance and user engagement"
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
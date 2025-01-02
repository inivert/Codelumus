import { redirect } from "next/navigation";
import { constructMetadata } from "@/lib/utils";
import { InteractiveBarChart } from "@/components/charts/interactive-bar-chart";
import { UserStatsChart } from "@/components/charts/user-stats-chart";
import { DashboardHeader } from "@/components/dashboard/header";
import { getUserStats } from "@/lib/admin";
import { getCurrentUser } from "@/lib/session";

export const metadata = constructMetadata({
  title: "Charts Dashboard",
  description: "Analytics and statistics",
});

export default async function ChartsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const userStats = await getUserStats();

  return (
    <>
      <DashboardHeader
        heading="Charts Dashboard"
        text="Analytics and statistics"
      />
      <div className="flex flex-col gap-6">
        <UserStatsChart data={userStats} />
        <InteractiveBarChart />
      </div>
    </>
  );
}

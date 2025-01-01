import { constructMetadata } from "@/lib/utils";
import { InteractiveBarChart } from "@/components/charts/interactive-bar-chart";
import { UserStatsChart } from "@/components/charts/user-stats-chart";
import { DashboardHeader } from "@/components/dashboard/header";
import { getUserStats } from "@/lib/admin";

export const metadata = constructMetadata({
  title: "Charts Dashboard",
  description: "Analytics and statistics",
});

export default async function ChartsPage() {
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

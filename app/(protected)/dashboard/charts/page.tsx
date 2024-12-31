import { constructMetadata } from "@/lib/utils";
import { InteractiveBarChart } from "@/components/charts/interactive-bar-chart";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata = constructMetadata({
  title: "Visitors Chart",
  description: "Total visitors for the last 3 months",
});

export default function ChartsPage() {
  return (
    <>
      <DashboardHeader
        heading="Visitors Chart"
        text="Total visitors for the last 3 months"
      />
      <div className="flex flex-col">
        <InteractiveBarChart />
      </div>
    </>
  );
}

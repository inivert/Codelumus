import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function AnalyticsLoading() {
  return (
    <>
      <DashboardHeader heading="Analytics" text="Monitor website traffic and user engagement" />
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-[400px] w-full max-w-4xl" />
        </div>
      </div>
    </>
  );
}

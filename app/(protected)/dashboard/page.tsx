import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({
  title: "Codelumus Dashboard",
  description: "Manage your Codelumus account and content.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to Codelumus"
      />
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="post" />
        <EmptyPlaceholder.Title>Welcome to Codelumus</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Your central hub for managing your Codelumus experience.
        </EmptyPlaceholder.Description>
        <Button>Get Started</Button>
      </EmptyPlaceholder>
    </>
  );
}

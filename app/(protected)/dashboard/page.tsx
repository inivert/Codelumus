import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { SetupProfileModal } from "@/components/modals/setup-profile-modal";

export const metadata = constructMetadata({
  title: "Codelumus Dashboard",
  description: "Manage your Codelumus account and content.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  // Debug log
  console.log("Dashboard user data:", {
    id: user?.id,
    name: user?.name,
    website: user?.website,
  });

  // Fetch fresh data directly from database
  const dbUser = user ? await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      website: true,
    }
  }) : null;

  // Debug log
  console.log("Fresh DB user data:", dbUser);

  const updates = await (prisma as any).adminUpdate.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      createdBy: {
        select: {
          name: true,
        },
      },
    },
    take: 5, // Only show the 5 most recent updates
  });

  return (
    <div className="container space-y-8">
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to Codelumus"
      />
      {user && <SetupProfileModal name={dbUser?.name} website={dbUser?.website} />}
      <div className="grid gap-4">
        {updates.length > 0 ? (
          updates.map((update) => (
            <Card key={update.id}>
              <CardHeader>
                <CardTitle>{update.title}</CardTitle>
                <CardDescription>
                  Posted by {update.createdBy.name || 'Admin'} on {new Date(update.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{update.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Codelumus</CardTitle>
              <CardDescription>
                Your central hub for managing your Codelumus experience.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}

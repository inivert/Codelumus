import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsUrlForm } from "@/components/analytics/analytics-url-form";

export default async function UserAnalyticsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    include: {
      analytics: true,
    },
  });

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Analytics Management</h1>
        <p className="text-muted-foreground">
          Manage analytics URLs for each user
        </p>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsUrlForm 
                userId={user.id}
                defaultValue={user.analytics?.umamiUrl}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
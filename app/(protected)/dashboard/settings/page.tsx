import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { constructMetadata } from "lib/utils";
import { DeleteAccountSection } from "components/dashboard/delete-account";
import { DashboardHeader } from "components/dashboard/header";
import { UserNameForm } from "components/forms/user-name-form";
import { WebsiteForm } from "components/forms/website-form";
import { prisma } from "lib/db";

export const metadata = constructMetadata({
  title: "Settings",
  description: "Configure your account and website settings.",
});

export default async function SettingsPage() {
  let errorMessage = "";
  
  try {
    const session = await auth();
    console.log("Session data:", JSON.stringify(session, null, 2));
    
    if (!session?.user) {
      redirect("/auth/signin");
    }

    const userId = session.user.id;
    console.log("User ID:", userId);
    
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        name: true,
        website: true 
      },
    });
    console.log("Database user:", JSON.stringify(dbUser, null, 2));

    if (!dbUser) {
      errorMessage = "User not found in database. Please try logging in again.";
      throw new Error(errorMessage);
    }

    return (
      <>
        <DashboardHeader
          heading="Settings"
          text="Manage account and website settings."
        />
        <div className="divide-y divide-muted pb-10">
          <UserNameForm user={{ id: dbUser.id, name: dbUser.name || "" }} />
          <WebsiteForm user={{ id: dbUser.id, website: dbUser.website }} />
          <DeleteAccountSection />
        </div>
      </>
    );
  } catch (error) {
    console.error("Settings page error details:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return (
      <>
        <DashboardHeader
          heading="Settings"
          text="Manage account and website settings."
        />
        <div className="divide-y divide-muted pb-10">
          <p className="p-4 text-destructive">
            {errorMessage || "Error loading settings. Please try logging out and back in."}
          </p>
        </div>
      </>
    );
  }
}

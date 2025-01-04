import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import UpdatesForm from "./updates-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UpdatesPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  // Get all users for targeting
  const users = await prisma.user.findMany({
    where: {
      role: {
        not: "ADMIN"
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const updates = await prisma.adminUpdate.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      createdBy: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  return <UpdatesForm users={users} updates={updates} />;
} 
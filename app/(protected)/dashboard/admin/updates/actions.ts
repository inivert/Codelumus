"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function createUpdate(title: string, content: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    if (session.user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }

    const update = await prisma.adminUpdate.create({
      data: {
        title,
        content,
        userId: session.user.id,
      },
    });

    return update;
  } catch (error) {
    console.error("Error creating update:", error);
    throw error;
  }
}

export async function deleteUpdate(id: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    if (session.user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }

    await prisma.adminUpdate.delete({
      where: {
        id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting update:", error);
    throw error;
  }
}

export async function getUpdates() {
  try {
    const updates = await prisma.adminUpdate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return updates;
  } catch (error) {
    console.error("Error fetching updates:", error);
    throw error;
  }
} 
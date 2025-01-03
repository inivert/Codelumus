import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== UserRole.ADMIN) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { userId, umamiUrl } = await req.json();

    if (!userId || !umamiUrl) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await prisma.userAnalytics.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        umamiUrl,
      },
      update: {
        umamiUrl,
      },
    });

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("[ANALYTICS_URL_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
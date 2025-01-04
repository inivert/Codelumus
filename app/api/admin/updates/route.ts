import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { title, content } = await req.json();

    if (!title || !content) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const update = await prisma.adminUpdate.create({
      data: {
        title,
        content,
        userId: user.id,
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

    return NextResponse.json(update);
  } catch (error) {
    console.error("[ADMIN_UPDATES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const updates = await prisma.adminUpdate.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          }
        }
      },
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error("[ADMIN_UPDATES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
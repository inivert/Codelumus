import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

const progressSchema = z.object({
  userId: z.string(),
  progress: z.number().min(0).max(100),
});

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    console.log("[Auth] Current admin user:", {
      id: user?.id,
      role: user?.role,
      email: user?.email
    });

    if (!user || user.role !== "ADMIN") {
      console.log("[Auth] Failed:", { userId: user?.id, role: user?.role });
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const json = await req.json();
    console.log("[Request] Received data:", json);

    const body = progressSchema.parse(json);
    console.log("[Validation] Parsed body:", body);

    // First check if the user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: body.userId },
      select: {
        id: true,
        email: true,
        analytics: {
          select: {
            id: true,
            progress: true,
            umamiUrl: true
          }
        }
      }
    });

    console.log("[Database] Found target user:", {
      userId: targetUser?.id,
      email: targetUser?.email,
      hasAnalytics: !!targetUser?.analytics,
      currentProgress: targetUser?.analytics?.progress,
      analyticsId: targetUser?.analytics?.id
    });

    if (!targetUser) {
      console.log("[Error] User not found:", body.userId);
      return new NextResponse(
        JSON.stringify({ error: "User not found" }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    try {
      let result;
      
      if (targetUser.analytics) {
        console.log("[Database] Updating analytics for user:", {
          userId: targetUser.id,
          email: targetUser.email,
          currentProgress: targetUser.analytics.progress,
          newProgress: body.progress
        });

        result = await prisma.userAnalytics.update({
          where: { userId: targetUser.id },
          data: { progress: body.progress },
          select: {
            id: true,
            progress: true,
            umamiUrl: true,
            userId: true
          }
        });
      } else {
        console.log("[Database] Creating analytics for user:", {
          userId: targetUser.id,
          email: targetUser.email,
          progress: body.progress
        });

        result = await prisma.userAnalytics.create({
          data: {
            userId: targetUser.id,
            umamiUrl: "pending",
            progress: body.progress
          },
          select: {
            id: true,
            progress: true,
            umamiUrl: true,
            userId: true
          }
        });
      }

      console.log("[Success] Operation completed:", {
        userId: result.userId,
        progress: result.progress,
        analyticsId: result.id
      });

      return new NextResponse(
        JSON.stringify(result),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (dbError) {
      console.error("[Database Error] Operation failed:", {
        error: dbError,
        message: dbError instanceof Error ? dbError.message : String(dbError),
        userId: targetUser.id,
        operation: targetUser.analytics ? 'update' : 'create'
      });

      return new NextResponse(
        JSON.stringify({ 
          error: "Database operation failed", 
          details: dbError instanceof Error ? dbError.message : "Unknown database error",
          userId: targetUser.id
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error("[System Error] Unexpected error:", {
      error,
      message: error instanceof Error ? error.message : String(error)
    });
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error", 
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 
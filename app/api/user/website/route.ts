import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "auth";
import { prisma } from "lib/db";

const websiteSchema = z.object({
  website: z.string().max(191, "Website name is too long").optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await request.json();
    const body = websiteSchema.parse(json);

    const data: { [key: string]: string | null } = {};
    data.website = body.website || null;

    await prisma.user.update({
      where: { id: userId },
      data,
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error updating website:", error);
    return new Response("Failed to update website", { status: 500 });
  }
}

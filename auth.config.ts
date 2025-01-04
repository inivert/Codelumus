import type { NextAuthConfig } from "next-auth";
import type { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/db";
import { env } from "@/env.mjs";

type UserRole = "ADMIN" | "USER";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      id: string;
      website?: string | null;
    } & DefaultSession["user"];
  }
}

export default {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (token.website && session.user) {
        session.user.website = token.website as string;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const dbUser = await prisma.user.findUnique({
        where: { id: token.sub },
        select: {
          id: true,
          role: true,
          website: true,
        },
      });

      if (!dbUser) return token;

      token.role = dbUser.role;
      token.website = dbUser.website;

      return token;
    },
  },
} satisfies NextAuthConfig;

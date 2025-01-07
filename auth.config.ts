import type { NextAuthConfig } from "next-auth";
import type { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
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
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // Check if user exists in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toString() },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            website: true,
          }
        });

        // If user exists, return the user
        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            website: user.website
          };
        }

        // If user doesn't exist but has a pending invitation, create the user
        const invitation = await prisma.invitation.findFirst({
          where: {
            email: credentials.email.toString(),
            status: "PENDING"
          }
        });

        if (invitation) {
          // Create new user
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email.toString(),
              role: "USER",
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              website: true,
            }
          });

          // Update invitation status
          await prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: "ACCEPTED" }
          });

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            website: newUser.website
          };
        }

        return null;
      }
    })
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

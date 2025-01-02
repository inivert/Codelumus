import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "email",
      credentials: {
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // Check if user exists in users table or has a pending invitation
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        const invitation = await prisma.invitation.findFirst({
          where: {
            email: credentials.email,
            status: "PENDING"
          }
        });

        if (!user && !invitation) return null;

        // If user exists, return their data
        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image
          };
        }

        // If only invitation exists, create a new user
        if (invitation) {
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split("@")[0]
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
            image: newUser.image
          };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/error",
  },
} satisfies NextAuthConfig;

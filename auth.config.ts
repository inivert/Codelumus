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

        // Check if user exists in users table
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        // If user exists, return their data
        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image
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

import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

import { prisma } from "@/lib/db";
import { getUserById } from "@/lib/user";

// More info: https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      id: string;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) return false;

        // If signing in with Google, update the user's image
        if (account?.provider === "google" && profile?.picture) {
          await prisma.user.update({
            where: { email: user.email },
            data: { 
              image: profile.picture,
              name: profile.name || user.name
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async session({ token, session }) {
      try {
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }
        if (token.role && session.user) {
          session.user.role = token.role as UserRole;
        }
        // Ensure image is always up to date
        if (token.picture && session.user) {
          session.user.image = token.picture as string;
        }
        return session;
      } catch (error) {
        console.error("Session error:", error);
        return session;
      }
    },
    async jwt({ token, user, account, profile }) {
      try {
        if (!token.sub) return token;

        const dbUser = await getUserById(token.sub);
        if (!dbUser) return token;

        token.role = dbUser.role;
        // Update picture if available
        if (dbUser.image) {
          token.picture = dbUser.image;
        }
        return token;
      } catch (error) {
        console.error("JWT error:", error);
        return token;
      }
    }
  },
  events: {
    async signIn(message) {
      console.log("Sign in success:", message);
    },
    async signOut(message) {
      console.log("Sign out:", message);
    }
  },
  ...authConfig,
  debug: true,
});

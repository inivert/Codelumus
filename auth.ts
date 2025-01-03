import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import { env } from "@/env.mjs";

import { prisma } from "@/lib/db";
import { getUserById } from "@/lib/user";

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
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: env.AUTH_SECRET,
  debug: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          console.log("Sign-in rejected: No email provided");
          return false;
        }

        // Check if user exists in database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true }
        }).catch(err => {
          console.error("Database query error:", err);
          return null;
        });

        // Check for pending invitation
        const pendingInvitation = await prisma.invitation.findFirst({
          where: {
            email: user.email,
            status: "PENDING"
          }
        });

        // Only allow sign in if user exists in database OR has a pending invitation
        if (!existingUser && !pendingInvitation) {
          console.log("Sign-in rejected: User not in allowed users list and no pending invitation");
          return false;
        }

        // If signing in with Google and user exists
        if (account?.provider === "google") {
          try {
            // If user doesn't exist but has invitation, create the user
            if (!existingUser && pendingInvitation) {
              const newUser = await prisma.user.create({
                data: {
                  email: user.email,
                  name: profile?.name || user.name,
                  image: profile?.picture,
                  role: "USER"
                }
              });
              console.log("Created new user from invitation:", newUser);
            }

            // If user exists, check if Google account is already linked
            if (existingUser) {
              const hasGoogleAccount = existingUser.accounts.some(
                acc => acc.provider === "google"
              );

              if (!hasGoogleAccount) {
                // Link Google account to existing user
                await prisma.account.create({
                  data: {
                    userId: existingUser.id,
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    expires_at: account.expires_at
                  }
                });
              }

              // Update user information
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { 
                  image: profile?.picture,
                  name: profile?.name || user.name
                }
              });
            }

            // If there's a pending invitation, update it to ACCEPTED
            if (pendingInvitation) {
              await prisma.invitation.update({
                where: { id: pendingInvitation.id },
                data: { status: "ACCEPTED" }
              });
              console.log('Updated invitation status to ACCEPTED for:', user.email);
            }

            return true;
          } catch (dbError) {
            console.error("Database operation failed:", dbError);
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (token.picture && session.user) {
        session.user.image = token.picture as string;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);
      if (!dbUser) return token;

      token.role = dbUser.role;
      if (dbUser.image) {
        token.picture = dbUser.image;
      }
      return token;
    }
  }
});

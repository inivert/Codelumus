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
      website?: string | null;
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

        const normalizedEmail = user.email.toLowerCase();

        // Check if user exists in database
        const existingUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          include: { accounts: true }
        });

        // Check for pending invitation
        const pendingInvitation = await prisma.invitation.findFirst({
          where: {
            email: normalizedEmail,
            status: "PENDING"
          }
        });

        console.log("Sign-in attempt:", {
          email: normalizedEmail,
          existingUser: !!existingUser,
          pendingInvitation: !!pendingInvitation,
          provider: account?.provider
        });

        // If user doesn't exist and has no invitation, reject sign in
        if (!existingUser && !pendingInvitation) {
          console.log("Sign-in rejected: No user record or invitation found");
          return false;
        }

        try {
          // If user doesn't exist but has invitation, create the user
          if (!existingUser && pendingInvitation) {
            await prisma.user.create({
              data: {
                email: normalizedEmail,
                name: profile?.name || user.name,
                image: profile?.picture,
                role: UserRole.USER,
                accounts: account ? {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    expires_at: account.expires_at
                  }
                } : undefined
              }
            });
            console.log("Created new user from invitation");
          }

          // If user exists but doesn't have this provider linked
          if (existingUser && account) {
            const hasProvider = existingUser.accounts.some(
              acc => acc.provider === account.provider
            );

            if (!hasProvider) {
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
              console.log("Linked new provider to existing user");
            }

            // Update user information if needed
            if (profile?.picture || profile?.name) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { 
                  image: profile.picture,
                  name: profile.name || user.name
                }
              });
            }
          }

          // Update invitation status if exists
          if (pendingInvitation) {
            await prisma.invitation.update({
              where: { id: pendingInvitation.id },
              data: { status: "ACCEPTED" }
            });
            console.log("Updated invitation status to ACCEPTED");
          }

          return true;
        } catch (dbError) {
          console.error("Database operation failed:", dbError);
          return false;
        }
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

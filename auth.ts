import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import { env } from "@/env.mjs";

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
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/error",
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

        // Debug log for Google sign-in
        console.log("Sign-in attempt:", {
          provider: account?.provider,
          email: user.email,
          picture: profile?.picture,
          name: profile?.name,
          account: account,
          profile: profile
        });

        // Check if user exists in database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true }
        }).catch(err => {
          console.error("Database query error:", err);
          return null;
        });

        console.log("Existing user check:", existingUser);

        // If signing in with Google
        if (account?.provider === "google") {
          try {
            if (!existingUser) {
              // Create new user if doesn't exist
              console.log("Creating new user:", user.email);
              const newUser = await prisma.user.create({
                data: {
                  email: user.email,
                  name: profile?.name || user.name,
                  image: profile?.picture,
                  role: "USER",
                  accounts: {
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
                  }
                }
              });
              console.log("New user created:", newUser);
            } else {
              // User exists but might not have Google account linked
              const hasGoogleAccount = existingUser.accounts.some(
                acc => acc.provider === "google"
              );

              if (!hasGoogleAccount) {
                // Link Google account to existing user
                console.log("Linking Google account to existing user:", user.email);
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
              console.log("Updating existing user:", user.email);
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { 
                  image: profile?.picture,
                  name: profile?.name || user.name
                }
              });
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
      try {
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }
        if (token.role && session.user) {
          session.user.role = token.role as UserRole;
        }
        // Debug log for session
        console.log("Session update:", {
          picture: token.picture,
          sessionUserImage: session.user?.image
        });

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
        // Debug log for JWT
        console.log("JWT update:", {
          dbUserImage: dbUser.image,
          tokenPicture: token.picture
        });

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
    },
    async linkAccount({ user, account, profile }) {
      console.log("Account linked:", { user, account, profile });
    }
  },
});

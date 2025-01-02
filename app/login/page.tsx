import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";
import { Shell } from "@/components/shells/shell";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <Shell className="max-w-lg">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="text-muted-foreground">
        Enter your email to sign in to your account
      </p>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="text-sm text-muted-foreground text-center">
        Don&apos;t have an invitation?{" "}
        <Link href="/" className="underline hover:text-primary">
          Request access
        </Link>
      </p>
    </Shell>
  );
}

export const metadata = {
  title: "Login",
  description: "Login to your account",
}; 
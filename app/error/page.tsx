"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Authentication Error</h1>
        <p className="text-lg text-muted-foreground">
          {error === "Configuration"
            ? "There is a problem with the server configuration. Please try again later."
            : "An error occurred during authentication. Please try again."}
        </p>
        <Link
          href="/login"
          className="inline-block rounded-md bg-primary px-6 py-2 text-white hover:bg-primary/90"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
} 
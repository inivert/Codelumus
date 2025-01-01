"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  useEffect(() => {
    // Debug: Log the full error details
    console.log("Auth Error Details:", {
      error,
      errorDescription,
      fullUrl: window.location.href,
      searchParams: Object.fromEntries(searchParams.entries())
    });
  }, [error, errorDescription, searchParams]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Authentication Error</h1>
        <p className="text-lg text-muted-foreground">
          {error === "Configuration"
            ? "There is a problem with the server configuration. Please try again later."
            : error === "AccessDenied"
            ? "Access denied. Please make sure you're using the correct account."
            : error === "Verification"
            ? "The verification token has expired or is invalid."
            : `Authentication error: ${error || "Unknown error"}`}
        </p>
        <div className="text-sm text-gray-500">
          {errorDescription && (
            <p className="mt-2 text-red-500">{errorDescription}</p>
          )}
          <p className="mt-1">Error code: {error || "none"}</p>
        </div>
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
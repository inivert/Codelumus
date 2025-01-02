"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/shared/icons";
import { toast } from "sonner";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkEmail = async (email: string) => {
    try {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      return data.isAllowed;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleEmailSignIn = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setIsChecking(true);
      const isAllowed = await checkEmail(email);

      if (!isAllowed) {
        toast.error("This email is not allowed to sign in. Please request an invitation.");
        return;
      }

      setIsLoading(true);
      const result = await signIn("credentials", {
        email,
        redirect: false,
        callbackUrl: "/dashboard"
      });

      if (result?.error) {
        toast.error("Failed to sign in. Please try again.");
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsChecking(false);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { 
        callbackUrl: "/dashboard",
        redirect: true
      });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Input
          id="email"
          placeholder="name@example.com"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          disabled={isLoading || isChecking}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11"
        />
      </div>
      <Button
        onClick={handleEmailSignIn}
        disabled={isLoading || isChecking}
        className="h-11"
      >
        {isLoading || isChecking ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.mail className="mr-2 h-4 w-4" />
        )}
        Continue with Email
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading || isChecking}
        variant="outline"
        className="h-11"
      >
        {isLoading || isChecking ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  );
} 
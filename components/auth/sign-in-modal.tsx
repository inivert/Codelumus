"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SignInModalProps {
  showSignInModal: boolean;
  setShowSignInModal: (show: boolean) => void;
}

export function SignInModal({
  showSignInModal,
  setShowSignInModal,
}: SignInModalProps) {
  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <div className="flex flex-col space-y-4 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Enter your email to sign in to your account
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an invitation?
          </p>
          <Link href="/book-consultation">
            <Button variant="outline" className="gap-2">
              Request Access
              <span aria-hidden="true">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
} 
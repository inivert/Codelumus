"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DialogTitle } from "@/components/ui/dialog";

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
      <div className="flex flex-col space-y-6 p-6">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Welcome back
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an invitation?
          </div>
          <Link href="/book-consultation" className="w-full">
            <Button variant="outline" className="w-full gap-2">
              Request Access
              <span aria-hidden="true" className="text-muted-foreground">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
} 
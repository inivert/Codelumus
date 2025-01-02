import { signIn } from "next-auth/react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function SignInModal({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [signInClicked, setSignInClicked] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setIsEmailLoading(true);

      // First check if user exists
      const checkResponse = await fetch("/api/auth/access-required", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const responseData = await checkResponse.json();

      // If user exists (status 400), send magic link
      if (checkResponse.status === 400 && responseData.error === "User already exists") {
        // Send magic link for existing users
        const result = await signIn("email", {
          email: email.toLowerCase(),
          redirect: false,
          callbackUrl: "/dashboard",
        });

        if (!result?.ok) {
          toast.error("Something went wrong.", {
            description: "Your sign in request failed. Please try again.",
          });
          return;
        }

        toast.success("Check your email", {
          description: "We sent you a login link. Be sure to check your spam too.",
        });
        setShowSignInModal(false);
      } else if (checkResponse.ok) {
        // If user doesn't exist, show access required message
        toast.success("Thank you for your interest!", {
          description: "Please check your email for further instructions.",
        });
        setShowSignInModal(false);
      } else {
        throw new Error(responseData.error || "Failed to process request");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong.", {
        description: "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <div className="w-full">
        <DialogHeader className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <a href={siteConfig.url}>
            <Icons.logo className="size-10" />
          </a>
          <DialogTitle className="font-urban text-2xl font-bold">
            Sign In
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            This is strictly for demo purposes - only your email and profile
            picture will be stored.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
          <form onSubmit={handleEmailSignIn} className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEmailLoading}
              />
              <Button type="submit" disabled={isEmailLoading}>
                {isEmailLoading ? (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                ) : (
                  <Icons.mail className="mr-2 size-4" />
                )}
                Sign In with Email
              </Button>
            </div>
          </form>

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
            variant="outline"
            disabled={signInClicked}
            onClick={() => {
              setSignInClicked(true);
              signIn("google", {
                callbackUrl: "/dashboard"
              });
            }}
          >
            {signInClicked ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 size-4" />
            )}{" "}
            Sign In with Google
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(
    () => ({
      setShowSignInModal,
      SignInModal: SignInModalCallback,
    }),
    [setShowSignInModal, SignInModalCallback],
  );
}

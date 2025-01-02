import { Shell } from "@/components/shells/shell";

export default function VerifyPage() {
  return (
    <Shell className="max-w-lg">
      <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
      <p className="text-muted-foreground">
        A sign in link has been sent to your email address.
      </p>
    </Shell>
  );
}

export const metadata = {
  title: "Verify Email",
  description: "Verify your email address to sign in",
}; 
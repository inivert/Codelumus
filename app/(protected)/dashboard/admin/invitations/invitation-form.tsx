"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendInvitation } from "./actions";

export function InvitationForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email") as string;
    
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setIsPending(true);
    try {
      await sendInvitation(email);
      toast.success("Invitation sent successfully!");
      
      // Reset form and refresh data
      const form = document.getElementById("invitation-form") as HTMLFormElement;
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Failed to send invitation:", error);
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Send Invitation</h3>
      <form 
        id="invitation-form"
        action={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                placeholder="Enter email address"
                type="email"
                className="pl-10"
                required
              />
            </div>
            <Button type="submit" size="icon" disabled={isPending}>
              {isPending ? (
                <Mail className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 
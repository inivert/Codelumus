"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, Plus } from "lucide-react";
import { sendInvitation } from "./actions";
import { useTransition } from "react";
import { toast } from "sonner";

export default function InvitationsPage() {
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email") as string;
    
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    startTransition(async () => {
      try {
        await sendInvitation(email);
        toast.success("Invitation sent successfully!");
        
        // Reset form
        const form = document.getElementById("invitation-form") as HTMLFormElement;
        form.reset();
      } catch (error) {
        toast.error("Failed to send invitation. Please try again.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
          <p className="text-muted-foreground">Manage and send invitations to new users</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="size-4" />
          New Invitation
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Send Invitation</CardTitle>
            <CardDescription>Send an invitation to a new user</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
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
                      <Mail className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>List of pending invitations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No pending invitations
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Recent invitation activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recent activity
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
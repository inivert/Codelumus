"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface Update {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  createdBy: {
    name: string | null;
    email: string | null;
  };
}

interface UpdatesFormProps {
  users: User[];
  updates: Update[];
}

export default function UpdatesForm({ users, updates }: UpdatesFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const title = formData.get('title') as string;
      const content = formData.get('content') as string;

      const response = await fetch("/api/admin/updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success("Update sent successfully");
      router.refresh();
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Failed to send update:", error);
      toast.error("Failed to send update. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteUpdate(updateId: string) {
    try {
      const response = await fetch(`/api/admin/updates/${updateId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete update");
      }

      toast.success("Update deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete update:", error);
      toast.error("Failed to delete update. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader
        heading="Updates"
        text="Send and manage updates to users"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Send New Update</h3>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter update title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">Content</label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Enter update content"
                    className="min-h-[150px] resize-none"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Update"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Updates</h3>
            <div className="space-y-4">
              {updates.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No updates found
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground">
                    <div>Title</div>
                    <div>Date</div>
                    <div>By</div>
                    <div>Actions</div>
                  </div>
                  {updates.map((update) => (
                    <div key={update.id} className="grid grid-cols-4 text-sm items-center">
                      <div>{update.title}</div>
                      <div>{new Date(update.createdAt).toLocaleDateString()}</div>
                      <div>{update.createdBy.name || 'Admin'}</div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteUpdate(update.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
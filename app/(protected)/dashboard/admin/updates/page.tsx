"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createUpdate, deleteUpdate, getUpdates } from "./actions";

export default function UpdatesPage() {
  const [isPending, setIsPending] = useState(false);
  const [updates, setUpdates] = useState([]);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    
    if (!title || !content) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsPending(true);
    try {
      await createUpdate(title, content);
      toast.success("Update sent successfully!");
      
      // Reset form and refresh data
      const form = document.getElementById("update-form") as HTMLFormElement;
      form.reset();
      loadUpdates();
      router.refresh();
    } catch (error) {
      console.error("Failed to send update:", error);
      toast.error("Failed to send update. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteUpdate(id);
      toast.success("Update deleted successfully!");
      loadUpdates();
    } catch (error) {
      console.error("Failed to delete update:", error);
      toast.error("Failed to delete update. Please try again.");
    }
  }

  async function loadUpdates() {
    try {
      const data = await getUpdates();
      setUpdates(data);
    } catch (error) {
      console.error("Failed to load updates:", error);
      toast.error("Failed to load updates");
    }
  }

  useEffect(() => {
    loadUpdates();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Updates</h2>
        <p className="text-muted-foreground">
          Send and manage updates to all users
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Send New Update</h3>
          <form 
            id="update-form"
            action={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Enter update title"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                name="content"
                placeholder="Enter update content"
                required
                rows={4}
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Sending..." : "Send Update"}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Updates</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {updates.map((update: any) => (
                  <TableRow key={update.id}>
                    <TableCell>{update.title}</TableCell>
                    <TableCell>
                      {new Date(update.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(update.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {updates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      No updates found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
} 
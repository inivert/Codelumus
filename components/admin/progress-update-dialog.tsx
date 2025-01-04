"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ProgressUpdateDialogProps {
  userId: string;
  currentProgress: number;
  userName: string | null;
}

export function ProgressUpdateDialog({ userId, currentProgress, userName }: ProgressUpdateDialogProps) {
  const [progress, setProgress] = useState(currentProgress);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      console.log("Sending update request:", {
        userId,
        progress,
        currentProgress
      });

      const response = await fetch("/api/user/analytics/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          progress,
        }),
      });

      const data = await response.json();
      console.log("Received response:", {
        status: response.status,
        ok: response.ok,
        data
      });

      if (!response.ok) {
        console.error("Error response details:", {
          status: response.status,
          data,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error(data.error || data.details || "Failed to update progress");
      }

      toast.success("Progress updated successfully");
      setOpen(false);
      // Force a page refresh to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Error updating progress:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        userId,
        progress
      });
      toast.error(error instanceof Error ? error.message : "Failed to update progress");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Update Progress</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Development Progress</DialogTitle>
          <DialogDescription>
            Update the website development progress for {userName || "user"}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Slider
                  value={[progress]}
                  onValueChange={([value]) => setProgress(value)}
                  max={100}
                  step={1}
                />
              </div>
              <span className="min-w-[3ch] text-sm">{progress}%</span>
            </div>
            <Button
              onClick={handleUpdate}
              disabled={isLoading || progress === currentProgress}
              className="w-full"
            >
              {isLoading ? "Updating..." : "Update Progress"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
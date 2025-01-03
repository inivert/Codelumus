"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AnalyticsUrlFormProps {
  userId: string;
  defaultValue?: string;
}

export function AnalyticsUrlForm({ userId, defaultValue }: AnalyticsUrlFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const umamiUrl = formData.get('umamiUrl') as string;
      if (!umamiUrl) return;

      const response = await fetch('/api/analytics/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          umamiUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save analytics URL');
      }

      toast.success('Analytics URL saved successfully');
    } catch (error) {
      console.error('Error saving analytics URL:', error);
      toast.error('Failed to save analytics URL');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="flex gap-2">
      <Input
        name="umamiUrl"
        placeholder="Enter Umami analytics URL"
        defaultValue={defaultValue}
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
} 
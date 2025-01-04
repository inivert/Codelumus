"use client";

import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";

interface AnalyticsButtonProps {
  analyticsUrl?: string;
}

export function AnalyticsButton({ analyticsUrl }: AnalyticsButtonProps) {
  return (
    <Button 
      size="lg"
      variant="default"
      className="gap-2"
      onClick={() => analyticsUrl && window.open(analyticsUrl, '_blank')}
      disabled={!analyticsUrl}
    >
      <BarChart className="h-5 w-5" />
      Open Analytics Dashboard
    </Button>
  );
} 
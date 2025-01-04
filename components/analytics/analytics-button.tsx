"use client";

import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";

const UMAMI_DASHBOARD_URL = "https://cloud.umami.is/share/CdCG51dHdfBvERgD/www.codelumus.com";

export function AnalyticsButton() {
  return (
    <Button 
      size="lg"
      variant="default"
      className="gap-2"
      onClick={() => window.open(UMAMI_DASHBOARD_URL, '_blank')}
    >
      <BarChart className="h-5 w-5" />
      Open Analytics Dashboard
    </Button>
  );
} 
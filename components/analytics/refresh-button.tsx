"use client";

import { Button } from "@/components/ui/button";

interface RefreshButtonProps {
  variant?: "default" | "outline" | "ghost";
  className?: string;
  children: React.ReactNode;
}

export function RefreshButton({ variant = "outline", className, children }: RefreshButtonProps) {
  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => window.location.reload()}
    >
      {children}
    </Button>
  );
} 
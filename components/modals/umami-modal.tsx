"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UmamiModalProps {
  analyticsUrl: string;
}

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export function UmamiModal({ analyticsUrl }: UmamiModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="lg" className="w-full sm:w-auto">
        View Analytics Dashboard
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Analytics Dashboard</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[calc(90vh-5rem)]">
            {isLoading && <LoadingSpinner />}
            <Suspense fallback={<LoadingSpinner />}>
              <iframe 
                src={analyticsUrl}
                className="absolute inset-0 w-full h-full border-0"
                allow="fullscreen"
                loading="lazy"
                onLoad={() => setIsLoading(false)}
              />
            </Suspense>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// TypeScript declarations for Calendly
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: Element;
      }) => void;
      showPopupWidget: (url: string) => void;
      closePopupWidget: () => void;
    };
  }
}

interface CalendlyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CalendlyModal({ open, onOpenChange }: CalendlyModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [calendarInitialized, setCalendarInitialized] = useState(false);

  // Handle Calendly widget initialization
  useEffect(() => {
    if (scriptLoaded && !calendarInitialized && open) {
      const initTimer = setTimeout(() => {
        if (window.Calendly) {
          setCalendarInitialized(true);
          setIsLoading(false);
        }
      }, 1000);

      return () => clearTimeout(initTimer);
    }
  }, [scriptLoaded, calendarInitialized, open]);

  // Handle widget initialization
  useEffect(() => {
    if (calendarInitialized && open) {
      const widget = document.querySelector('.calendly-inline-widget');
      if (widget) {
        const url = `https://calendly.com/codelumus?hide_gdpr_banner=1&background_color=ffffff&text_color=111111&primary_color=7257e9`;
        widget.setAttribute('data-url', url);
        window.Calendly?.initInlineWidget({
          url,
          parentElement: widget,
        });
      }
    }
  }, [calendarInitialized, open]);

  // Clean up Calendly when modal closes
  useEffect(() => {
    if (!open) {
      setIsLoading(true);
      setCalendarInitialized(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 bg-white dark:bg-white">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-gray-900">Schedule a Consultation</DialogTitle>
          <DialogDescription className="text-gray-500">
            Choose a time that works best for you. The call will be approximately 15 minutes.
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex h-[600px] w-full flex-col px-6 pb-6">
          {isLoading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-gray-500">Loading calendar...</p>
              </div>
            </div>
          )}
          
          <div 
            className={cn(
              "calendly-inline-widget flex-1 transition-opacity duration-200 rounded-lg overflow-hidden bg-white",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            data-url={`https://calendly.com/codelumus?hide_gdpr_banner=1&background_color=ffffff&text_color=111111&primary_color=7257e9`}
          />

          <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            async
            onLoad={() => setScriptLoaded(true)}
            onError={() => {
              setIsLoading(false);
              console.error("Failed to load Calendly widget");
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 
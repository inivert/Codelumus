"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function IframeWithLoading() {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className="relative flex-1 h-[calc(90vh-65px)]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="space-y-4 w-full px-8">
            <Skeleton className="h-8 w-[200px] mx-auto" />
            <Skeleton className="h-[60vh] w-full" />
          </div>
        </div>
      )}
      <iframe
        src="https://cloud.umami.is/share/5sBgPmbb3khFxPlf/www.codelumus.com"
        className="w-full h-full"
        allow="fullscreen"
        onLoad={() => setIsLoading(false)}
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
}

export function UmamiModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [iframeLoaded, setIframeLoaded] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="lg" 
          className="gap-2"
          onClick={() => {
            setIsOpen(true);
            // Start loading iframe when button is clicked
            setIframeLoaded(true);
          }}
        >
          <BarChart className="h-5 w-5" />
          View Analytics Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            <div>
              <DialogTitle>Website Analytics</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                View detailed analytics for your website
              </DialogDescription>
            </div>
          </div>
          <DialogClose asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => {
                setIsOpen(false);
                // Reset iframe state when modal is closed
                setIframeLoaded(false);
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        {/* Only render iframe when modal is opened */}
        {iframeLoaded && <IframeWithLoading />}
      </DialogContent>
    </Dialog>
  );
} 
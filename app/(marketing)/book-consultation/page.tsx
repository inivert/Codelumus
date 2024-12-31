"use client";

import Script from "next/script";
import { useTheme } from "next-themes";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function BookConsultationPage() {
  const { theme } = useTheme();
  const bgColor = theme === "dark" ? "111111" : "ffffff";
  const textColor = theme === "dark" ? "ffffff" : "111111";

  return (
    <MaxWidthWrapper className="py-10">
      <div className="flex flex-col items-start gap-4 md:gap-6">
        <div className="grid gap-1">
          <h1 className="line-clamp-1 text-3xl font-bold md:text-4xl">
            Book a Consultation
          </h1>
          <p className="text-lg text-muted-foreground">
            Schedule a free consultation call to discuss your project needs.
          </p>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border bg-background shadow-sm">
          <div 
            className="calendly-inline-widget" 
            data-url={`https://calendly.com/codelumus?hide_gdpr_banner=1&background_color=${bgColor}&text_color=${textColor}&primary_color=7257e9`}
            style={{ minWidth: "320px", height: "700px" }}
          />
          <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            async
          />
        </div>
      </div>
    </MaxWidthWrapper>
  );
} 
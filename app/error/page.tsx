"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft, Lock } from "lucide-react";

export default function ErrorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/30 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Top decorative element */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer pulsing ring */}
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
            {/* Inner glowing ring */}
            <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse" />
            {/* Lock container */}
            <div className="relative bg-primary/10 p-6 rounded-full ring-4 ring-primary/20">
              <Lock className="w-12 h-12 text-primary animate-[wiggle_3s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>

        {/* Main content card */}
        <div className="bg-card rounded-3xl p-8 shadow-xl border border-border/50 backdrop-blur-sm">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Private Website
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              This is a private platform. Please schedule a consultation to discuss access.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/book-consultation"
              className="group flex items-center justify-center gap-3 w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-4 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
            >
              <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              Book a Consultation
            </Link>
            <Link
              href="/"
              className="group flex items-center justify-center gap-3 w-full bg-muted hover:bg-muted/80 text-muted-foreground px-6 py-4 rounded-xl font-medium transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground/80">
            Have questions? Contact us at{" "}
            <a href="mailto:support@example.com" className="text-primary hover:underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-3deg);
          }
          75% {
            transform: rotate(3deg);
          }
        }
      `}</style>
    </main>
  );
} 
import "@/styles/globals.css";

import { fontGeist, fontHeading, fontSans, fontUrban } from "@/assets/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import AuthProvider from "@/components/providers/session-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { cn } from "@/lib/utils";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Codelumus",
    template: "%s | Codelumus",
  },
  description: "Learn to code with interactive tutorials and challenges",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="bd3024d9-a6cc-425a-819a-b0229bd3b608"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontUrban.variable,
          fontHeading.variable,
          fontGeist.variable
        )}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <ModalProvider>
                {children}
                <Toaster richColors closeButton />
                <Analytics />
                <TailwindIndicator />
              </ModalProvider>
            </QueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

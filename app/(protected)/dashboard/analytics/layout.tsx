import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Analytics",
  description: "Monitor your website performance and user engagement",
});

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Book a Consultation",
  description: "Schedule a free consultation call to discuss your project.",
});

export default function BookConsultationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 
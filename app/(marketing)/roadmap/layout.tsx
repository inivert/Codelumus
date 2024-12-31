import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Development Roadmap",
  description: "Learn about our comprehensive website development process and how we bring your vision to life.",
};

interface RoadmapLayoutProps {
  children: React.ReactNode;
}

export default function RoadmapLayout({ children }: RoadmapLayoutProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl" />
      <div className="relative">{children}</div>
    </div>
  );
} 
"use client";

import { ArrowRight, CheckCircle2, Code2, Palette, Rocket, Users2, Zap, Database, Shield, LayoutDashboard } from "lucide-react";
import { RoadmapAnimation } from "./roadmap-animation";

interface Feature {
  title: string;
  description: string;
}

interface Step {
  title: string;
  description: string;
  details: string[];
}

interface RoadmapContentProps {
  features: Feature[];
  detailedSteps: Step[];
}

const iconMap = {
  "Lightning Fast": Zap,
  "Scalable": Database,
  "Secure": Shield,
  "User-Friendly": LayoutDashboard,
};

const stepIconMap = {
  "1. Discovery & Planning": Users2,
  "2. Design & Prototyping": Palette,
  "3. Development": Code2,
  "4. Security & Performance": Shield,
  "5. Testing & Quality Assurance": CheckCircle2,
  "6. Launch & Support": Rocket,
};

export function RoadmapContent({ features, detailedSteps }: RoadmapContentProps) {
  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Website Development Journey</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Your path to a perfect website, step by step
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feature, index) => {
          const Icon = iconMap[feature.title as keyof typeof iconMap];
          return (
            <div
              key={index}
              className="p-4 bg-card rounded-lg border text-center"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-muted-foreground text-xs">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Animated Roadmap */}
      <RoadmapAnimation features={features} detailedSteps={detailedSteps} iconMap={iconMap} stepIconMap={stepIconMap} />

      {/* CTA Section */}
      <div className="text-center py-8">
        <a
          href="/book-consultation"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full hover:opacity-90 transition-all hover:scale-105"
        >
          Start Your Journey
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
} 
import { ArrowRight, CheckCircle2, Code2, Palette, Rocket, Users2 } from "lucide-react";
import Link from "next/link";

const previewSteps = [
  {
    icon: Users2,
    title: "Discovery",
    description: "Understanding your vision"
  },
  {
    icon: Palette,
    title: "Design",
    description: "Creating the perfect look"
  },
  {
    icon: Code2,
    title: "Development",
    description: "Building with modern tech"
  },
  {
    icon: Rocket,
    title: "Launch",
    description: "Going live with support"
  }
];

export function RoadmapPreview() {
  return (
    <div className="container py-12 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Our Development Process</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A streamlined approach to bringing your vision to life
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {/* Connecting Line */}
        <div className="hidden md:block absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-primary/50 via-primary/20 to-primary/50 transform -translate-y-1/2" />
        
        {previewSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={index}
              className="relative bg-card p-6 rounded-lg border text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
              
              {/* Connecting Point */}
              <div className="hidden md:block absolute w-3 h-3 rounded-full bg-primary top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          );
        })}
      </div>

      <div className="text-center pt-8">
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
        >
          View detailed roadmap
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
} 
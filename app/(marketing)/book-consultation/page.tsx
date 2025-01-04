"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { CalendlyModal } from "@/components/calendly/calendly-modal";
import { Clock, Video, Presentation, CheckCircle2 } from "lucide-react";

const features = [
  {
    title: "15-Minute Focused Call",
    description: "Quick, efficient consultation to understand your needs and provide immediate value.",
    icon: Clock,
  },
  {
    title: "Video Conference",
    description: "Face-to-face meeting via high-quality video call for better communication.",
    icon: Video,
  },
  {
    title: "Project Discussion",
    description: "Review your requirements, timeline, and budget to create a tailored solution.",
    icon: Presentation,
  },
  {
    title: "Next Steps Plan",
    description: "Clear action items and recommendations for moving forward with your project.",
    icon: CheckCircle2,
  },
];

export default function BookConsultationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <MaxWidthWrapper className="py-20">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="grid gap-2 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Book a Free Consultation
          </h1>
          <p className="text-lg text-muted-foreground">
            Schedule a call to discuss your project needs and see how we can help you succeed.
          </p>
        </div>

        <Button size="lg" onClick={() => setIsModalOpen(true)}>
          Schedule Now
        </Button>

        <CalendlyModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen} 
        />
      </div>

      <section className="py-20">
        <div className="grid gap-8 text-center mb-12">
          <h2 className="text-3xl font-bold">What to Expect</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our consultation calls are designed to be efficient and valuable, helping you get clear direction for your project.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="flex flex-col items-center text-center p-6 rounded-lg border bg-card"
            >
              <feature.icon className="h-12 w-12 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </MaxWidthWrapper>
  );
} 
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Code2, Palette, Rocket, Users2 } from "lucide-react";

const steps = [
  {
    icon: Users2,
    title: "1. Discovery & Planning",
    description: "We start by understanding your vision, goals, and requirements through in-depth consultation.",
  },
  {
    icon: Palette,
    title: "2. Design & Prototyping",
    description: "Creating wireframes and visual designs that align with your brand and user experience goals.",
  },
  {
    icon: Code2,
    title: "3. Development",
    description: "Building your website with modern technologies ensuring performance, security, and scalability.",
  },
  {
    icon: CheckCircle2,
    title: "4. Testing & Review",
    description: "Rigorous testing across devices and browsers, followed by your feedback and revisions.",
  },
  {
    icon: Rocket,
    title: "5. Launch & Support",
    description: "Deploying your website and providing ongoing support and maintenance.",
  },
];

export default function Roadmap() {
  return (
    <section className="container py-24 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Our Website Building Process</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We follow a structured approach to bring your vision to life. Here's how we'll work together
          to create your perfect website.
        </p>
      </div>

      <div className="grid gap-8 relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="flex items-center gap-4 bg-card p-6 rounded-lg border">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center pt-8">
        <a
          href="/book-consultation"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          Start Your Project
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
} 
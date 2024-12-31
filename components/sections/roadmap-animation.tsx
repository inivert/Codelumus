"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
}

interface Step {
  title: string;
  description: string;
  details: string[];
}

interface RoadmapAnimationProps {
  features: Feature[];
  detailedSteps: Step[];
  iconMap: Record<string, LucideIcon>;
  stepIconMap: Record<string, LucideIcon>;
}

export function RoadmapAnimation({ detailedSteps, stepIconMap }: RoadmapAnimationProps) {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Connecting Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-primary/20" />
      
      {detailedSteps.map((step, index) => {
        const Icon = stepIconMap[step.title as keyof typeof stepIconMap];
        const isLeft = index % 2 === 0;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`relative flex items-center gap-8 mb-16 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
          >
            {/* Connecting Arrow */}
            <div 
              className={`absolute top-1/2 ${isLeft ? 'left-[calc(50%-1px)]' : 'right-[calc(50%-1px)]'} w-8 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20`}
            />
            
            {/* Content Box */}
            <div className={`w-1/2 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ${isLeft ? 'order-first' : 'order-last'}`}>
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-3">{step.description}</p>
                <div className="grid grid-cols-1 gap-2">
                  {step.details.slice(0, 3).map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Center Point */}
            <div className="w-3 h-3 rounded-full bg-primary absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        );
      })}
    </div>
  );
} 
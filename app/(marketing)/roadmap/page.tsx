"use client";

import { Metadata } from "next";
import { RoadmapContent } from "@/components/sections/roadmap-content";

const detailedSteps = [
  {
    title: "1. Discovery & Planning",
    description: "Understanding your vision and planning the perfect solution",
    details: [
      "Initial consultation to understand your goals",
      "Analysis of your target audience and market",
      "Project scope definition and timeline planning",
      "Technology stack selection based on requirements",
      "Budget planning and milestone definition"
    ]
  },
  {
    title: "2. Design & Prototyping",
    description: "Creating the perfect look and feel for your website",
    details: [
      "Wireframe creation for layout planning",
      "UI/UX design with modern aesthetics",
      "Brand integration and color scheme selection",
      "Interactive prototype development",
      "Design review and refinement"
    ]
  },
  {
    title: "3. Development",
    description: "Building with cutting-edge technologies",
    details: [
      "Frontend development with Next.js and React",
      "Responsive design implementation",
      "Backend API development",
      "Database architecture and setup",
      "Integration of third-party services"
    ]
  },
  {
    title: "4. Security & Performance",
    description: "Ensuring your website is fast and secure",
    details: [
      "SSL certificate implementation",
      "Security best practices implementation",
      "Performance optimization",
      "Load testing and optimization",
      "SEO optimization"
    ]
  },
  {
    title: "5. Testing & Quality Assurance",
    description: "Rigorous testing to ensure everything works perfectly",
    details: [
      "Cross-browser compatibility testing",
      "Mobile responsiveness verification",
      "User acceptance testing",
      "Bug fixing and refinements",
      "Performance benchmarking"
    ]
  },
  {
    title: "6. Launch & Support",
    description: "Going live and ensuring continued success",
    details: [
      "Deployment to production environment",
      "Domain and DNS setup",
      "Post-launch monitoring",
      "Training and documentation",
      "Ongoing maintenance and support"
    ]
  }
];

const features = [
  {
    title: "Lightning Fast",
    description: "Optimized for speed and performance"
  },
  {
    title: "Scalable",
    description: "Built to grow with your business"
  },
  {
    title: "Secure",
    description: "Enterprise-grade security measures"
  },
  {
    title: "User-Friendly",
    description: "Intuitive interfaces and smooth UX"
  }
];

export default function RoadmapPage() {
  return <RoadmapContent features={features} detailedSteps={detailedSteps} />;
}

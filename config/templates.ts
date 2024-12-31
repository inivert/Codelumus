interface Template {
  title: string;
  description: string;
  image: string;
  demoUrl: string;
  sourceUrl?: string;
  featured?: boolean;
  tags?: string[];
}

export const templates: Template[] = [
  {
    title: "Modern SaaS Platform",
    description: "A complete SaaS starter template with authentication, billing, and admin dashboard.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    demoUrl: "#",
    sourceUrl: "#",
    featured: true,
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "E-commerce Store",
    description: "Full-featured e-commerce solution with product management, cart, and checkout.",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80",
    demoUrl: "#",
    sourceUrl: "#",
    tags: ["Next.js", "React", "TypeScript", "Stripe"],
  },
  {
    title: "Blog Platform",
    description: "Modern blog platform with MDX support, categories, and search functionality.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
    demoUrl: "#",
    sourceUrl: "#",
    tags: ["Next.js", "MDX", "ContentLayer"],
  },
  {
    title: "Portfolio Website",
    description: "Clean and minimal portfolio template for showcasing your work and projects.",
    image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=800&auto=format&fit=crop&q=80",
    demoUrl: "#",
    featured: true,
    tags: ["Next.js", "React", "Framer Motion"],
  },
  {
    title: "Admin Dashboard",
    description: "Feature-rich admin dashboard with charts, tables, and data visualization.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    demoUrl: "#",
    sourceUrl: "#",
    tags: ["Next.js", "React", "TypeScript", "Recharts"],
  },
  {
    title: "Landing Page",
    description: "High-converting landing page template with modern design and animations.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&auto=format&fit=crop&q=80",
    demoUrl: "#",
    tags: ["Next.js", "React", "Tailwind CSS"],
  },
]; 
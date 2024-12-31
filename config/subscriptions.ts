import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Starter",
    description: "Perfect for a simple online presence",
    benefits: [
      "Single page website",
      "Mobile responsive design",
      "Basic SEO setup",
      "Contact form setup",
      "5 content sections",
      "2 weeks of email support"
    ],
    limitations: [
      "Domain not included",
      "Basic design options",
      "No database features",
      "Standard hosting"
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: "Pro",
    description: "For growing businesses and professionals",
    benefits: [
      "Up to 5 pages",
      "Premium responsive design",
      "Complete SEO setup",
      "Domain configuration",
      "Database setup",
      "Online store ready",
      "1 month of priority support",
      "Weekly backups",
      "Speed optimization"
    ],
    limitations: [
      "Basic API options",
      "Standard analytics"
    ],
    prices: {
      monthly: 45,
      yearly: 432, // $45 * 12 * 0.80 (20% discount)
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Enterprise",
    description: "For custom web applications",
    benefits: [
      "Unlimited pages",
      "Custom web app",
      "Premium security",
      "Fast-track development",
      "Same-day responses",
      "Custom integrations",
      "Custom analytics",
      "Daily backups",
      "Load balancing",
      "Direct access to me"
    ],
    limitations: [],
    prices: {
      monthly: 77,
      yearly: 739, // $77 * 12 * 0.80 (20% discount)
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
  },
];

export const plansColumns = [
  "starter",
  "pro",
  "enterprise",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Pages",
    starter: "1 page",
    pro: "Up to 5 pages",
    enterprise: "Unlimited",
    tooltip: "Total number of pages I'll create for your site.",
  },
  {
    feature: "Design Customization",
    starter: "Basic",
    pro: "Advanced",
    enterprise: "Full Custom",
    tooltip: "How much I can customize your site's design.",
  },
  {
    feature: "SEO Optimization",
    starter: "Basic",
    pro: "Full",
    enterprise: "Advanced",
    tooltip: "I'll optimize your site to rank better in search results.",
  },
  {
    feature: "Response Time",
    starter: "48 hours",
    pro: "24 hours",
    enterprise: "Same day",
    tooltip: "How quickly I'll respond to your messages.",
  },
  {
    feature: "Database Integration",
    starter: null,
    pro: "Basic",
    enterprise: "Advanced",
    tooltip: "I'll set up dynamic content features for your site.",
  },
  {
    feature: "Security",
    starter: "Basic SSL",
    pro: "Enhanced",
    enterprise: "Advanced",
    tooltip: "I'll implement security measures to protect your site.",
  },
  {
    feature: "Backups",
    starter: "Monthly",
    pro: "Weekly",
    enterprise: "Daily",
    tooltip: "I'll back up your site to prevent data loss.",
  },
  {
    feature: "Integrations",
    starter: null,
    pro: "Basic",
    enterprise: "Advanced",
    tooltip: "I'll connect your site with other services you use.",
  },
  {
    feature: "Analytics",
    starter: "Basic",
    pro: "Advanced",
    enterprise: "Custom",
    tooltip: "I'll set up tools to track your site's performance.",
  },
  {
    feature: "Performance",
    starter: "Basic",
    pro: "Advanced",
    enterprise: "Premium",
    tooltip: "I'll optimize your site for maximum speed.",
  }
];

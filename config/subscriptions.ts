import { PlansRow, SubscriptionPlan, AddOn } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Starter Plan",
    description: "Everything you need for a professional website",
    benefits: [
      "5-page custom website",
      "Free domain name",
      "Mobile-friendly design",
      "SSL security",
      "2 monthly changes",
      "Basic analytics",
      "Contact form",
      "Regular updates",
      "Tech support"
    ],
    limitations: [],
    prices: {
      monthly: 59,
      yearly: 590, // 2 months free
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
];

export const addOns: AddOn[] = [
  {
    id: "ecommerce",
    title: "E-Commerce",
    price: {
      monthly: 35,
      yearly: 350
    },
    description: "Turn your website into a full-featured online store with everything you need to sell products online.",
    features: [
      "Shopping cart",
      "Payment processing",
      "Product catalog",
      "Order management",
      "Inventory tracking"
    ]
  },
  {
    id: "user-accounts",
    title: "User Accounts",
    price: {
      monthly: 25,
      yearly: 250
    },
    description: "Add member-only areas and user authentication to your website.",
    features: [
      "Login system",
      "Member areas",
      "User dashboard",
      "Password recovery"
    ]
  },
  {
    id: "content-manager",
    title: "Content Manager",
    price: {
      monthly: 20,
      yearly: 200
    },
    description: "Easily manage your website content with a powerful content management system.",
    features: [
      "Easy updates",
      "Blog system",
      "5 extra pages",
      "Image optimization"
    ]
  },
  {
    id: "booking-system",
    title: "Booking System",
    price: {
      monthly: 25,
      yearly: 250
    },
    description: "Let your customers book appointments and services directly through your website.",
    features: [
      "Online scheduling",
      "Auto-confirmations",
      "Calendar sync",
      "Email reminders"
    ]
  },
  {
    id: "extra-changes",
    title: "Extra Changes",
    price: {
      monthly: 15,
      yearly: 150
    },
    description: "Need more frequent updates? Get additional monthly changes with priority handling.",
    features: [
      "2 additional monthly changes",
      "Priority handling"
    ]
  }
];

export const specialDeals = [
  "Save 15% on any 3 add-ons",
  "First month: 50% OFF",
  "Yearly: 2 months FREE"
];

export const includedFeatures = [
  "Zero setup fees",
  "Cancel anytime",
  "Direct support",
  "Daily backups",
  "Security monitoring"
];

export const comparePlans: PlansRow[] = [
  {
    feature: "Pages",
    starter: "5 pages",
    tooltip: "Total number of custom pages included in your website.",
  },
  {
    feature: "Domain Name",
    starter: "Free",
    tooltip: "A custom domain name for your website.",
  },
  {
    feature: "Design",
    starter: "Mobile-friendly",
    tooltip: "Your website will look great on all devices.",
  },
  {
    feature: "Security",
    starter: "SSL included",
    tooltip: "Keep your website secure with SSL encryption.",
  },
  {
    feature: "Monthly Changes",
    starter: "2 changes",
    tooltip: "Number of content updates included per month.",
  },
  {
    feature: "Analytics",
    starter: "Basic included",
    tooltip: "Track your website's performance.",
  },
  {
    feature: "Support",
    starter: "Direct support",
    tooltip: "Get help when you need it.",
  }
];

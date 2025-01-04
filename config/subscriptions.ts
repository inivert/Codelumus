import { AddOn, SubscriptionPlan } from "@/types";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Starter",
    description: "Perfect for small businesses getting started with their online presence.",
    benefits: [
      "Custom Website Design",
      "Mobile Responsive",
      "SEO Optimization",
      "Contact Form",
      "Social Media Integration",
      "Basic Security Features",
      "Web Hosting",
      "SSL Certificate",
      "24/7 Support",
    ],
    limitations: [],
    prices: {
      monthly: 59,
      yearly: 590,
    },
    stripeIds: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID!,
      yearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID!,
    },
  },
];

export const addOns: AddOn[] = [
  {
    id: "ecommerce",
    title: "E-Commerce Add-on",
    description: "Add e-commerce functionality to your website",
    price: {
      monthly: 35,
      yearly: 350,
    },
    stripeIds: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_ECOMMERCE_MONTHLY_ID!,
      yearly: process.env.NEXT_PUBLIC_STRIPE_ECOMMERCE_YEARLY_ID!,
    },
    features: [
      "Product Catalog",
      "Shopping Cart",
      "Secure Checkout",
      "Payment Gateway Integration",
      "Order Management",
      "Inventory Tracking",
    ],
  },
  {
    id: "user-accounts",
    title: "User Accounts Add-on",
    description: "Add user account functionality to your website",
    price: {
      monthly: 25,
      yearly: 250,
    },
    stripeIds: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_USER_ACCOUNTS_MONTHLY_ID!,
      yearly: process.env.NEXT_PUBLIC_STRIPE_USER_ACCOUNTS_YEARLY_ID!,
    },
    features: [
      "User Registration",
      "User Login",
      "User Dashboard",
      "Password Reset",
      "Profile Management",
      "Role-based Access",
    ],
  },
  {
    id: "content-manager",
    title: "Content Manager Add-on",
    description: "Add content management functionality to your website",
    price: {
      monthly: 20,
      yearly: 200,
    },
    stripeIds: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_CONTENT_MANAGER_MONTHLY_ID!,
      yearly: process.env.NEXT_PUBLIC_STRIPE_CONTENT_MANAGER_YEARLY_ID!,
    },
    features: [
      "Blog Management",
      "Media Library",
      "Content Scheduling",
      "SEO Tools",
      "Categories & Tags",
      "Content Analytics",
    ],
  },
  {
    id: "booking",
    title: "Booking System Add-on",
    description: "Add booking and scheduling functionality to your website",
    price: {
      monthly: 25,
      yearly: 250,
    },
    stripeIds: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_BOOKING_MONTHLY_ID!,
      yearly: process.env.NEXT_PUBLIC_STRIPE_BOOKING_YEARLY_ID!,
    },
    features: [
      "Online Booking",
      "Calendar Management",
      "Automated Reminders",
      "Payment Integration",
      "Staff Management",
      "Service Management",
    ],
  },
  {
    id: "extra-changes",
    title: "Extra Changes Add-on",
    description: "Add additional design changes and updates to your website",
    price: {
      monthly: 15,
      yearly: 150,
    },
    stripeIds: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_EXTRA_CHANGES_MONTHLY_ID!,
      yearly: process.env.NEXT_PUBLIC_STRIPE_EXTRA_CHANGES_YEARLY_ID!,
    },
    features: [
      "Monthly Design Updates",
      "Content Updates",
      "Layout Changes",
      "New Feature Implementation",
      "Performance Optimization",
      "Regular Maintenance",
    ],
  },
];

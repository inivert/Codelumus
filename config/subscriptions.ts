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
      "Google Analytics",
      "Basic Security Features",
      "1 Year Domain Name",
      "Web Hosting",
      "SSL Certificate",
      "5 Email Accounts",
      "24/7 Support",
    ],
    limitations: [],
    prices: {
      monthly: 59,
      yearly: 590,
    },
    stripeIds: {
      monthly: "price_1QciwmDQyO648ofb0RFtTaDY",
      yearly: "price_1QciwmDQyO648ofbuZJNeGon",
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
      monthly: "price_1QctpJDQyO648ofbbCPMTaS6",
      yearly: "price_1QctpJDQyO648ofbfTdhyNUP",
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
      monthly: "price_1QctpKDQyO648ofb2X6bWAW8",
      yearly: "price_1QctpKDQyO648ofb0hqp25Mx",
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
      monthly: "price_1QctpKDQyO648ofbMJsnB5un",
      yearly: "price_1QctpLDQyO648ofb45dVAJbM",
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
      monthly: "price_1QctpLDQyO648ofbAFwrRToS",
      yearly: "price_1QctpLDQyO648ofbCdgvAlMF",
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
      monthly: "price_1QctpLDQyO648ofb827wxflH",
      yearly: "price_1QctpMDQyO648ofbL6Vw7976",
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

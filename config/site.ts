import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Codelumus",
  description:
    "Your central hub for managing development projects and collaborations.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/codelumus",
    github: "https://github.com/",
  },
  mailSupport: "support@codelumus.com",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "#" },
      { title: "Enterprise", href: "#" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Security", href: "#" },
      { title: "Features", href: "#" },
      { title: "Customers", href: "#" },
      { title: "Updates", href: "#" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Documentation", href: "#" },
      { title: "Guides", href: "#" },
      { title: "Support", href: "#" },
      { title: "API", href: "#" },
    ],
  },
];

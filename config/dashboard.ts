import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      {
        href: "/docs",
        icon: "page",
        title: "Documentation",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.USER,
      },
      { 
        href: "/dashboard/charts", 
        icon: "lineChart", 
        title: "Charts",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/admin/updates",
        icon: "post",
        title: "Updates",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/admin/messages",
        icon: "messages",
        title: "Support Messages",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/admin/invitations",
        icon: "mail",
        title: "Invitations",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "#/dashboard/posts",
        icon: "post",
        title: "User Posts",
        authorizeOnly: UserRole.USER,
        disabled: true,
      },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      { href: "/", icon: "home", title: "Homepage" },
      {
        href: "/dashboard/support",
        icon: "messages",
        title: "Support",
        authorizeOnly: UserRole.USER,
      },
    ],
  },
];

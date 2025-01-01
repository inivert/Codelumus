"use client";

import { sidebarLinks } from "@/config/dashboard";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar links={sidebarLinks} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
} 
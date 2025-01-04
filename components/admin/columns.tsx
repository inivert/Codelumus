"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { ProgressUpdateDialog } from "./progress-update-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";

export type UserSubscription = {
  id: string;
  name: string | null;
  email: string | null;
  status: string;
  subscriptionId: string | null;
  customerId: string | null;
  plan: string;
  website: string;
  addons: string[];
  interval: string;
  cost: number;
  periodEnd: Date | null;
  createdAt: Date;
  analyticsProgress: number;
  analyticsUrl: string | null;
  hasAnalytics: boolean;
};

export const columns: ColumnDef<UserSubscription>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const email = row.original.email;
      return (
        <div>
          <div className="font-medium">{row.getValue("name") || "No name"}</div>
          <div className="text-sm text-muted-foreground">{email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => {
      const interval = row.original.interval;
      return (
        <div>
          <div className="font-medium">{row.getValue("plan")}</div>
          <div className="text-xs text-muted-foreground capitalize">
            {interval} billing
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      const website = row.getValue("website") as string;
      return (
        <div className="max-w-[200px] truncate">
          {website || "No website"}
        </div>
      );
    },
  },
  {
    accessorKey: "addons",
    header: "Add-ons",
    cell: ({ row }) => {
      const addons = row.getValue("addons") as string[];
      return (
        <div className="max-w-[200px] truncate">
          {addons.length > 0 ? addons.join(", ") : "No add-ons"}
        </div>
      );
    },
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => {
      const cost = row.getValue("cost") as number;
      const interval = row.original.interval;
      return (
        <div className="font-medium">
          ${cost.toFixed(2)}/{interval}
        </div>
      );
    },
  },
  {
    accessorKey: "periodEnd",
    header: "Renewal",
    cell: ({ row }) => {
      const date = row.getValue("periodEnd") as Date;
      return date ? formatDate(date) : "N/A";
    },
  },
  {
    accessorKey: "analyticsProgress",
    header: "Website Progress",
    cell: ({ row }) => {
      const progress = row.getValue("analyticsProgress") as number;
      const userId = row.original.id;
      const userName = row.original.name;
      const analyticsUrl = row.original.analyticsUrl;

      return (
        <div className="w-[200px] space-y-2">
          <div className="flex justify-between text-sm">
            <span>{progress === 100 ? "Complete" : "In Progress"}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="pt-2">
            <ProgressUpdateDialog
              userId={userId}
              currentProgress={progress}
              userName={userName}
            />
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const stripeCustomerUrl = user.customerId ? 
        `https://dashboard.stripe.com/customers/${user.customerId}` : 
        null;
      const stripeSubscriptionUrl = user.subscriptionId ? 
        `https://dashboard.stripe.com/subscriptions/${user.subscriptionId}` : 
        null;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {stripeCustomerUrl && (
              <DropdownMenuItem asChild>
                <a
                  href={stripeCustomerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  View Customer
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </DropdownMenuItem>
            )}
            {stripeSubscriptionUrl && (
              <DropdownMenuItem asChild>
                <a
                  href={stripeSubscriptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  View Subscription
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(user.id);
              }}
            >
              Copy User ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 
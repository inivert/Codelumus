import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "@/components/admin/columns";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addOns, pricingData } from "@/config/subscriptions";
import { formatDate } from "@/lib/utils";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import type { Stripe } from 'stripe';

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getSubscriptionData(stripeSubscriptionId: string | null) {
  if (!stripeSubscriptionId) return null;

  try {
    return await stripe.subscriptions.retrieve(stripeSubscriptionId, {
      expand: ['items.data.price.product']
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}

interface SubscriptionItem extends Stripe.SubscriptionItem {
  price: Stripe.Price & {
    product: Stripe.Product;
    unit_amount: number;
  };
}

interface UserWithSubscription {
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
}

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  // Get all users with their subscription data
  const users = await prisma.user.findMany({
    where: {
      role: {
        not: "ADMIN"
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      website: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      createdAt: true,
      analytics: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Fetch subscription details for each user directly from Stripe
  const usersWithSubscriptions: UserWithSubscription[] = await Promise.all(
    users.map(async (user) => {
      let stripeSubscription: Stripe.Subscription | null = null;
      let subscriptionItems: SubscriptionItem[] = [];
      
      if (user.stripeSubscriptionId) {
        try {
          // Get live subscription data from Stripe
          stripeSubscription = await stripe.subscriptions.retrieve(
            user.stripeSubscriptionId,
            {
              expand: ['items.data.price.product', 'items.data.price']
            }
          ) as Stripe.Subscription & { items: { data: SubscriptionItem[] } };
          
          subscriptionItems = stripeSubscription.items.data.map(item => ({
            ...item,
            price: {
              ...item.price,
              product: item.price.product as Stripe.Product,
              unit_amount: (item.price as Stripe.Price).unit_amount || 0
            }
          })) as SubscriptionItem[];
        } catch (error) {
          console.error(`Error fetching subscription for user ${user.id}:`, error);
        }
      }

      // Get base plan and addons from Stripe data
      const basePlanItem = subscriptionItems.find(
        item => !item.price.product.metadata?.type || item.price.product.metadata.type !== 'addon'
      );
      const addonItems = subscriptionItems.filter(
        item => item.price.product.metadata?.type === 'addon'
      );

      // Calculate costs directly from Stripe prices
      const baseAmount = basePlanItem?.price.unit_amount ? basePlanItem.price.unit_amount / 100 : 0;
      const addonsAmount = addonItems.reduce((sum, item) => 
        sum + (item.price.unit_amount ? item.price.unit_amount / 100 : 0), 0
      );

      const totalCost = baseAmount + addonsAmount;
      const interval = basePlanItem?.price.recurring?.interval || 'month';

      // Get formatted addon names from Stripe metadata
      const addonNames = addonItems.map(item => 
        item.price.product.name || item.price.product.metadata?.title || 'Unknown Addon'
      );

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: stripeSubscription?.status || 'inactive',
        subscriptionId: user.stripeSubscriptionId,
        customerId: user.stripeCustomerId,
        plan: basePlanItem?.price.product.name || 'No Plan',
        website: user.website || 'No Website',
        addons: addonNames,
        interval: `${interval}ly`,
        cost: totalCost,
        periodEnd: stripeSubscription?.current_period_end 
          ? new Date(stripeSubscription.current_period_end * 1000)
          : null,
        createdAt: user.createdAt,
        analyticsProgress: user.analytics?.progress ?? 0,
        analyticsUrl: user.analytics?.umamiUrl || null,
        hasAnalytics: !!user.analytics
      };
    })
  );

  // Calculate summary statistics using live Stripe data
  const stats = {
    totalUsers: users.length,
    activeSubscriptions: usersWithSubscriptions.filter(u => u.status === 'active').length,
    totalMRR: usersWithSubscriptions.reduce((sum, user) => {
      if (user.status !== 'active') return sum;
      // Convert yearly costs to monthly for MRR
      return sum + (user.interval === 'monthly' ? user.cost : user.cost / 12);
    }, 0),
    totalWebsites: users.filter(user => user.website).length,
    // Calculate total yearly gains from active subscriptions using Stripe amounts
    totalGains: usersWithSubscriptions.reduce((sum, user) => {
      if (user.status !== 'active') return sum;
      // Convert monthly costs to yearly for total gains
      return sum + (user.interval === 'monthly' ? user.cost * 12 : user.cost);
    }, 0),
    // Calculate total yearly losses from canceled subscriptions using Stripe amounts
    totalLosses: usersWithSubscriptions.reduce((sum, user) => {
      if (user.status !== 'canceled') return sum;
      // Convert monthly costs to yearly for total losses
      return sum + (user.interval === 'monthly' ? user.cost * 12 : user.cost);
    }, 0),
  };

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader
        heading="Admin Dashboard"
        text="Manage and monitor user subscriptions and websites."
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(stats.totalMRR)}</div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWebsites}</div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Yearly Gains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">${Math.round(stats.totalGains)}</div>
            <p className="text-xs text-muted-foreground mt-1">From active subscriptions</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Yearly Losses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">${Math.round(stats.totalLosses)}</div>
            <p className="text-xs text-muted-foreground mt-1">From canceled subscriptions</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users & Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={usersWithSubscriptions} />
        </CardContent>
      </Card>
    </div>
  );
}

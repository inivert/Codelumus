import { redirect } from "next/navigation";
import { DollarSign, Users, CreditCard, TrendingUp } from "lucide-react";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStripeStats, getRecentTransactions, getSubscribedUsers } from "@/lib/admin";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata = constructMetadata({
  title: "Admin",
  description: "Admin page for only admin management.",
});

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'default';
    case 'canceled':
      return 'destructive';
    case 'trialing':
      return 'warning';
    case 'past_due':
      return 'destructive';
    default:
      return 'secondary';
  }
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const stats = await getStripeStats();
  const transactions = await getRecentTransactions();
  const subscribers = await getSubscribedUsers();

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <DashboardHeader
        heading="Admin Panel"
        text="Access only for users with ADMIN role."
      />
      
      <div className="flex flex-1 flex-col gap-5 p-4 md:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue (30d)</CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalRevenue.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">+{stats?.subscriptionGrowth.toFixed(1) || '0'}% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CreditCard className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeSubscriptions || 0}</div>
              <p className="text-xs text-muted-foreground">Active paying customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats?.subscriptionGrowth.toFixed(1) || '0'}%</div>
              <p className="text-xs text-muted-foreground">Month over month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] md:h-[500px]">
              {/* Mobile View */}
              <div className="grid gap-4 md:hidden">
                {transactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="grid gap-2 p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{transaction.customer.name}</div>
                        <Badge variant={transaction.status === 'succeeded' ? 'default' : 'destructive'}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.customer.email}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{transaction.type}</span>
                        <span className="font-medium">${transaction.amount.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(transaction.created)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="font-medium">{transaction.customer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.customer.email}
                          </div>
                        </TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === 'succeeded' ? 'default' : 'destructive'}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(transaction.created)}</TableCell>
                        <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Subscribed Users */}
        <Card>
          <CardHeader>
            <CardTitle>Subscribed Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] md:h-[500px]">
              {/* Mobile View */}
              <div className="grid gap-4 md:hidden">
                {subscribers.map((subscriber) => (
                  <Card key={subscriber.id}>
                    <CardContent className="grid gap-2 p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{subscriber.name}</div>
                        <Badge variant={getStatusColor(subscriber.status)}>
                          {subscriber.status}
                          {subscriber.cancelAtPeriodEnd && ' (Canceling)'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {subscriber.email}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Plan: </span>
                        {subscriber.stripePriceId}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Next Payment: </span>
                        {formatDate(subscriber.stripeCurrentPeriodEnd)}
                      </div>
                      {(subscriber.cancelAt || subscriber.cancelAtPeriodEnd) && (
                        <div className="text-sm text-muted-foreground">
                          {subscriber.cancelAt
                            ? `Cancels on ${formatDate(subscriber.cancelAt)}`
                            : 'Cancels at period end'}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Payment</TableHead>
                      <TableHead>Cancellation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell>
                          <div className="font-medium">{subscriber.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {subscriber.email}
                          </div>
                        </TableCell>
                        <TableCell>{subscriber.stripePriceId}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(subscriber.status)}>
                            {subscriber.status}
                            {subscriber.cancelAtPeriodEnd && ' (Canceling)'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(subscriber.stripeCurrentPeriodEnd)}</TableCell>
                        <TableCell>
                          {subscriber.cancelAt ? (
                            <span className="text-sm text-muted-foreground">
                              Cancels on {formatDate(subscriber.cancelAt)}
                            </span>
                          ) : subscriber.cancelAtPeriodEnd ? (
                            <span className="text-sm text-muted-foreground">
                              Cancels at period end
                            </span>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

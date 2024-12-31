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
    <>
      <DashboardHeader
        heading="Admin Panel"
        text="Access only for users with ADMIN role."
      />
      <div className="flex flex-col gap-5">
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

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscribed Users</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}

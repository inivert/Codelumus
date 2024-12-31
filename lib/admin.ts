import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { unstable_cache } from 'next/cache';

// Cache the stats for 5 minutes
export const getStripeStats = unstable_cache(
  async () => {
    try {
      const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
      const sixtyDaysAgo = Math.floor(Date.now() / 1000) - (60 * 24 * 60 * 60);

      // Fetch all data in parallel
      const [
        customers,
        activeSubscriptions,
        charges,
        previousMonthSubscriptions
      ] = await Promise.all([
        stripe.customers.list({ limit: 100 }),
        stripe.subscriptions.list({ status: 'active', limit: 100 }),
        stripe.charges.list({ created: { gte: thirtyDaysAgo }, limit: 100 }),
        stripe.subscriptions.list({
          created: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
          limit: 100,
        })
      ]);

      const totalCustomers = customers.data.length;
      const activeSubscriptionsCount = activeSubscriptions.data.length;
      const totalRevenue = charges.data.reduce((acc, charge) => acc + charge.amount, 0) / 100;

      // Calculate growth rate
      let subscriptionGrowth = 0;
      const prevCount = previousMonthSubscriptions.data.length;
      if (prevCount === 0) {
        subscriptionGrowth = activeSubscriptionsCount > 0 ? 100 : 0;
      } else {
        subscriptionGrowth = ((activeSubscriptionsCount - prevCount) / prevCount) * 100;
      }

      return {
        totalCustomers,
        activeSubscriptions: activeSubscriptionsCount,
        totalRevenue,
        subscriptionGrowth
      };
    } catch (error) {
      console.error("Error fetching Stripe stats:", error);
      return null;
    }
  },
  ['stripe-stats'],
  { revalidate: 300 } // Cache for 5 minutes
);

// Cache transactions for 1 minute
export const getRecentTransactions = unstable_cache(
  async () => {
    try {
      const charges = await stripe.charges.list({
        limit: 10,
        expand: ['data.customer'],
      });

      return charges.data.map(charge => ({
        id: charge.id,
        amount: charge.amount / 100,
        status: charge.status,
        customer: {
          name: charge.customer?.name || 'Unknown',
          email: charge.customer?.email || 'Unknown',
        },
        created: new Date(charge.created * 1000).toISOString(),
        type: charge.refunded ? 'Refund' : 'Charge'
      }));
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
      return [];
    }
  },
  ['stripe-transactions'],
  { revalidate: 60 } // Cache for 1 minute
);

// Cache subscribed users for 1 minute
export const getSubscribedUsers = unstable_cache(
  async () => {
    try {
      // Get all users who have ever had a subscription
      const users = await prisma.user.findMany({
        where: {
          stripeCustomerId: {
            not: null
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          stripeSubscriptionId: true,
          stripeCustomerId: true,
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
        }
      });

      // Batch fetch subscriptions in groups of 10 to avoid rate limits
      const batchSize = 10;
      const usersWithStatus = [];

      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        const batchPromises = batch.map(async (user) => {
          if (!user.stripeSubscriptionId) {
            return {
              ...user,
              status: 'canceled',
              cancelAt: null,
              cancelAtPeriodEnd: false
            };
          }

          try {
            const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
            return {
              ...user,
              status: subscription.status,
              cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
              cancelAtPeriodEnd: subscription.cancel_at_period_end
            };
          } catch (error) {
            console.error(`Error fetching subscription for user ${user.id}:`, error);
            return {
              ...user,
              status: 'error',
              cancelAt: null,
              cancelAtPeriodEnd: false
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        usersWithStatus.push(...batchResults);
      }

      return usersWithStatus;
    } catch (error) {
      console.error("Error fetching subscribed users:", error);
      return [];
    }
  },
  ['stripe-subscribed-users'],
  { revalidate: 60 } // Cache for 1 minute
); 
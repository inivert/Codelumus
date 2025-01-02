export interface AddOn {
  id: string;
  title: string;
  price: {
    monthly: number;
    yearly: number;
  };
  stripeIds: {
    monthly: string;
    yearly: string;
  };
  description: string;
  features: string[];
}

export interface SubscriptionPlan {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  prices: {
    monthly: number;
    yearly: number;
  };
  stripeIds: {
    monthly: string;
    yearly: string;
  };
}

export interface UserSubscriptionPlan extends SubscriptionPlan {
  stripePriceId: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  stripeCurrentPeriodEnd: number | null;
  isPaid: boolean;
  interval: string | null;
  isCanceled: boolean;
  activeAddons?: string[];
}

export interface PlansRow {
  feature: string;
  starter: string;
  tooltip?: string;
} 
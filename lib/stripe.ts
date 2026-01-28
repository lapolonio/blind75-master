import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

export const PLANS = {
  free: {
    name: 'Free',
    description: 'Access to 15 problems with basic solutions',
    price: 0,
    features: [
      '15 core problems',
      'Basic solutions',
      'Code editor',
      'Progress tracking',
    ],
    problemLimit: 15,
  },
  premium_monthly: {
    name: 'Premium Monthly',
    description: 'Full access to all 75 problems',
    price: 12,
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly',
    features: [
      'All 75 problems',
      'Detailed explanations',
      'Video solutions',
      'Custom visualizations',
      'Pattern recognition guides',
      'Priority support',
    ],
    problemLimit: 75,
  },
  premium_yearly: {
    name: 'Premium Yearly',
    description: 'Full access with 2 months free',
    price: 99,
    priceId: process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly',
    features: [
      'All 75 problems',
      'Detailed explanations',
      'Video solutions',
      'Custom visualizations',
      'Pattern recognition guides',
      'Priority support',
      '2 months free',
    ],
    problemLimit: 75,
  },
} as const;

export type PlanType = keyof typeof PLANS;

export async function createCheckoutSession(
  customerId: string | null,
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId || undefined,
    customer_email: customerId ? undefined : undefined,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId);
}

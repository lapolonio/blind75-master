import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    console.error('Webhook signature verification failed:', (error as Error).message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId && session.subscription) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscription: 'premium',
              stripeSubscriptionId: session.subscription as string,
            },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (user) {
          const status = subscription.status === 'active' ? 'premium' : 'free';
          await prisma.user.update({
            where: { id: user.id },
            data: { subscription: status },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscription: 'free',
              stripeSubscriptionId: null,
            },
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        // In Stripe API, subscription can be string | Subscription | null
        const subscriptionId = (invoice as { subscription?: string | Stripe.Subscription | null }).subscription;
        const finalSubscriptionId = typeof subscriptionId === 'string' 
          ? subscriptionId 
          : subscriptionId?.id;

        if (finalSubscriptionId) {
          const user = await prisma.user.findFirst({
            where: { stripeSubscriptionId: finalSubscriptionId },
          });

          if (user) {
            // Optionally send an email notification about payment failure
            console.log(`Payment failed for user ${user.id}`);
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

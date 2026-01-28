'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Plan {
  name: string;
  description: string;
  price: number;
  priceId?: string;
  features: string[];
  problemLimit: number;
}

interface PricingCardsProps {
  currentPlan: string;
  isAuthenticated: boolean;
  plans: Record<string, Plan>;
}

export function PricingCards({ currentPlan, isAuthenticated, plans }: PricingCardsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async (planKey: string) => {
    if (!isAuthenticated) {
      router.push('/signup');
      return;
    }

    if (planKey === 'free') {
      router.push('/problems');
      return;
    }

    setIsLoading(planKey);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const displayPlans = [
    { key: 'free', ...plans.free },
    {
      key: billingPeriod === 'monthly' ? 'premium_monthly' : 'premium_yearly',
      ...(billingPeriod === 'monthly' ? plans.premium_monthly : plans.premium_yearly),
      popular: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setBillingPeriod('monthly')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            billingPeriod === 'monthly'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingPeriod('yearly')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            billingPeriod === 'yearly'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Yearly
          <Badge variant="secondary" className="ml-2">
            Save 31%
          </Badge>
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {displayPlans.map((plan) => {
          const isCurrentPlan =
            currentPlan === 'premium'
              ? plan.key.includes('premium')
              : plan.key === currentPlan;

          return (
            <Card
              key={plan.key}
              className={cn(
                'relative flex flex-col',
                plan.popular && 'border-primary shadow-lg'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.key)}
                  disabled={isLoading === plan.key || isCurrentPlan}
                >
                  {isLoading === plan.key ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : plan.price === 0 ? (
                    'Get Started Free'
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

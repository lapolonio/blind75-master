import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PLANS } from '@/lib/stripe';
import { PricingCards } from './PricingCards';

export const metadata: Metadata = {
  title: 'Pricing - Blind75 Master',
  description: 'Choose the plan that fits your learning needs',
};

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const currentPlan = session?.user?.subscription || 'free';

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your learning needs. Start free and upgrade
          when you&apos;re ready for more.
        </p>
      </div>

      <PricingCards
        currentPlan={currentPlan}
        isAuthenticated={!!session}
        plans={PLANS}
      />

      {/* FAQ Section */}
      <div className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">
              What&apos;s included in the free tier?
            </h3>
            <p className="text-muted-foreground">
              The free tier includes access to 15 fundamental problems across
              various categories, basic solutions, the code editor, and progress
              tracking. It&apos;s perfect for getting started with coding
              interview preparation.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">
              Can I cancel my subscription anytime?
            </h3>
            <p className="text-muted-foreground">
              Yes, you can cancel your subscription at any time. You&apos;ll
              continue to have access to premium features until the end of your
              billing period.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">
              Is there a refund policy?
            </h3>
            <p className="text-muted-foreground">
              We offer a 7-day money-back guarantee. If you&apos;re not
              satisfied with the premium features, contact us within 7 days for
              a full refund.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">
              Do you offer team or enterprise plans?
            </h3>
            <p className="text-muted-foreground">
              Yes! We offer special pricing for teams and educational
              institutions. Contact us for more information about group
              discounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

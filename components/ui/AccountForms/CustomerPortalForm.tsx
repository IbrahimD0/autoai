'use client';

import { Button } from '@/components/ui/Button';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '@/utils/stripe/server';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Tables } from '@/types_db';
import { CreditCard, ExternalLink } from 'lucide-react';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

export default function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Subscription Plan</h3>
              <p className="text-sm text-gray-600">
                {subscription
                  ? `${subscription?.prices?.products?.name} plan`
                  : 'No active subscription'}
              </p>
            </div>
          </div>
          {subscription && (
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {subscriptionPrice}
              </div>
              <div className="text-sm text-gray-500">
                per {subscription?.prices?.interval}
              </div>
            </div>
          )}
        </div>

        {!subscription && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-800">
              Subscribe to unlock all features and start accepting orders online.
            </p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-600">
            {subscription ? 'Manage billing and payment methods' : 'Choose a plan to get started'}
          </p>
          {subscription ? (
            <Button
              onClick={handleStripePortalRequest}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white inline-flex items-center gap-2"
            >
              {isSubmitting ? 'Loading...' : 'Manage Subscription'}
              <ExternalLink className="w-4 h-4" />
            </Button>
          ) : (
            <Link href="/">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                View Plans
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

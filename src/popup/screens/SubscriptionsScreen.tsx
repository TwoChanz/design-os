// =============================================================================
// SubscriptionsScreen — Subscription list with monthly total
// =============================================================================

import React, { useState, useEffect } from 'react';
import type { PopupContext, PopupEvent, Subscription } from '../../state-machine/types';
import { storage } from '../../storage/adapter';
import { SubscriptionRow } from '../components/SubscriptionRow';
import { IconContainer } from '../components/IconContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { Spinner } from '../components/Spinner';
import { TextLink } from '../components/TextLink';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

export function SubscriptionsScreen({ context, send }: Props) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([storage.getSubscriptions(), storage.getMonthlyTotal()]).then(([subs, total]) => {
      setSubscriptions(subs);
      setMonthlyTotal(total);
      setLoading(false);
    });
  }, [context.subscriptionCount]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Empty state
  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] px-6 py-8 text-center">
        <IconContainer icon="credit-card" color="slate" size="lg" />

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-5 mb-2">
          No subscriptions yet
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-[240px]">
          Track your recurring costs in one place
        </p>

        <PrimaryButton onClick={() => send({ type: 'ADD_SUBSCRIPTION' })}>
          Add subscription
        </PrimaryButton>
      </div>
    );
  }

  // Count active subscriptions
  const activeCount = subscriptions.filter((s) => s.status === 'active').length;

  return (
    <div className="px-4 py-4">
      {/* Monthly Total Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-4 mb-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-blue-100">Monthly Total</div>
            <div className="text-3xl font-bold mt-1">
              ${monthlyTotal.toFixed(2)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">
              {activeCount} active
            </div>
            <div className="text-xs text-blue-200 mt-1">
              {subscriptions.length} total
            </div>
          </div>
        </div>
      </div>

      {/* Add button */}
      <div className="flex justify-end mb-3">
        <TextLink onClick={() => send({ type: 'ADD_SUBSCRIPTION' })} icon="plus">
          Add subscription
        </TextLink>
      </div>

      {/* Subscription List */}
      <div className="space-y-2">
        {subscriptions.map((sub) => (
          <SubscriptionRow
            key={sub.id}
            subscription={sub}
            onEdit={() => send({ type: 'EDIT_SUBSCRIPTION', payload: sub.id })}
            onDelete={() => send({ type: 'DELETE_SUBSCRIPTION', payload: sub.id })}
          />
        ))}
      </div>
    </div>
  );
}

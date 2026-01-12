// =============================================================================
// SubscriptionsScreen — Subscription list with monthly total
// =============================================================================

import React, { useState, useEffect } from 'react';
import type { PopupContext, PopupEvent, Subscription } from '../../state-machine/types';
import { storage } from '../../storage/adapter';
import { SubscriptionRow } from '../components/SubscriptionRow';

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
    return <div className="p-4 text-slate-500">Loading...</div>;
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Subscriptions</h2>
        <button
          onClick={() => send({ type: 'ADD_SUBSCRIPTION' })}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Add
        </button>
      </div>

      {/* Monthly Total */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <div className="text-sm text-blue-600">Monthly Total</div>
        <div className="text-2xl font-bold text-blue-700">${monthlyTotal.toFixed(2)}</div>
      </div>

      {/* Subscription List */}
      {subscriptions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-slate-400 mb-2">No subscriptions added</div>
          <button
            onClick={() => send({ type: 'ADD_SUBSCRIPTION' })}
            className="text-blue-600 hover:text-blue-700"
          >
            Add your first subscription
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
}

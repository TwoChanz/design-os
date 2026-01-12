// =============================================================================
// SubscriptionRow Component
// =============================================================================

import React from 'react';
import type { Subscription, SubscriptionStatus } from '../../state-machine/types';

interface SubscriptionRowProps {
  subscription: Subscription;
  onEdit: () => void;
  onDelete: () => void;
}

const statusConfig: Record<SubscriptionStatus, { bg: string; text: string; label: string }> = {
  active: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'Active',
  },
  paused: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    label: 'Paused',
  },
  canceled: {
    bg: 'bg-slate-100 dark:bg-slate-700',
    text: 'text-slate-500 dark:text-slate-400',
    label: 'Canceled',
  },
};

export function SubscriptionRow({ subscription, onEdit, onDelete }: SubscriptionRowProps) {
  const status = statusConfig[subscription.status];

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 group">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900 dark:text-white truncate">
              {subscription.name}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>
          {subscription.domain && (
            <div className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
              {subscription.domain}
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold text-slate-900 dark:text-white">
            ${subscription.monthlyCost.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">/month</div>
        </div>
      </div>

      {/* Actions (visible on hover/focus) */}
      <div className="flex gap-3 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

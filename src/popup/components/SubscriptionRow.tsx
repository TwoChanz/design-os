// =============================================================================
// SubscriptionRow Component
// =============================================================================

import React from 'react';
import type { Subscription } from '../../state-machine/types';

interface SubscriptionRowProps {
  subscription: Subscription;
  onEdit: () => void;
  onDelete: () => void;
}

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  paused: 'bg-amber-100 text-amber-700',
  canceled: 'bg-slate-100 text-slate-500',
};

export function SubscriptionRow({ subscription, onEdit, onDelete }: SubscriptionRowProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 group">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900 truncate">{subscription.name}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${statusColors[subscription.status]}`}>
              {subscription.status}
            </span>
          </div>
          {subscription.domain && (
            <div className="text-xs text-slate-400 truncate">{subscription.domain}</div>
          )}
        </div>
        <div className="text-right">
          <div className="font-semibold text-slate-900">
            ${subscription.monthlyCost.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400">/month</div>
        </div>
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="text-xs text-blue-600 hover:text-blue-700">
          Edit
        </button>
        <button onClick={onDelete} className="text-xs text-rose-600 hover:text-rose-700">
          Delete
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// ConfirmClearAllModal
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

export function ConfirmClearAllModal({ context, send }: Props) {
  return (
    <div className="p-4 space-y-4">
      <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
        <svg
          className="w-6 h-6 text-rose-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900">Clear all data?</h3>
        <p className="text-sm text-slate-500 mt-1">
          This will permanently delete all your saved scores and subscriptions. This action cannot
          be undone.
        </p>
      </div>

      <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Saved scores:</span>
          <span className="font-medium">{context.scoreReportCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Subscriptions:</span>
          <span className="font-medium">{context.subscriptionCount}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => send({ type: 'CANCEL' })}
          className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={() => send({ type: 'DELETE_CONFIRMED' })}
          className="flex-1 py-2 px-4 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

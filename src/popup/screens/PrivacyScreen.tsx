// =============================================================================
// PrivacyScreen — Privacy promise static view
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

export function PrivacyScreen({ context, send }: Props) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Privacy Promise</h2>

      <div className="space-y-4 text-sm text-slate-600">
        <div className="flex gap-3">
          <div className="text-emerald-500">✓</div>
          <div>
            <div className="font-medium text-slate-900">100% Local</div>
            <div>All data stays on your device. Nothing is sent to external servers.</div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="text-emerald-500">✓</div>
          <div>
            <div className="font-medium text-slate-900">No Account Required</div>
            <div>Use SubSense without creating an account or signing in.</div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="text-emerald-500">✓</div>
          <div>
            <div className="font-medium text-slate-900">No Tracking</div>
            <div>We don't collect analytics, usage data, or browsing history.</div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="text-emerald-500">✓</div>
          <div>
            <div className="font-medium text-slate-900">Open Scoring</div>
            <div>Our scoring rubric is transparent and evidence-based.</div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={() => send({ type: 'CLEAR_ALL_DATA' })}
          className="w-full text-rose-600 hover:bg-rose-50 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Clear all data
        </button>
        <p className="text-xs text-slate-400 text-center mt-2">
          This will delete all saved scores and subscriptions.
        </p>
      </div>
    </div>
  );
}

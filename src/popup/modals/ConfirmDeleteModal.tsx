// =============================================================================
// ConfirmDeleteModal
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

export function ConfirmDeleteModal({ context, send }: Props) {
  const isScore = context.selectedReportId !== null;
  const itemType = isScore ? 'score' : 'subscription';

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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900">Delete {itemType}?</h3>
        <p className="text-sm text-slate-500 mt-1">This action cannot be undone.</p>
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
          Delete
        </button>
      </div>
    </div>
  );
}

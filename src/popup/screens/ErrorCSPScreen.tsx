// =============================================================================
// ErrorCSPScreen — Page blocked by CSP or restrictions
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

export function ErrorCSPScreen({ context, send }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m0 0v2m0-2h2m-2 0H10m5-10V7a5 5 0 00-10 0v4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z"
          />
        </svg>
      </div>

      <h2 className="text-lg font-semibold text-slate-900 mb-2">Page blocked</h2>
      <p className="text-slate-500 text-sm mb-6">
        This page restricts automated analysis. You can still score it manually.
      </p>

      <button
        onClick={() => send({ type: 'ANSWER_MANUAL' })}
        className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Score manually
      </button>

      <button
        onClick={() => send({ type: 'BACK' })}
        className="mt-3 text-sm text-slate-500 hover:text-slate-700"
      >
        Go back
      </button>
    </div>
  );
}

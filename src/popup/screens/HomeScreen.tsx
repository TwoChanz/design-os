// =============================================================================
// HomeScreen — Initial state with "Score this page" CTA
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

export function HomeScreen({ context, send }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 className="text-xl font-semibold text-slate-900 mb-2">SubSense</h1>
      <p className="text-slate-500 text-sm mb-6">
        Check the transparency of this page's subscription terms
      </p>

      <button
        onClick={() => send({ type: 'SCORE_PAGE' })}
        className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Score this page
      </button>

      {context.scoreReportCount > 0 && (
        <button
          onClick={() => send({ type: 'VIEW_HISTORY' })}
          className="mt-3 text-sm text-blue-600 hover:text-blue-700"
        >
          View saved scores ({context.scoreReportCount})
        </button>
      )}
    </div>
  );
}

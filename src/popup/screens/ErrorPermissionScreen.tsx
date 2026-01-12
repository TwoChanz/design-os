// =============================================================================
// ErrorPermissionScreen — Extension lacks host permission
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

export function ErrorPermissionScreen({ context, send }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-amber-600"
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

      <h2 className="text-lg font-semibold text-slate-900 mb-2">Permission needed</h2>
      <p className="text-slate-500 text-sm mb-6">
        SubSense needs permission to analyze this page.
      </p>

      <button
        onClick={() => send({ type: 'GRANT_PERMISSION' })}
        className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Grant permission
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

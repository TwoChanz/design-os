// =============================================================================
// LoadingScreen — Scoring in progress
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

export function LoadingScreen({ context, send }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-16 h-16 mb-4 relative">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
      </div>

      <h2 className="text-lg font-medium text-slate-900 mb-2">Analyzing page...</h2>
      <p className="text-slate-500 text-sm">
        Checking pricing, trial terms, and cancellation info
      </p>
    </div>
  );
}

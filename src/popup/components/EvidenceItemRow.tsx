// =============================================================================
// EvidenceItemRow Component
// =============================================================================

import React from 'react';
import type { EvidenceItem } from '../../state-machine/types';

type EvidenceItemRowProps = EvidenceItem;

export function EvidenceItemRow({ label, value, confidence, source }: EvidenceItemRowProps) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <div className={`mt-0.5 ${value ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
        {value ? '✓' : '✗'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-700 dark:text-slate-300">{label}</div>
        <div className="flex gap-2 mt-1">
          <span
            className={`
              text-xs px-1.5 py-0.5 rounded
              ${confidence === 'high' ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' : ''}
              ${confidence === 'medium' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' : ''}
              ${confidence === 'low' ? 'border border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500' : ''}
            `}
          >
            {confidence}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {source === 'detected' ? 'Auto' : 'Manual'}
          </span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// EvidenceItemRow Component
// =============================================================================

import React from 'react';
import type { EvidenceItem } from '../../state-machine/types';

type EvidenceItemRowProps = EvidenceItem;

export function EvidenceItemRow({ label, value, confidence, source }: EvidenceItemRowProps) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-slate-100 last:border-0">
      <div className={`mt-0.5 ${value ? 'text-emerald-500' : 'text-rose-500'}`}>
        {value ? '✓' : '✗'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-700">{label}</div>
        <div className="flex gap-2 mt-1">
          <span
            className={`
              text-xs px-1.5 py-0.5 rounded
              ${confidence === 'high' ? 'bg-slate-200 text-slate-700' : ''}
              ${confidence === 'medium' ? 'bg-slate-100 text-slate-500' : ''}
              ${confidence === 'low' ? 'border border-slate-200 text-slate-400' : ''}
            `}
          >
            {confidence}
          </span>
          <span className="text-xs text-slate-400">
            {source === 'detected' ? '🔍 Auto' : '👤 Manual'}
          </span>
        </div>
      </div>
    </div>
  );
}

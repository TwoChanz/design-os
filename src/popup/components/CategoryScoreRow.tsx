// =============================================================================
// CategoryScoreRow Component
// =============================================================================

import React from 'react';
import type { CategoryScore } from '../../state-machine/types';

type CategoryScoreRowProps = CategoryScore;

function getBarColor(score: number): string {
  if (score >= 70) return 'bg-emerald-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-rose-500';
}

export function CategoryScoreRow({ label, score }: CategoryScoreRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-sm text-slate-600 truncate">{label}</div>
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getBarColor(score)} transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="w-8 text-sm text-slate-700 text-right">{score}</div>
    </div>
  );
}

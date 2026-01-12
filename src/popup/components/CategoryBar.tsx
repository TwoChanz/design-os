// =============================================================================
// CategoryBar Component — Horizontal bar + score for category breakdown
// =============================================================================

import React from 'react';
import type { CategoryScore } from '../../state-machine/types';

interface CategoryBarProps {
  category: CategoryScore;
}

function getBarColor(score: number): string {
  if (score >= 75) return 'bg-emerald-500 dark:bg-emerald-400';
  if (score >= 40) return 'bg-amber-500 dark:bg-amber-400';
  return 'bg-rose-500 dark:bg-rose-400';
}

export function CategoryBar({ category }: CategoryBarProps) {
  const barColor = getBarColor(category.score);

  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-sm text-slate-600 dark:text-slate-400 truncate">
        {category.label}
      </span>
      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-300`}
          style={{ width: `${category.score}%` }}
        />
      </div>
      <span className="w-8 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
        {category.score}
      </span>
    </div>
  );
}

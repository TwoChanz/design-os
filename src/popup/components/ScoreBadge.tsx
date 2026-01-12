// =============================================================================
// ScoreBadge Component
// =============================================================================

import React from 'react';
import type { RatingLabel } from '../../state-machine/types';

interface ScoreBadgeProps {
  score: number;
  label: RatingLabel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-14 h-14 text-lg',
  lg: 'w-20 h-20 text-2xl',
};

const colorClasses: Record<RatingLabel, { bg: string; text: string; border: string }> = {
  Clear: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  Mixed: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  Risky: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300' },
};

export function ScoreBadge({ score, label, size = 'md', showLabel = true }: ScoreBadgeProps) {
  const colors = colorClasses[label];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          ${sizeClasses[size]} ${colors.bg} ${colors.border}
          rounded-full border-2 flex items-center justify-center font-bold
        `}
      >
        <span className={colors.text}>{score}</span>
      </div>
      {showLabel && <span className={`text-sm font-medium ${colors.text}`}>{label}</span>}
    </div>
  );
}

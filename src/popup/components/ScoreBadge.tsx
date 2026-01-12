// =============================================================================
// ScoreBadge Component — Circular badge with score + label
// =============================================================================

import React from 'react';
import type { RatingLabel } from '../../state-machine/types';

interface ScoreBadgeProps {
  score: number;
  label: RatingLabel;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    container: 'w-12 h-12',
    score: 'text-lg',
    label: 'text-[10px]',
  },
  md: {
    container: 'w-20 h-20',
    score: 'text-2xl',
    label: 'text-xs',
  },
  lg: {
    container: 'w-28 h-28',
    score: 'text-4xl',
    label: 'text-sm',
  },
};

const labelColors: Record<RatingLabel, { bg: string; ring: string; score: string; label: string }> = {
  Clear: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    ring: 'ring-emerald-200 dark:ring-emerald-800',
    score: 'text-emerald-700 dark:text-emerald-300',
    label: 'text-emerald-600 dark:text-emerald-400',
  },
  Mixed: {
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    ring: 'ring-amber-200 dark:ring-amber-800',
    score: 'text-amber-700 dark:text-amber-300',
    label: 'text-amber-600 dark:text-amber-400',
  },
  Risky: {
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    ring: 'ring-rose-200 dark:ring-rose-800',
    score: 'text-rose-700 dark:text-rose-300',
    label: 'text-rose-600 dark:text-rose-400',
  },
};

export function ScoreBadge({ score, label, size = 'md' }: ScoreBadgeProps) {
  const sizes = sizeClasses[size];
  const colors = labelColors[label];

  return (
    <div
      className={`
        ${sizes.container} ${colors.bg} ${colors.ring}
        flex flex-col items-center justify-center
        rounded-full ring-2
      `}
    >
      <span className={`${sizes.score} ${colors.score} font-bold leading-none`}>
        {score}
      </span>
      <span className={`${sizes.label} ${colors.label} font-medium uppercase tracking-wide`}>
        {label}
      </span>
    </div>
  );
}

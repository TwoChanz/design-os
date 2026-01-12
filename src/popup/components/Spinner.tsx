// =============================================================================
// Spinner Component — Animated loading indicator
// =============================================================================

import React from 'react';

type SizeType = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SizeType;
}

const sizeClasses: Record<SizeType, string> = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

export function Spinner({ size = 'md' }: SpinnerProps) {
  const sizeClass = sizeClasses[size];

  return (
    <div className={`${sizeClass} relative`}>
      <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full" />
      <div className="absolute inset-0 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin" />
    </div>
  );
}

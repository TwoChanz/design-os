// =============================================================================
// LowConfidenceBanner Component — Amber banner for low confidence scores
// =============================================================================

import React from 'react';

interface LowConfidenceBannerProps {
  onAnswerQuestions: () => void;
}

export function LowConfidenceBanner({ onAnswerQuestions }: LowConfidenceBannerProps) {
  return (
    <button
      onClick={onAnswerQuestions}
      className="w-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-left hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
    >
      <p className="text-sm text-amber-800 dark:text-amber-200">
        <span className="font-medium">Low confidence</span>
        <span className="mx-1">—</span>
        Answer 3 questions to improve accuracy
      </p>
      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
        Tap to answer →
      </p>
    </button>
  );
}

// =============================================================================
// QuestionCard Component
// =============================================================================

import React from 'react';
import type { TriStateAnswer } from '../../state-machine/types';

interface QuestionCardProps {
  number?: number;
  question: string;
  selectedAnswer: TriStateAnswer | null;
  onAnswer: (answer: TriStateAnswer) => void;
  disabled?: boolean;
}

const ANSWERS: { value: TriStateAnswer; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not_sure', label: 'Not sure' },
];

export function QuestionCard({
  number,
  question,
  selectedAnswer,
  onAnswer,
  disabled = false,
}: QuestionCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
      {/* Question text */}
      <div className="text-sm font-medium text-slate-900 dark:text-white mb-3">
        {number && (
          <span className="text-slate-400 dark:text-slate-500 mr-1">{number}.</span>
        )}
        {question}
      </div>

      {/* Answer buttons */}
      <div className="flex gap-2">
        {ANSWERS.map(({ value, label }) => {
          const isSelected = selectedAnswer === value;
          return (
            <button
              key={value}
              onClick={() => onAnswer(value)}
              disabled={disabled}
              className={`
                flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  isSelected
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }
              `}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// QuestionCard Component
// =============================================================================

import React from 'react';
import type { TriStateAnswer } from '../../state-machine/types';

interface QuestionCardProps {
  question: string;
  selectedAnswer: TriStateAnswer | null;
  onAnswer: (answer: TriStateAnswer) => void;
}

const answers: { value: TriStateAnswer; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not_sure', label: 'Not sure' },
];

export function QuestionCard({ question, selectedAnswer, onAnswer }: QuestionCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="text-sm font-medium text-slate-900 mb-3">{question}</div>
      <div className="flex gap-2">
        {answers.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onAnswer(value)}
            className={`
              flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors
              ${
                selectedAnswer === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

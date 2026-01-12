// =============================================================================
// EvidencePromptScreen — 3-question form for manual input
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent, TriStateAnswer } from '../../state-machine/types';
import { QuestionCard } from '../components/QuestionCard';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

const questions = [
  { id: 'price_clarity', question: 'Was the price easy to find?' },
  { id: 'trial_clarity', question: 'Were trial terms clearly explained?' },
  { id: 'cancel_clarity', question: 'Were cancellation steps clear?' },
];

export function EvidencePromptScreen({ context, send }: Props) {
  const responses = context.evidenceResponses ?? [];

  const getAnswer = (questionId: string): TriStateAnswer | null => {
    return responses.find((r) => r.questionId === questionId)?.answer ?? null;
  };

  const allAnswered = questions.every((q) => getAnswer(q.id) !== null);

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={() => send({ type: 'BACK' })}
        disabled={context.isSubmitting}
        className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50"
      >
        ← Back
      </button>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">Help us score this page</h2>
        <p className="text-sm text-slate-500 mt-1">
          Answer these questions to improve the accuracy of the score.
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q.question}
            selectedAnswer={getAnswer(q.id)}
            onAnswer={(answer) =>
              send({ type: 'SET_ANSWER', payload: { questionId: q.id, answer } })
            }
          />
        ))}
      </div>

      <button
        onClick={() => send({ type: 'SUBMIT' })}
        disabled={!allAnswered || context.isSubmitting}
        className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {context.isSubmitting ? 'Updating score...' : 'Update Score'}
      </button>
    </div>
  );
}

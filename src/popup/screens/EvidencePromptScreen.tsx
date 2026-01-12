// =============================================================================
// EvidencePromptScreen — 3-question form for manual input
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent, TriStateAnswer } from '../../state-machine/types';
import { DomainPill } from '../components/DomainPill';
import { QuestionCard } from '../components/QuestionCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextLink } from '../components/TextLink';
import { PrivacyNote } from '../components/PrivacyNote';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

const QUESTIONS = [
  { id: 'price_clarity', question: 'Was the price easy to find in under 30 seconds?' },
  { id: 'trial_clarity', question: 'Were trial/free tier limits clearly explained?' },
  { id: 'cancel_clarity', question: 'Were cancellation steps easy to find?' },
];

export function EvidencePromptScreen({ context, send }: Props) {
  const responses = context.evidenceResponses ?? [];
  const domain = context.currentDomain ?? context.currentScoreReport?.domain ?? 'Unknown page';

  const getAnswer = (questionId: string): TriStateAnswer | null => {
    return responses.find((r) => r.questionId === questionId)?.answer ?? null;
  };

  const allAnswered = QUESTIONS.every((q) => getAnswer(q.id) !== null);
  const answeredCount = QUESTIONS.filter((q) => getAnswer(q.id) !== null).length;

  return (
    <div className="flex flex-col min-h-[320px] px-6 py-6">
      {/* Domain indicator */}
      <div className="flex justify-center">
        <DomainPill domain={domain} />
      </div>

      {/* Header */}
      <div className="text-center mt-5 mb-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Help improve accuracy
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          3 quick questions
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-3 flex-1">
        {QUESTIONS.map((q, index) => (
          <QuestionCard
            key={q.id}
            number={index + 1}
            question={q.question}
            selectedAnswer={getAnswer(q.id)}
            onAnswer={(answer) =>
              send({ type: 'SET_ANSWER', payload: { questionId: q.id, answer } })
            }
            disabled={context.isSubmitting}
          />
        ))}
      </div>

      {/* Submit button */}
      <div className="mt-5">
        <PrimaryButton
          onClick={() => send({ type: 'SUBMIT' })}
          disabled={!allAnswered || context.isSubmitting}
          loading={context.isSubmitting}
        >
          {context.isSubmitting ? 'Updating score...' : `Update Score (${answeredCount}/3)`}
        </PrimaryButton>
      </div>

      {/* Back link */}
      <div className="mt-4 flex justify-center">
        <TextLink
          onClick={() => send({ type: 'BACK' })}
          icon="arrow-left"
          disabled={context.isSubmitting}
        >
          Go back without saving
        </TextLink>
      </div>

      {/* Privacy note */}
      <div className="mt-4">
        <PrivacyNote text="Answers stored locally only" />
      </div>
    </div>
  );
}

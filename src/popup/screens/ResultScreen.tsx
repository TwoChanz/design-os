// =============================================================================
// ResultScreen — Score result displayed
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';
import { DomainPill } from '../components/DomainPill';
import { ScoreBadge } from '../components/ScoreBadge';
import { CategoryBar } from '../components/CategoryBar';
import { EvidenceList } from '../components/EvidenceList';
import { LowConfidenceBanner } from '../components/LowConfidenceBanner';
import { ActionButton } from '../components/ActionButton';
import { TextLink } from '../components/TextLink';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
  canGoBack: () => boolean;
}

export function ResultScreen({ context, send, canGoBack }: Props) {
  const report = context.currentScoreReport;

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[320px] p-6">
        <p className="text-slate-500 dark:text-slate-400">No score data</p>
      </div>
    );
  }

  const isLowConfidence = report.confidence === 'low';

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Domain pill with external link */}
      <div className="flex justify-center">
        <DomainPill domain={report.domain} url={report.url} showExternalLink />
      </div>

      {/* Score Badge - centered */}
      <div className="flex justify-center py-2">
        <ScoreBadge score={report.overallScore} label={report.ratingLabel} size="lg" />
      </div>

      {/* Low confidence banner */}
      {isLowConfidence && (
        <LowConfidenceBanner onAnswerQuestions={() => send({ type: 'ANSWER_QUESTIONS' })} />
      )}

      {/* Category breakdown card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
        <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
          Category Breakdown
        </h3>
        <div className="space-y-3">
          {report.categoryScores.map((category) => (
            <CategoryBar key={category.category} category={category} />
          ))}
        </div>
      </div>

      {/* Evidence card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
        <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
          Evidence Found
        </h3>
        <EvidenceList items={report.evidenceItems} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <ActionButton
          onClick={() => send({ type: 'SAVE' })}
          disabled={context.isSaving}
          loading={context.isSaving}
          variant={context.isSaving ? 'default' : 'default'}
        >
          {context.isSaving ? 'Saving...' : 'Save'}
        </ActionButton>

        <ActionButton
          onClick={() => send({ type: 'SHARE' })}
          disabled={context.isSharing}
          loading={context.isSharing}
        >
          {context.isSharing ? 'Generating...' : 'Share'}
        </ActionButton>

        <ActionButton onClick={() => send({ type: 'ADD_SUBSCRIPTION' })}>
          Track
        </ActionButton>
      </div>

      {/* View history link */}
      <div className="flex justify-center pt-2">
        <TextLink onClick={() => send({ type: 'VIEW_HISTORY' })} icon="history">
          View my scores
        </TextLink>
      </div>
    </div>
  );
}

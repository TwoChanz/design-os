// =============================================================================
// ResultScreen — Score result displayed
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';
import { ScoreBadge } from '../components/ScoreBadge';
import { CategoryScoreRow } from '../components/CategoryScoreRow';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
  canGoBack: () => boolean;
}

export function ResultScreen({ context, send, canGoBack }: Props) {
  const report = context.currentScoreReport;

  if (!report) {
    return <div className="p-4 text-slate-500">No score data</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header with back button */}
      {canGoBack() && (
        <button
          onClick={() => send({ type: 'BACK' })}
          disabled={context.isSaving}
          className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50"
        >
          ← Back
        </button>
      )}

      {/* Score Badge */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{report.domain}</div>
          <ScoreBadge score={report.overallScore} label={report.ratingLabel} size="lg" />
        </div>
      </div>

      {/* Low confidence notice */}
      {report.confidence === 'low' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">
            Low confidence score. Help improve it by answering a few questions.
          </p>
          <button
            onClick={() => send({ type: 'ANSWER_QUESTIONS' })}
            className="mt-2 text-sm font-medium text-amber-700 hover:text-amber-800"
          >
            Answer questions →
          </button>
        </div>
      )}

      {/* Category Scores */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700">Category Breakdown</h3>
        {report.categoryScores.map((cat) => (
          <CategoryScoreRow key={cat.category} {...cat} />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => send({ type: 'SAVE' })}
          disabled={context.isSaving}
          className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {context.isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={() => send({ type: 'SHARE' })}
          disabled={context.isSharing}
          className="flex-1 border border-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          {context.isSharing ? 'Sharing...' : 'Share'}
        </button>
      </div>

      {/* Add to subscriptions */}
      <button
        onClick={() => send({ type: 'ADD_SUBSCRIPTION' })}
        className="w-full text-sm text-blue-600 hover:text-blue-700"
      >
        + Track this subscription
      </button>
    </div>
  );
}

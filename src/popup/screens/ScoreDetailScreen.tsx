// =============================================================================
// ScoreDetailScreen — Single score report detail view
// =============================================================================

import React, { useState, useEffect } from 'react';
import type { PopupContext, PopupEvent, ScoreReport } from '../../state-machine/types';
import { storage } from '../../storage/adapter';
import { ScoreBadge } from '../components/ScoreBadge';
import { CategoryScoreRow } from '../components/CategoryScoreRow';
import { EvidenceItemRow } from '../components/EvidenceItemRow';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

export function ScoreDetailScreen({ context, send }: Props) {
  const [report, setReport] = useState<ScoreReport | null>(null);

  useEffect(() => {
    if (context.selectedReportId) {
      storage.getScoreReport(context.selectedReportId).then(setReport);
    }
  }, [context.selectedReportId]);

  if (!report) {
    return <div className="p-4 text-slate-500">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={() => send({ type: 'BACK' })}
        className="text-sm text-slate-500 hover:text-slate-700"
      >
        ← Back to My Scores
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{report.domain}</h2>
            <div className="text-xs text-slate-500">
              {new Date(report.createdAt).toLocaleString()}
            </div>
          </div>
          <ScoreBadge score={report.overallScore} label={report.ratingLabel} size="lg" />
        </div>
        <a
          href={report.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline truncate block"
        >
          {report.url}
        </a>
      </div>

      {/* Category Scores */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700">Categories</h3>
        {report.categoryScores.map((cat) => (
          <CategoryScoreRow key={cat.category} {...cat} />
        ))}
      </div>

      {/* Evidence Items */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700">Evidence</h3>
        {report.evidenceItems.map((item) => (
          <EvidenceItemRow key={item.key} {...item} />
        ))}
      </div>

      {/* Notes */}
      {report.notes && (
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-xs text-slate-500 mb-1">Notes</div>
          <div className="text-sm text-slate-700">{report.notes}</div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => send({ type: 'SHARE' })}
          disabled={context.isSharing}
          className="flex-1 border border-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 disabled:opacity-50"
        >
          {context.isSharing ? 'Sharing...' : 'Share'}
        </button>
        <button
          onClick={() => send({ type: 'DELETE' })}
          className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

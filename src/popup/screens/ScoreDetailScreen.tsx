// =============================================================================
// ScoreDetailScreen — Single score report detail view
// =============================================================================

import React, { useState, useEffect } from 'react';
import type { PopupContext, PopupEvent, ScoreReport } from '../../state-machine/types';
import { storage } from '../../storage/adapter';
import { ScoreBadge } from '../components/ScoreBadge';
import { CategoryBar } from '../components/CategoryBar';
import { EvidenceList } from '../components/EvidenceList';
import { DomainPill } from '../components/DomainPill';
import { TextLink } from '../components/TextLink';
import { ActionButton } from '../components/ActionButton';
import { Spinner } from '../components/Spinner';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function ScoreDetailScreen({ context, send }: Props) {
  const [report, setReport] = useState<ScoreReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (context.selectedReportId) {
      storage.getScoreReport(context.selectedReportId).then((data) => {
        setReport(data);
        setLoading(false);
      });
    }
  }, [context.selectedReportId]);

  if (loading || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Back link */}
      <TextLink onClick={() => send({ type: 'BACK' })} icon="arrow-left">
        Back to My Scores
      </TextLink>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <DomainPill domain={report.domain} />
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {formatDate(report.createdAt)}
          </div>
        </div>
        <ScoreBadge score={report.overallScore} label={report.ratingLabel} size="lg" />
      </div>

      {/* URL link */}
      <a
        href={report.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate block"
      >
        {report.url}
      </a>

      {/* Category Scores */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Category Breakdown
        </h3>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-3">
          {report.categoryScores.map((cat) => (
            <CategoryBar key={cat.category} label={cat.label} score={cat.score} />
          ))}
        </div>
      </div>

      {/* Evidence Items */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Evidence ({report.evidenceItems.length})
        </h3>
        <EvidenceList items={report.evidenceItems} />
      </div>

      {/* Notes */}
      {report.notes && (
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Notes</div>
          <div className="text-sm text-slate-700 dark:text-slate-300">{report.notes}</div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <ActionButton
          icon="share"
          onClick={() => send({ type: 'SHARE' })}
          disabled={context.isSharing}
          loading={context.isSharing}
        >
          Share
        </ActionButton>
        <ActionButton
          icon="trash"
          onClick={() => send({ type: 'DELETE' })}
          variant="danger"
        >
          Delete
        </ActionButton>
      </div>
    </div>
  );
}

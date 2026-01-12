// =============================================================================
// MyScoresScreen — List of saved score reports
// =============================================================================

import React, { useState, useEffect } from 'react';
import type { PopupContext, PopupEvent, ScoreReport } from '../../state-machine/types';
import { storage } from '../../storage/adapter';
import { ScoreBadge } from '../components/ScoreBadge';
import { IconContainer } from '../components/IconContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { Spinner } from '../components/Spinner';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function MyScoresScreen({ context, send }: Props) {
  const [reports, setReports] = useState<ScoreReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.getScoreReports().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, [context.scoreReportCount]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] px-6 py-8 text-center">
        <IconContainer icon="clipboard-list" color="slate" size="lg" />

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-5 mb-2">
          No saved scores
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-[240px]">
          Score a page to see it here
        </p>

        <PrimaryButton onClick={() => send({ type: 'SCORE_PAGE' })}>
          Score this page
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      {/* Score count */}
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
        {reports.length} saved score{reports.length !== 1 ? 's' : ''}
      </div>

      {/* Score list */}
      <div className="space-y-2">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => send({ type: 'SELECT_REPORT', payload: report.id })}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-left hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-slate-900 dark:text-white truncate">
                  {report.domain}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatRelativeTime(report.createdAt)}
                  </span>
                  {report.confidence !== 'high' && (
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      {report.confidence} confidence
                    </span>
                  )}
                </div>
              </div>
              <ScoreBadge score={report.overallScore} label={report.ratingLabel} size="sm" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

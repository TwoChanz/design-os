// =============================================================================
// MyScoresScreen — List of saved score reports
// =============================================================================

import React, { useState, useEffect } from 'react';
import type { PopupContext, PopupEvent, ScoreReport } from '../../state-machine/types';
import { storage } from '../../storage/adapter';
import { ScoreBadge } from '../components/ScoreBadge';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
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
    return <div className="p-4 text-slate-500">Loading...</div>;
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">No saved scores</h2>
        <p className="text-slate-500 text-sm mb-4">Score a page to see it here.</p>
        <button
          onClick={() => send({ type: 'SCORE_PAGE' })}
          className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Score this page
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">My Scores</h2>

      <div className="space-y-2">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => send({ type: 'SELECT_REPORT', payload: report.id })}
            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-left hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-slate-900 truncate">{report.domain}</div>
                <div className="text-xs text-slate-500">
                  {new Date(report.createdAt).toLocaleDateString()}
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

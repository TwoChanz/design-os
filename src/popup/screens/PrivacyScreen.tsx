// =============================================================================
// PrivacyScreen — Privacy promise static view
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';
import { IconContainer } from '../components/IconContainer';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

interface PrivacyItemProps {
  title: string;
  description: string;
}

function PrivacyItem({ title, description }: PrivacyItemProps) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
        <svg
          className="w-3 h-3 text-emerald-600 dark:text-emerald-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <div className="font-medium text-slate-900 dark:text-white">{title}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</div>
      </div>
    </div>
  );
}

const PRIVACY_ITEMS = [
  {
    title: '100% Local',
    description: 'All data stays on your device. Nothing is sent to external servers.',
  },
  {
    title: 'No Account Required',
    description: 'Use SubSense without creating an account or signing in.',
  },
  {
    title: 'No Tracking',
    description: "We don't collect analytics, usage data, or browsing history.",
  },
  {
    title: 'Open Scoring',
    description: 'Our scoring rubric is transparent and evidence-based.',
  },
];

export function PrivacyScreen({ context, send }: Props) {
  const hasData = context.scoreReportCount > 0 || context.subscriptionCount > 0;

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <IconContainer icon="shield-check" color="emerald" size="md" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Privacy Promise
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your data, your control
          </p>
        </div>
      </div>

      {/* Privacy items */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-4">
        {PRIVACY_ITEMS.map((item) => (
          <PrivacyItem key={item.title} {...item} />
        ))}
      </div>

      {/* Data summary */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Your Local Data
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {context.scoreReportCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Saved Scores
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {context.subscriptionCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Subscriptions
            </div>
          </div>
        </div>
      </div>

      {/* Clear all data */}
      <div className="pt-2">
        <button
          onClick={() => send({ type: 'CLEAR_ALL_DATA' })}
          disabled={!hasData}
          className={`
            w-full font-medium py-2.5 px-4 rounded-xl transition-colors
            ${hasData
              ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20'
              : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }
          `}
        >
          Clear all data
        </button>
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">
          Permanently delete all saved scores and subscriptions
        </p>
      </div>
    </div>
  );
}

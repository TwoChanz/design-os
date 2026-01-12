// =============================================================================
// EvidenceList Component — List of evidence items with confidence + source
// =============================================================================

import React from 'react';
import type { EvidenceItem, Confidence, EvidenceSource } from '../../state-machine/types';

interface EvidenceListProps {
  items: EvidenceItem[];
}

interface EvidenceItemRowProps {
  item: EvidenceItem;
}

const confidenceStyles: Record<Confidence, string> = {
  high: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  medium: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500',
  low: 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600',
};

const sourceStyles: Record<EvidenceSource, { bg: string; text: string; label: string }> = {
  detected: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    label: 'Auto',
  },
  user_input: {
    bg: 'bg-violet-50 dark:bg-violet-900/30',
    text: 'text-violet-600 dark:text-violet-400',
    label: 'You',
  },
};

function CheckIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SparklesIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function UserIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function EvidenceItemRow({ item }: EvidenceItemRowProps) {
  const isPositive = item.value;
  const Icon = isPositive ? CheckIcon : XIcon;
  const sourceStyle = sourceStyles[item.source];

  return (
    <div className="flex items-start gap-3 py-2">
      <div
        className={`
          mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
          ${isPositive
            ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
            : 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400'
          }
        `}
      >
        <Icon className="w-3 h-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
          {item.label}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`
              inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide
              ${confidenceStyles[item.confidence]}
            `}
          >
            {item.confidence}
          </span>
          <span
            className={`
              inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium
              ${sourceStyle.bg} ${sourceStyle.text}
            `}
          >
            {item.source === 'detected' ? (
              <SparklesIcon className="w-2.5 h-2.5" />
            ) : (
              <UserIcon className="w-2.5 h-2.5" />
            )}
            {sourceStyle.label}
          </span>
        </div>
      </div>
    </div>
  );
}

export function EvidenceList({ items }: EvidenceListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
        No evidence items
      </p>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {items.map((item) => (
        <EvidenceItemRow key={item.key} item={item} />
      ))}
    </div>
  );
}

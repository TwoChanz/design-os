// =============================================================================
// DomainPill Component — Displays current domain
// =============================================================================

import React from 'react';

interface DomainPillProps {
  domain: string;
  url?: string;
  showExternalLink?: boolean;
}

export function DomainPill({ domain, url, showExternalLink = false }: DomainPillProps) {
  const content = (
    <>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
        {domain}
      </span>
      {showExternalLink && (
        <svg
          className="w-3 h-3 text-slate-400 dark:text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </>
  );

  if (showExternalLink && url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
      {content}
    </div>
  );
}

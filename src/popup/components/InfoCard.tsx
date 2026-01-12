// =============================================================================
// InfoCard Component — Rounded card with bullet list
// =============================================================================

import React from 'react';

interface InfoCardProps {
  title?: string;
  items: string[];
}

export function InfoCard({ title, items }: InfoCardProps) {
  return (
    <div className="w-full max-w-[300px] bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4">
      {title && (
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
          {title}
        </p>
      )}
      <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-slate-400 dark:text-slate-500">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

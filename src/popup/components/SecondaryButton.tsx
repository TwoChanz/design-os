// =============================================================================
// SecondaryButton Component — Secondary action button
// =============================================================================

import React from 'react';

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export function SecondaryButton({
  children,
  onClick,
  disabled = false,
}: SecondaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl
        font-medium text-sm transition-colors
        ${disabled
          ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }
      `}
    >
      {children}
    </button>
  );
}

// =============================================================================
// PrimaryButton Component — Full-width CTA with loading state
// =============================================================================

import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  loadingText,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
        font-medium text-base transition-colors
        ${isDisabled
          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
        }
      `}
    >
      {loading && (
        <svg
          className="w-4 h-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}

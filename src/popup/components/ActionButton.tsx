// =============================================================================
// ActionButton Component — Secondary action button for result screen
// =============================================================================

import React from 'react';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'success';
}

export function ActionButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'default',
}: ActionButtonProps) {
  const isDisabled = disabled || loading;

  const variantClasses = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
    success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
        font-medium text-sm transition-colors
        ${isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : variantClasses[variant]
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
      {children}
    </button>
  );
}

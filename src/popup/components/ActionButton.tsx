// =============================================================================
// ActionButton Component — Secondary action button for result screen
// =============================================================================

import React from 'react';

type IconType = 'share' | 'trash' | 'save' | 'plus';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'success' | 'danger';
  icon?: IconType;
}

function ShareIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function SaveIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

const icons: Record<IconType, React.ComponentType<{ className: string }>> = {
  share: ShareIcon,
  trash: TrashIcon,
  save: SaveIcon,
  plus: PlusIcon,
};

export function ActionButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'default',
  icon,
}: ActionButtonProps) {
  const isDisabled = disabled || loading;
  const IconComponent = icon ? icons[icon] : null;

  const variantClasses = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
    success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50',
    danger: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/50',
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
      {loading ? (
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
      ) : (
        IconComponent && <IconComponent className="w-4 h-4" />
      )}
      {children}
    </button>
  );
}

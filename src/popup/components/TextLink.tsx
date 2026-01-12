// =============================================================================
// TextLink Component — Subtle link for secondary actions
// =============================================================================

import React from 'react';

type IconType = 'arrow-left' | 'external-link' | 'history';

interface TextLinkProps {
  children: React.ReactNode;
  onClick: () => void;
  icon?: IconType;
  disabled?: boolean;
}

function ArrowLeftIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

function HistoryIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

const icons: Record<IconType, React.ComponentType<{ className: string }>> = {
  'arrow-left': ArrowLeftIcon,
  'external-link': ExternalLinkIcon,
  history: HistoryIcon,
};

export function TextLink({ children, onClick, icon, disabled = false }: TextLinkProps) {
  const IconComponent = icon ? icons[icon] : null;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-1.5 text-sm transition-colors
        ${disabled
          ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }
      `}
    >
      {IconComponent && <IconComponent className="w-4 h-4" />}
      {children}
    </button>
  );
}

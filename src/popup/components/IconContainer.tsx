// =============================================================================
// IconContainer Component — Icon wrapper with background
// =============================================================================

import React from 'react';

type IconType = 'sparkles' | 'gauge' | 'shield-alert' | 'key-round';
type ColorType = 'slate' | 'amber' | 'emerald' | 'rose' | 'blue';
type SizeType = 'sm' | 'md' | 'lg';

interface IconContainerProps {
  icon: IconType;
  color?: ColorType;
  size?: SizeType;
}

const sizeClasses: Record<SizeType, { container: string; icon: string }> = {
  sm: { container: 'w-10 h-10', icon: 'w-5 h-5' },
  md: { container: 'w-12 h-12', icon: 'w-6 h-6' },
  lg: { container: 'w-16 h-16', icon: 'w-8 h-8' },
};

const colorClasses: Record<ColorType, { bg: string; icon: string }> = {
  slate: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    icon: 'text-slate-500 dark:text-slate-400',
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  emerald: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  rose: {
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    icon: 'text-rose-600 dark:text-rose-400',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    icon: 'text-blue-600 dark:text-blue-400',
  },
};

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

function GaugeIcon({ className }: { className: string }) {
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

function ShieldAlertIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
      />
    </svg>
  );
}

function KeyRoundIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
  );
}

const icons: Record<IconType, React.ComponentType<{ className: string }>> = {
  sparkles: SparklesIcon,
  gauge: GaugeIcon,
  'shield-alert': ShieldAlertIcon,
  'key-round': KeyRoundIcon,
};

export function IconContainer({ icon, color = 'slate', size = 'md' }: IconContainerProps) {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];
  const IconComponent = icons[icon];

  return (
    <div
      className={`${sizeClass.container} ${colorClass.bg} rounded-2xl flex items-center justify-center`}
    >
      <IconComponent className={`${sizeClass.icon} ${colorClass.icon}`} />
    </div>
  );
}

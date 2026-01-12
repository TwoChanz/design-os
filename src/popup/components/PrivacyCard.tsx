// =============================================================================
// PrivacyCard Component — Emerald-tinted info card for privacy assurance
// =============================================================================

import React from 'react';

interface PrivacyCardProps {
  text: string;
}

export function PrivacyCard({ text }: PrivacyCardProps) {
  return (
    <div className="w-full max-w-[300px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
      <p className="text-xs text-emerald-700 dark:text-emerald-300">
        <strong>Privacy note:</strong> {text}
      </p>
    </div>
  );
}

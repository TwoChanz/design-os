// =============================================================================
// PrivacyNote Component — Small muted privacy text
// =============================================================================

import React from 'react';

interface PrivacyNoteProps {
  text?: string;
}

export function PrivacyNote({ text = 'Your data stays on this device' }: PrivacyNoteProps) {
  return (
    <p className="text-xs text-slate-400 dark:text-slate-500 text-center italic">
      {text}
    </p>
  );
}

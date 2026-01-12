// =============================================================================
// LoadingScreen — Scoring in progress
// =============================================================================

import React, { useState, useEffect } from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';
import { DomainPill } from '../components/DomainPill';
import { Spinner } from '../components/Spinner';
import { PrivacyNote } from '../components/PrivacyNote';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

const LOADING_STEPS = [
  'Analyzing pricing transparency',
  'Checking trial terms',
  'Reviewing cancellation policy',
];

export function LoadingScreen({ context, send }: Props) {
  const [stepIndex, setStepIndex] = useState(0);

  // Cycle through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Get domain from context or current score report
  const domain = context.currentDomain ?? context.currentScoreReport?.domain ?? 'Unknown page';

  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] px-6 py-8">
      {/* Domain indicator */}
      <DomainPill domain={domain} />

      {/* Spacer */}
      <div className="flex-1 min-h-8" />

      {/* Spinner */}
      <Spinner size="lg" />

      {/* Headline */}
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mt-5 mb-2 text-center">
        Scoring...
      </h2>

      {/* Step text */}
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center h-5">
        {LOADING_STEPS[stepIndex]}
      </p>

      {/* Spacer */}
      <div className="flex-1 min-h-8" />

      {/* Privacy note */}
      <PrivacyNote text="Your data stays on this device" />
    </div>
  );
}

// =============================================================================
// HomeScreen — Initial state with "Score this page" CTA
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';
import { DomainPill } from '../components/DomainPill';
import { IconContainer } from '../components/IconContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextLink } from '../components/TextLink';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

export function HomeScreen({ context, send }: Props) {
  // Get domain from context (set by extension when popup opens)
  const domain = context.currentDomain ?? 'Unknown page';

  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] px-6 py-8">
      {/* Domain indicator */}
      <DomainPill domain={domain} />

      {/* Spacer */}
      <div className="flex-1 min-h-8" />

      {/* Icon */}
      <IconContainer icon="sparkles" color="blue" size="lg" />

      {/* Headline */}
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white mt-5 mb-2 text-center">
        Score this page
      </h1>

      {/* Subtext */}
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 max-w-[280px]">
        See how transparent pricing and terms are
      </p>

      {/* Primary CTA */}
      <PrimaryButton onClick={() => send({ type: 'SCORE_PAGE' })}>
        Score this page
      </PrimaryButton>

      {/* Secondary link */}
      <div className="mt-4">
        <TextLink onClick={() => send({ type: 'VIEW_HISTORY' })} icon="history">
          View my scores
        </TextLink>
      </div>

      {/* Spacer */}
      <div className="flex-1 min-h-4" />

      {/* Saved count */}
      {context.scoreReportCount > 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {context.scoreReportCount} saved score{context.scoreReportCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

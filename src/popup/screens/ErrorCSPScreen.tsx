// =============================================================================
// ErrorCSPScreen — Page blocked by CSP or restrictions
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';
import { DomainPill } from '../components/DomainPill';
import { IconContainer } from '../components/IconContainer';
import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextLink } from '../components/TextLink';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

export function ErrorCSPScreen({ context, send }: Props) {
  // Get domain from context
  const domain = context.currentDomain ?? 'Unknown page';

  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] px-6 py-8">
      {/* Icon */}
      <IconContainer icon="shield-alert" color="slate" size="lg" />

      {/* Headline */}
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-5 mb-2 text-center">
        Page blocked
      </h2>

      {/* Domain pill */}
      <DomainPill domain={domain} />

      {/* Explanation */}
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-3 mb-5 max-w-[280px]">
        This page's security settings prevent automatic analysis.
      </p>

      {/* Info card */}
      <InfoCard
        title="What you can do:"
        items={[
          'Answer 3 questions to create a manual score',
          'Try scoring from a different page on this site',
        ]}
      />

      {/* Primary CTA */}
      <div className="mt-5 w-full max-w-[280px]">
        <PrimaryButton onClick={() => send({ type: 'ANSWER_MANUAL' })}>
          Score manually
        </PrimaryButton>
      </div>

      {/* Back link */}
      <div className="mt-4">
        <TextLink onClick={() => send({ type: 'BACK' })} icon="arrow-left">
          Go back
        </TextLink>
      </div>
    </div>
  );
}

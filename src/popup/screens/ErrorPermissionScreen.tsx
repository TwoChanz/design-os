// =============================================================================
// ErrorPermissionScreen — Extension lacks host permission
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';
import { DomainPill } from '../components/DomainPill';
import { IconContainer } from '../components/IconContainer';
import { PrivacyCard } from '../components/PrivacyCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { TextLink } from '../components/TextLink';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

export function ErrorPermissionScreen({ context, send }: Props) {
  // For demo, use a placeholder domain
  const domain = context.currentScoreReport?.domain ?? 'example.com';

  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] px-6 py-8">
      {/* Icon */}
      <IconContainer icon="key-round" color="amber" size="lg" />

      {/* Headline */}
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-5 mb-2 text-center">
        Permission needed
      </h2>

      {/* Domain pill */}
      <DomainPill domain={domain} />

      {/* Explanation */}
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-3 mb-5 max-w-[280px]">
        SubSense needs permission to analyze this site.
      </p>

      {/* Privacy card */}
      <PrivacyCard text="SubSense only reads the current page when you click 'Score'. No data is sent anywhere." />

      {/* Primary CTA */}
      <div className="mt-5 w-full max-w-[280px] space-y-3">
        <PrimaryButton onClick={() => send({ type: 'GRANT_PERMISSION' })}>
          Grant permission
        </PrimaryButton>

        <SecondaryButton onClick={() => send({ type: 'ANSWER_MANUAL' })}>
          Score manually instead
        </SecondaryButton>
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

// =============================================================================
// ConfirmClearAllModal
// =============================================================================

import React from 'react';
import type { PopupContext, PopupEvent } from '../../state-machine/types';
import { IconContainer } from '../components/IconContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

export function ConfirmClearAllModal({ context, send }: Props) {
  return (
    <div className="p-6 space-y-5">
      {/* Icon */}
      <div className="flex justify-center">
        <IconContainer icon="warning" color="amber" size="lg" />
      </div>

      {/* Text */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Clear all data?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          This will permanently delete all your saved data. This action cannot be undone.
        </p>
      </div>

      {/* Data summary */}
      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Saved scores</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {context.scoreReportCount}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Subscriptions</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {context.subscriptionCount}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <SecondaryButton onClick={() => send({ type: 'CANCEL' })}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onClick={() => send({ type: 'DELETE_CONFIRMED' })}
          variant="danger"
        >
          Clear All
        </PrimaryButton>
      </div>
    </div>
  );
}

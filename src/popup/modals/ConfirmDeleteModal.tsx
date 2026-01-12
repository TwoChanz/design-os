// =============================================================================
// ConfirmDeleteModal
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

export function ConfirmDeleteModal({ context, send }: Props) {
  const isScore = context.selectedReportId !== null;
  const itemType = isScore ? 'score' : 'subscription';

  return (
    <div className="p-6 space-y-5">
      {/* Icon */}
      <div className="flex justify-center">
        <IconContainer icon="trash" color="rose" size="lg" />
      </div>

      {/* Text */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Delete {itemType}?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          This action cannot be undone.
        </p>
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
          Delete
        </PrimaryButton>
      </div>
    </div>
  );
}

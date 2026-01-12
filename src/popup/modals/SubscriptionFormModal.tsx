// =============================================================================
// SubscriptionFormModal
// =============================================================================

import React, { useState, useEffect } from 'react';
import type { PopupContext, PopupEvent, SubscriptionStatus } from '../../state-machine/types';
import { storage } from '../../storage/adapter';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

const inputClasses = `
  w-full px-3 py-2.5 rounded-xl
  bg-white dark:bg-slate-800
  border border-slate-300 dark:border-slate-600
  text-slate-900 dark:text-white
  placeholder:text-slate-400 dark:placeholder:text-slate-500
  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  dark:focus:ring-blue-400 dark:focus:border-blue-400
`;

export function SubscriptionFormModal({ context, send }: Props) {
  const isEdit = context.selectedSubscriptionId !== null;
  const [name, setName] = useState('');
  const [domain, setDomain] = useState(context.prefillDomain ?? '');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [status, setStatus] = useState<SubscriptionStatus>('active');
  const [notes, setNotes] = useState('');

  // Load existing subscription for edit
  useEffect(() => {
    if (isEdit && context.selectedSubscriptionId) {
      storage.getSubscription(context.selectedSubscriptionId).then((sub) => {
        if (sub) {
          setName(sub.name);
          setDomain(sub.domain ?? '');
          setMonthlyCost(sub.monthlyCost.toString());
          setStatus(sub.status);
          setNotes(sub.notes ?? '');
        }
      });
    }
  }, [isEdit, context.selectedSubscriptionId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send({
      type: 'SAVE_SUBSCRIPTION',
      payload: {
        name,
        domain: domain || null,
        monthlyCost: parseFloat(monthlyCost) || 0,
        status,
        notes: notes || null,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-4">
      {/* Header */}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        {isEdit ? 'Edit Subscription' : 'Add Subscription'}
      </h3>

      {/* Name field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Netflix"
          required
          className={inputClasses}
        />
      </div>

      {/* Domain field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Domain
        </label>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="e.g., netflix.com"
          className={inputClasses}
        />
      </div>

      {/* Monthly Cost field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Monthly Cost <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-400">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={monthlyCost}
            onChange={(e) => setMonthlyCost(e.target.value)}
            placeholder="0.00"
            required
            className={`${inputClasses} pl-7`}
          />
        </div>
      </div>

      {/* Status field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as SubscriptionStatus)}
          className={inputClasses}
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Notes field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Optional notes..."
          className={inputClasses}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <SecondaryButton onClick={() => send({ type: 'CANCEL' })}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onClick={() => {}}
          disabled={context.isSaving || !name || !monthlyCost}
          loading={context.isSaving}
        >
          {context.isSaving ? 'Saving...' : 'Save'}
        </PrimaryButton>
      </div>
    </form>
  );
}

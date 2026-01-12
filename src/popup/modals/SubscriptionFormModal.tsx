// =============================================================================
// SubscriptionFormModal
// =============================================================================

import React, { useState, useEffect } from 'react';
import type { PopupContext, PopupEvent, SubscriptionStatus } from '../../state-machine/types';
import { storage } from '../../storage/adapter';

interface Props {
  context: PopupContext;
  send: (event: PopupEvent) => void;
}

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
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">
        {isEdit ? 'Edit Subscription' : 'Add Subscription'}
      </h3>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Netflix"
          required
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Domain</label>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="e.g., netflix.com"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Cost *</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-slate-500">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={monthlyCost}
            onChange={(e) => setMonthlyCost(e.target.value)}
            placeholder="0.00"
            required
            className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as SubscriptionStatus)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Optional notes..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => send({ type: 'CANCEL' })}
          className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={context.isSaving}
          className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {context.isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

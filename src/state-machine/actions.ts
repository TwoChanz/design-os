// =============================================================================
// SubSense Popup State Machine — Actions
// =============================================================================

import type {
  PopupContext,
  PopupEvent,
  EvidenceResponse,
  StateId,
  ModalType,
  TriStateAnswer,
} from './types';
import { initialContext } from './types';

export type ActionFn = (
  context: PopupContext,
  event: PopupEvent,
  value?: string
) => PopupContext;

// Helper to create initial evidence responses
function createInitialEvidenceResponses(): EvidenceResponse[] {
  return [
    { questionId: 'price_clarity', question: 'Was the price easy to find?', answer: null },
    { questionId: 'trial_clarity', question: 'Were trial terms clearly explained?', answer: null },
    { questionId: 'cancel_clarity', question: 'Were cancellation steps clear?', answer: null },
  ];
}

// Helper to update a specific evidence response
function updateResponse(
  responses: EvidenceResponse[] | null,
  payload: { questionId: string; answer: TriStateAnswer }
): EvidenceResponse[] {
  const current = responses ?? createInitialEvidenceResponses();
  return current.map((r) =>
    r.questionId === payload.questionId ? { ...r, answer: payload.answer } : r
  );
}

export const actions: Record<string, ActionFn> = {
  // Score report actions
  setScoreReport: (ctx, event) => {
    if (event.type === 'SCORE_SUCCESS' || event.type === 'SCORE_LOW_CONFIDENCE') {
      return { ...ctx, currentScoreReport: event.payload };
    }
    return ctx;
  },

  updateScoreReport: (ctx, event) => {
    if (event.type === 'RECALC_SUCCESS' && ctx.currentScoreReport) {
      return { ...ctx, currentScoreReport: event.payload };
    }
    return ctx;
  },

  clearScoreReport: (ctx) => ({ ...ctx, currentScoreReport: null }),

  setLowConfidenceFlag: (ctx) => {
    if (ctx.currentScoreReport) {
      return {
        ...ctx,
        currentScoreReport: { ...ctx.currentScoreReport, confidence: 'low' as const },
      };
    }
    return ctx;
  },

  setManualScoreFlag: (ctx) => ({ ...ctx, isManualScore: true }),

  // Evidence response actions
  updateEvidenceResponse: (ctx, event) => {
    if (event.type === 'SET_ANSWER') {
      return { ...ctx, evidenceResponses: updateResponse(ctx.evidenceResponses, event.payload) };
    }
    return ctx;
  },

  clearEvidenceResponses: (ctx) => ({ ...ctx, evidenceResponses: null }),

  // Selection actions
  setSelectedReportId: (ctx, event) => {
    if (event.type === 'SELECT_REPORT') {
      return { ...ctx, selectedReportId: event.payload };
    }
    return ctx;
  },

  clearSelectedReportId: (ctx) => ({ ...ctx, selectedReportId: null }),

  setSelectedSubscriptionId: (ctx, event) => {
    if (event.type === 'EDIT_SUBSCRIPTION' || event.type === 'DELETE_SUBSCRIPTION') {
      return { ...ctx, selectedSubscriptionId: event.payload };
    }
    return ctx;
  },

  clearSelectedSubscriptionId: (ctx) => ({ ...ctx, selectedSubscriptionId: null }),

  // Modal actions (structured action handlers)
  setModalType: (ctx, _event, value?: string) => ({
    ...ctx,
    modalType: (value as ModalType) ?? null,
  }),

  setModalParentState: (ctx, _event, value?: string) => ({
    ...ctx,
    modalParentState: (value as StateId) ?? null,
  }),

  clearModalState: (ctx) => ({
    ...ctx,
    modalType: null,
    modalParentState: null,
    prefillDomain: undefined,
  }),

  prefillSubscriptionDomain: (ctx) => ({
    ...ctx,
    prefillDomain: ctx.currentScoreReport?.domain,
  }),

  // Async indicator actions
  setSubmitting: (ctx) => ({ ...ctx, isSubmitting: true }),
  clearSubmitting: (ctx) => ({ ...ctx, isSubmitting: false }),
  setSharing: (ctx) => ({ ...ctx, isSharing: true }),
  clearSharing: (ctx) => ({ ...ctx, isSharing: false }),
  setSaving: (ctx) => ({ ...ctx, isSaving: true }),
  clearSaving: (ctx) => ({ ...ctx, isSaving: false }),

  // Error action
  setError: (ctx, event) => {
    if ('payload' in event && event.payload instanceof Error) {
      return { ...ctx, error: event.payload };
    }
    return ctx;
  },

  // Count actions
  incrementScoreReportCount: (ctx) => ({
    ...ctx,
    scoreReportCount: ctx.scoreReportCount + 1,
  }),

  decrementScoreReportCount: (ctx) => ({
    ...ctx,
    scoreReportCount: Math.max(0, ctx.scoreReportCount - 1),
  }),

  incrementSubscriptionCount: (ctx) => ({
    ...ctx,
    subscriptionCount: ctx.subscriptionCount + 1,
  }),

  decrementSubscriptionCount: (ctx) => ({
    ...ctx,
    subscriptionCount: Math.max(0, ctx.subscriptionCount - 1),
  }),

  resetCounts: (ctx) => ({
    ...ctx,
    scoreReportCount: 0,
    subscriptionCount: 0,
  }),

  // Full context reset
  resetContext: () => ({ ...initialContext }),
};

// Execute an action (supports both simple string actions and structured actions)
export function executeAction(
  actionDef: string | { type: string; value?: string },
  context: PopupContext,
  event: PopupEvent
): PopupContext {
  const actionName = typeof actionDef === 'string' ? actionDef : actionDef.type;
  const actionValue = typeof actionDef === 'object' ? actionDef.value : undefined;

  const action = actions[actionName];
  if (!action) {
    console.warn(`Unknown action: ${actionName}`);
    return context;
  }

  return action(context, event, actionValue);
}

// Execute multiple actions in sequence
export function executeActions(
  actionDefs: Array<string | { type: string; value?: string }>,
  context: PopupContext,
  event: PopupEvent
): PopupContext {
  return actionDefs.reduce((ctx, actionDef) => executeAction(actionDef, ctx, event), context);
}

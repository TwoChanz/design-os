// =============================================================================
// SubSense Popup State Machine — Side Effects
// =============================================================================

import type { PopupContext, PopupEvent, ScoreReport, Subscription } from './types';
import { storage } from '../storage/adapter';
import { toastService } from '../services/toast';

export type DispatchFn = (event: PopupEvent) => void;

export interface SideEffectDeps {
  dispatch: DispatchFn;
  context: PopupContext;
}

export type SideEffectFn = (
  deps: SideEffectDeps,
  event: PopupEvent,
  message?: string
) => Promise<void> | void;

// -----------------------------------------------------------------------------
// Side Effect Implementations
// -----------------------------------------------------------------------------

const sideEffects: Record<string, SideEffectFn> = {
  /**
   * Initiates page analysis via content script.
   * In development, simulates with a delay and mock data.
   */
  startScoring: async ({ dispatch }) => {
    try {
      // In production: send message to content script
      // const response = await chrome.runtime.sendMessage({ type: 'ANALYZE_PAGE' });

      // Development simulation
      await new Promise((r) => setTimeout(r, 1500));

      const mockReport: ScoreReport = {
        id: `sr_${Date.now()}`,
        createdAt: new Date().toISOString(),
        domain: 'example.com',
        url: 'https://example.com/pricing',
        overallScore: 72,
        ratingLabel: 'Clear',
        confidence: 'high',
        categoryScores: [
          { category: 'pricing', label: 'Pricing', score: 80 },
          { category: 'trials', label: 'Trials', score: 65 },
          { category: 'cancellation', label: 'Cancellation', score: 70 },
          { category: 'data', label: 'Data Practices', score: 75 },
          { category: 'permissions', label: 'Permissions', score: 70 },
        ],
        evidenceItems: [
          {
            key: 'price_visible',
            label: 'Price displayed on page',
            value: true,
            source: 'detected',
            confidence: 'high',
          },
          {
            key: 'trial_duration',
            label: 'Trial duration stated',
            value: true,
            source: 'detected',
            confidence: 'medium',
          },
        ],
        notes: null,
      };

      // Randomly simulate low confidence for testing
      if (Math.random() < 0.3) {
        dispatch({
          type: 'SCORE_LOW_CONFIDENCE',
          payload: { ...mockReport, confidence: 'low' },
        });
      } else {
        dispatch({ type: 'SCORE_SUCCESS', payload: mockReport });
      }
    } catch (error) {
      // Determine error type
      const err = error instanceof Error ? error : new Error('Unknown error');
      if (err.message.includes('CSP') || err.message.includes('blocked')) {
        dispatch({ type: 'SCORE_ERROR_CSP', payload: err });
      } else {
        dispatch({ type: 'SCORE_ERROR_PERMISSION', payload: err });
      }
    }
  },

  /**
   * Saves the current score report to local storage.
   */
  saveScore: async ({ dispatch, context }) => {
    try {
      if (!context.currentScoreReport) {
        throw new Error('No score report to save');
      }
      await storage.saveScoreReport(context.currentScoreReport);
      dispatch({ type: 'SAVE_SUCCESS' });
    } catch (error) {
      dispatch({
        type: 'SAVE_FAILURE',
        payload: error instanceof Error ? error : new Error('Failed to save'),
      });
    }
  },

  /**
   * Recalculates the score with user-provided evidence responses.
   */
  recalcScore: async ({ dispatch, context }) => {
    try {
      if (!context.currentScoreReport || !context.evidenceResponses) {
        throw new Error('Missing data for recalculation');
      }

      await new Promise((r) => setTimeout(r, 800));

      // Simulate recalculation with user input
      const updatedReport: ScoreReport = {
        ...context.currentScoreReport,
        confidence: 'medium',
        overallScore: Math.min(100, context.currentScoreReport.overallScore + 5),
        evidenceItems: [
          ...context.currentScoreReport.evidenceItems,
          ...context.evidenceResponses
            .filter((r) => r.answer !== null)
            .map((r) => ({
              key: r.questionId,
              label: `User confirmed: ${r.question.toLowerCase()}`,
              value: r.answer === 'yes',
              source: 'user_input' as const,
              confidence: 'medium' as const,
            })),
        ],
      };

      dispatch({ type: 'RECALC_SUCCESS', payload: updatedReport });
    } catch (error) {
      dispatch({
        type: 'RECALC_FAILURE',
        payload: error instanceof Error ? error : new Error('Recalculation failed'),
      });
    }
  },

  /**
   * Generates a share image of the score card.
   */
  generateShareImage: async ({ dispatch, context }) => {
    try {
      if (!context.currentScoreReport && !context.selectedReportId) {
        throw new Error('No score to share');
      }

      // In production: render to canvas and trigger download
      await new Promise((r) => setTimeout(r, 500));

      // Simulate occasional failure for testing fallback
      if (Math.random() < 0.2) {
        throw new Error('Canvas rendering failed');
      }

      dispatch({ type: 'SHARE_SUCCESS' });
    } catch (error) {
      dispatch({
        type: 'SHARE_FAILURE',
        payload: error instanceof Error ? error : new Error('Share failed'),
      });
    }
  },

  /**
   * Fallback: copies text summary to clipboard.
   */
  copyTextSummary: async ({ context }) => {
    const report = context.currentScoreReport;
    if (!report) return;

    const summary = `SubSense Score: ${report.overallScore}/100 (${report.ratingLabel})\n${report.domain}\n${report.url}`;

    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      // Fallback for older browsers
      console.warn('Clipboard API not available');
    }
  },

  /**
   * Deletes a score report from storage.
   */
  deleteScore: async ({ dispatch, context }) => {
    try {
      if (!context.selectedReportId) {
        throw new Error('No report selected');
      }
      await storage.deleteScoreReport(context.selectedReportId);
      dispatch({ type: 'DELETE_SCORE_SUCCESS' });
    } catch (error) {
      dispatch({
        type: 'DELETE_SCORE_FAILURE',
        payload: error instanceof Error ? error : new Error('Delete failed'),
      });
    }
  },

  /**
   * Saves or updates a subscription.
   */
  saveSubscription: async ({ dispatch, context }, event) => {
    try {
      if (event.type !== 'SAVE_SUBSCRIPTION') return;

      const data = event.payload;
      const isEdit = context.selectedSubscriptionId !== null;

      if (isEdit) {
        await storage.updateSubscription(context.selectedSubscriptionId!, data);
      } else {
        const newSub: Subscription = {
          id: `sub_${Date.now()}`,
          name: data.name ?? '',
          domain: data.domain ?? context.prefillDomain ?? null,
          monthlyCost: data.monthlyCost ?? 0,
          status: data.status ?? 'active',
          renewalDate: data.renewalDate ?? null,
          notes: data.notes ?? null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await storage.saveSubscription(newSub);
      }

      dispatch({ type: 'SAVE_SUBSCRIPTION_SUCCESS' });
    } catch (error) {
      dispatch({
        type: 'SAVE_SUBSCRIPTION_FAILURE',
        payload: error instanceof Error ? error : new Error('Save failed'),
      });
    }
  },

  /**
   * Deletes a subscription from storage.
   */
  deleteSubscription: async ({ dispatch, context }) => {
    try {
      if (!context.selectedSubscriptionId) {
        throw new Error('No subscription selected');
      }
      await storage.deleteSubscription(context.selectedSubscriptionId);
      dispatch({ type: 'DELETE_SUBSCRIPTION_SUCCESS' });
    } catch (error) {
      dispatch({
        type: 'DELETE_SUBSCRIPTION_FAILURE',
        payload: error instanceof Error ? error : new Error('Delete failed'),
      });
    }
  },

  /**
   * Requests host permission from the user.
   */
  requestPermission: async ({ dispatch }) => {
    try {
      // In production: chrome.permissions.request()
      // const granted = await chrome.permissions.request({ origins: ['<all_urls>'] });

      // Development simulation
      await new Promise((r) => setTimeout(r, 300));
      const granted = Math.random() > 0.3;

      if (granted) {
        dispatch({ type: 'PERMISSION_GRANTED' });
      } else {
        dispatch({ type: 'PERMISSION_DENIED' });
      }
    } catch {
      dispatch({ type: 'PERMISSION_DENIED' });
    }
  },

  /**
   * Clears all local storage data.
   */
  clearAllData: async ({ dispatch }) => {
    try {
      await storage.clearAll();
      dispatch({ type: 'CLEAR_ALL_SUCCESS' });
    } catch (error) {
      dispatch({
        type: 'CLEAR_ALL_FAILURE',
        payload: error instanceof Error ? error : new Error('Clear failed'),
      });
    }
  },

  /**
   * Shows a toast notification.
   */
  showToast: (_deps, _event, message?: string) => {
    if (message) {
      toastService.show(message);
    }
  },
};

// -----------------------------------------------------------------------------
// Execute Side Effects
// -----------------------------------------------------------------------------

export type SideEffectDef = string | { type: string; message?: string };

export async function executeSideEffect(
  effectDef: SideEffectDef,
  deps: SideEffectDeps,
  event: PopupEvent
): Promise<void> {
  const effectName = typeof effectDef === 'string' ? effectDef : effectDef.type;
  const message = typeof effectDef === 'object' ? effectDef.message : undefined;

  const effect = sideEffects[effectName];
  if (!effect) {
    console.warn(`Unknown side effect: ${effectName}`);
    return;
  }

  await effect(deps, event, message);
}

export async function executeSideEffects(
  effectDefs: SideEffectDef[] | undefined,
  deps: SideEffectDeps,
  event: PopupEvent
): Promise<void> {
  if (!effectDefs) return;

  for (const effectDef of effectDefs) {
    await executeSideEffect(effectDef, deps, event);
  }
}

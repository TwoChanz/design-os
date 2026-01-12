// =============================================================================
// SubSense Popup State Machine — Guards
// =============================================================================

import type { PopupContext } from './types';

export type GuardFn = (context: PopupContext) => boolean;

export const guards: Record<string, GuardFn> = {
  // Permission guards
  permissionGranted: (ctx) => ctx.permissionStatus === 'granted',
  notPermissionGranted: (ctx) => ctx.permissionStatus !== 'granted',

  // Page access guards
  pageReadable: (ctx) => ctx.pageAccessible === true,
  notPageReadable: (ctx) => ctx.pageAccessible === false,

  // Score confidence guards
  hasLowConfidence: (ctx) => ctx.currentScoreReport?.confidence === 'low',

  // Evidence prompt guards
  allQuestionsAnswered: (ctx) =>
    ctx.evidenceResponses?.length === 3 &&
    ctx.evidenceResponses.every((r) => r.answer !== null),

  // Async state guards
  notSubmitting: (ctx) => ctx.isSubmitting === false,
  notSaving: (ctx) => ctx.isSaving === false,

  // Manual scoring guard
  isManualScore: (ctx) => ctx.isManualScore === true,

  // Count guards
  hasScoreReports: (ctx) => ctx.scoreReportCount > 0,
  noScoreReports: (ctx) => ctx.scoreReportCount === 0,
  hasSubscriptions: (ctx) => ctx.subscriptionCount > 0,
  noSubscriptions: (ctx) => ctx.subscriptionCount === 0,

  // Modal type guards
  isScoreDelete: (ctx) =>
    ctx.modalType === 'confirmDelete' && ctx.selectedReportId !== null,
  isSubscriptionDelete: (ctx) =>
    ctx.modalType === 'confirmDelete' && ctx.selectedSubscriptionId !== null,
  isClearAllData: (ctx) => ctx.modalType === 'confirmClearAll',
};

export function evaluateGuard(
  guardName: string | undefined,
  context: PopupContext
): boolean {
  if (!guardName) return true;
  const guard = guards[guardName];
  if (!guard) {
    console.warn(`Unknown guard: ${guardName}`);
    return true;
  }
  return guard(context);
}

// =============================================================================
// SubSense Scoring Engine (Pure Function)
// Runs in background service worker
// Deterministic scoring: base 100 - penalties
// =============================================================================

import type { CategoryKey, Confidence, RatingLabel, EvidenceItem, CategoryScore } from '../state-machine/types';
import type { ExtractedSignals } from './extractor';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ScoringInput {
  signals: ExtractedSignals;
  manualAnswers?: ManualAnswers;
}

export interface ManualAnswers {
  priceClarity?: 'yes' | 'no' | 'not_sure';
  trialClarity?: 'yes' | 'no' | 'not_sure';
  cancelClarity?: 'yes' | 'no' | 'not_sure';
}

export interface ScoringOutput {
  overallScore: number;
  ratingLabel: RatingLabel;
  confidence: Confidence;
  categoryScores: CategoryScore[];
  evidenceItems: EvidenceItem[];
}

// -----------------------------------------------------------------------------
// Category Configuration
// -----------------------------------------------------------------------------

const CATEGORY_WEIGHTS: Record<string, number> = {
  pricing: 0.4,
  trials: 0.3,
  cancellation: 0.3,
};

const RATING_THRESHOLDS = {
  CLEAR: 75,
  MIXED: 40,
};

// -----------------------------------------------------------------------------
// Pricing Clarity Scoring (Base 100 - penalties)
// -----------------------------------------------------------------------------

interface PricingResult {
  score: number;
  evidence: EvidenceItem[];
  hasStrongEvidence: boolean;
}

function scorePricing(signals: ExtractedSignals): PricingResult {
  let score = 100;
  const evidence: EvidenceItem[] = [];
  let hasStrongEvidence = false;

  const { hints, extracted, links } = signals;

  // Check for pricing link but no visible prices
  const hasPricingLink = links.some(
    (l) => /pricing|plans|subscribe/i.test(l.href) || /pricing|plans/i.test(l.text)
  );

  if (!hints.foundPriceTokens) {
    if (hasPricingLink) {
      // Pricing link exists but no prices visible on current page
      score -= 25;
      evidence.push({
        key: 'price_link_only',
        label: 'Pricing link found, but no prices visible on page',
        value: false,
        source: 'detected',
        confidence: 'medium',
      });
    } else {
      // No price tokens found at all
      score -= 60;
      evidence.push({
        key: 'no_price',
        label: 'No pricing information found',
        value: false,
        source: 'detected',
        confidence: 'high',
      });
    }
  } else {
    // Prices found
    hasStrongEvidence = true;
    evidence.push({
      key: 'price_visible',
      label: `Price shown on page (${extracted.priceMatches.slice(0, 2).join(', ')})`,
      value: true,
      source: 'detected',
      confidence: 'high',
    });
  }

  // Contact sales / request demo without pricing
  if (hints.foundContactSalesTokens && !hints.foundPriceTokens) {
    score -= 35;
    evidence.push({
      key: 'contact_sales_no_price',
      label: '"Contact sales" without visible pricing',
      value: false,
      source: 'detected',
      confidence: 'high',
    });
  }

  // Missing billing cycle (monthly/yearly)
  if (hints.foundPriceTokens && !hints.foundBillingCycleTokens) {
    score -= 15;
    evidence.push({
      key: 'no_billing_cycle',
      label: 'Billing frequency not specified (monthly/yearly)',
      value: false,
      source: 'detected',
      confidence: 'medium',
    });
  } else if (hints.foundBillingCycleTokens) {
    evidence.push({
      key: 'billing_cycle_clear',
      label: `Billing cycle specified (${extracted.billingCycleMatch || 'found'})`,
      value: true,
      source: 'detected',
      confidence: 'high',
    });
  }

  return { score: Math.max(0, score), evidence, hasStrongEvidence };
}

// -----------------------------------------------------------------------------
// Trial Clarity Scoring (Base 100 - penalties)
// -----------------------------------------------------------------------------

interface TrialResult {
  score: number;
  evidence: EvidenceItem[];
  hasStrongEvidence: boolean;
}

function scoreTrial(signals: ExtractedSignals): TrialResult {
  let score = 100;
  const evidence: EvidenceItem[] = [];
  let hasStrongEvidence = false;

  const { hints, extracted } = signals;

  if (!hints.foundTrialTokens) {
    // No trial mentioned - not necessarily bad, just neutral/unknown
    score -= 20;
    evidence.push({
      key: 'no_trial_mention',
      label: 'No free trial mentioned',
      value: false,
      source: 'detected',
      confidence: 'low',
    });
  } else {
    // Trial mentioned
    if (!hints.foundTrialDurationTokens) {
      // Trial mentioned but no duration
      score -= 50;
      evidence.push({
        key: 'trial_no_duration',
        label: 'Free trial mentioned but duration not specified',
        value: false,
        source: 'detected',
        confidence: 'high',
      });
    } else {
      // Trial with duration - strong evidence
      hasStrongEvidence = true;
      evidence.push({
        key: 'trial_duration_clear',
        label: `Trial duration specified (${extracted.trialDurationMatch || 'found'})`,
        value: true,
        source: 'detected',
        confidence: 'high',
      });
    }

    // Auto-renewal disclosure
    if (!hints.foundAutoRenewTokens) {
      score -= 25;
      evidence.push({
        key: 'no_auto_renew',
        label: 'Auto-renewal terms not mentioned',
        value: false,
        source: 'detected',
        confidence: 'medium',
      });
    } else {
      hasStrongEvidence = true;
      evidence.push({
        key: 'auto_renew_disclosed',
        label: 'Auto-renewal terms disclosed',
        value: true,
        source: 'detected',
        confidence: 'high',
      });
    }
  }

  return { score: Math.max(0, score), evidence, hasStrongEvidence };
}

// -----------------------------------------------------------------------------
// Cancellation Clarity Scoring (Base 100 - penalties)
// -----------------------------------------------------------------------------

interface CancelResult {
  score: number;
  evidence: EvidenceItem[];
  hasStrongEvidence: boolean;
}

function scoreCancel(signals: ExtractedSignals): CancelResult {
  let score = 100;
  const evidence: EvidenceItem[] = [];
  let hasStrongEvidence = false;

  const { hints, links, pageText } = signals;

  // Check for cancel link
  const hasCancelLink = links.some(
    (l) => /cancel|unsubscribe/i.test(l.href) || /cancel|unsubscribe/i.test(l.text)
  );

  if (!hints.foundCancelTokens && !hasCancelLink) {
    // No cancel info found
    score -= 60;
    evidence.push({
      key: 'no_cancel_info',
      label: 'No cancellation information found',
      value: false,
      source: 'detected',
      confidence: 'high',
    });
  } else {
    // Cancel mentioned
    if (hasCancelLink || hints.foundCancelStepsTokens) {
      hasStrongEvidence = true;
      evidence.push({
        key: 'cancel_steps_clear',
        label: 'Cancellation process or link available',
        value: true,
        source: 'detected',
        confidence: 'high',
      });
    } else {
      // Cancel mentioned but no steps
      score -= 30;
      evidence.push({
        key: 'cancel_no_steps',
        label: 'Cancellation mentioned but steps unclear',
        value: false,
        source: 'detected',
        confidence: 'medium',
      });
    }

    // Check for contact-only cancellation (high friction)
    const contactOnlyCancel = /(?:call|phone|email|contact)\s*(?:us|support)?\s*to\s*cancel/i.test(pageText);
    if (contactOnlyCancel) {
      score -= 40;
      evidence.push({
        key: 'contact_to_cancel',
        label: 'Must contact support to cancel (high friction)',
        value: false,
        source: 'detected',
        confidence: 'high',
      });
    }
  }

  // Refund policy
  if (hints.foundRefundTokens) {
    evidence.push({
      key: 'refund_policy',
      label: 'Refund policy mentioned',
      value: true,
      source: 'detected',
      confidence: 'medium',
    });
  }

  return { score: Math.max(0, score), evidence, hasStrongEvidence };
}

// -----------------------------------------------------------------------------
// Manual Override Logic
// -----------------------------------------------------------------------------

function applyManualOverride(
  categoryScore: number,
  answer: 'yes' | 'no' | 'not_sure' | undefined
): number {
  if (!answer || answer === 'not_sure') {
    return categoryScore;
  }

  if (answer === 'yes') {
    // Floor at 70 (can go higher if detected supports it)
    return Math.max(70, categoryScore);
  }

  if (answer === 'no') {
    // Cap at 40 (even if detected thinks it's okay)
    return Math.min(40, categoryScore);
  }

  return categoryScore;
}

// -----------------------------------------------------------------------------
// Confidence Calculation
// -----------------------------------------------------------------------------

function calculateConfidence(
  pricingResult: PricingResult,
  trialResult: TrialResult,
  cancelResult: CancelResult
): Confidence {
  // Count categories with at least 1 strong evidence item
  let strongCategories = 0;

  if (pricingResult.hasStrongEvidence) strongCategories++;
  if (trialResult.hasStrongEvidence) strongCategories++;
  if (cancelResult.hasStrongEvidence) strongCategories++;

  // Low confidence: fewer than 2 categories have strong evidence
  if (strongCategories < 2) {
    return 'low';
  }

  // High confidence: all 3 categories have strong evidence
  if (strongCategories === 3) {
    return 'high';
  }

  return 'medium';
}

// -----------------------------------------------------------------------------
// Rating Label
// -----------------------------------------------------------------------------

function getRatingLabel(score: number): RatingLabel {
  if (score >= RATING_THRESHOLDS.CLEAR) {
    return 'Clear';
  }
  if (score >= RATING_THRESHOLDS.MIXED) {
    return 'Mixed';
  }
  return 'Risky';
}

// -----------------------------------------------------------------------------
// Main Scoring Function (Pure)
// -----------------------------------------------------------------------------

export function scoreSignals(input: ScoringInput): ScoringOutput {
  const { signals, manualAnswers } = input;

  // Score each category
  const pricingResult = scorePricing(signals);
  const trialResult = scoreTrial(signals);
  const cancelResult = scoreCancel(signals);

  // Apply manual overrides
  let pricingScore = pricingResult.score;
  let trialScore = trialResult.score;
  let cancelScore = cancelResult.score;

  if (manualAnswers) {
    pricingScore = applyManualOverride(pricingScore, manualAnswers.priceClarity);
    trialScore = applyManualOverride(trialScore, manualAnswers.trialClarity);
    cancelScore = applyManualOverride(cancelScore, manualAnswers.cancelClarity);

    // Add manual evidence items
    if (manualAnswers.priceClarity && manualAnswers.priceClarity !== 'not_sure') {
      pricingResult.evidence.push({
        key: 'manual_price',
        label: manualAnswers.priceClarity === 'yes' ? 'User confirmed: pricing is clear' : 'User reported: pricing unclear',
        value: manualAnswers.priceClarity === 'yes',
        source: 'user_input',
        confidence: 'high',
      });
    }

    if (manualAnswers.trialClarity && manualAnswers.trialClarity !== 'not_sure') {
      trialResult.evidence.push({
        key: 'manual_trial',
        label: manualAnswers.trialClarity === 'yes' ? 'User confirmed: trial terms are clear' : 'User reported: trial terms unclear',
        value: manualAnswers.trialClarity === 'yes',
        source: 'user_input',
        confidence: 'high',
      });
    }

    if (manualAnswers.cancelClarity && manualAnswers.cancelClarity !== 'not_sure') {
      cancelResult.evidence.push({
        key: 'manual_cancel',
        label: manualAnswers.cancelClarity === 'yes' ? 'User confirmed: cancellation is clear' : 'User reported: cancellation unclear',
        value: manualAnswers.cancelClarity === 'yes',
        source: 'user_input',
        confidence: 'high',
      });
    }
  }

  // Build category scores
  const categoryScores: CategoryScore[] = [
    { category: 'pricing', label: 'Pricing', score: pricingScore },
    { category: 'trials', label: 'Trials', score: trialScore },
    { category: 'cancellation', label: 'Cancellation', score: cancelScore },
  ];

  // Calculate weighted overall score
  const overallScore = Math.round(
    pricingScore * CATEGORY_WEIGHTS.pricing +
    trialScore * CATEGORY_WEIGHTS.trials +
    cancelScore * CATEGORY_WEIGHTS.cancellation
  );

  // Calculate confidence
  const confidence = calculateConfidence(pricingResult, trialResult, cancelResult);

  // Get rating label
  const ratingLabel = getRatingLabel(overallScore);

  // Combine all evidence
  const evidenceItems = [
    ...pricingResult.evidence,
    ...trialResult.evidence,
    ...cancelResult.evidence,
  ];

  return {
    overallScore,
    ratingLabel,
    confidence,
    categoryScores,
    evidenceItems,
  };
}

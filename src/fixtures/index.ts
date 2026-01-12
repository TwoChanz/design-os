// =============================================================================
// SubSense Development Fixtures
// Based on product/sample-data/*.json
// =============================================================================

import type { ScoreReport, Subscription, EvidenceResponse } from '../state-machine/types';

// -----------------------------------------------------------------------------
// Score Reports
// -----------------------------------------------------------------------------

export const scoreReportFixtures: ScoreReport[] = [
  {
    id: 'sr_01HQXK9M2N3P4R5S6T7U8V9W',
    createdAt: '2026-01-12T14:32:00Z',
    domain: 'acmesaas.com',
    url: 'https://acmesaas.com/pricing',
    overallScore: 78,
    ratingLabel: 'Clear',
    confidence: 'high',
    categoryScores: [
      { category: 'pricing', label: 'Pricing', score: 85 },
      { category: 'trials', label: 'Trials', score: 72 },
      { category: 'cancellation', label: 'Cancellation', score: 68 },
      { category: 'data', label: 'Data Practices', score: 82 },
      { category: 'permissions', label: 'Permissions', score: 83 },
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
        label: 'Trial duration stated — 14 days',
        value: true,
        source: 'detected',
        confidence: 'high',
      },
      {
        key: 'trial_limits',
        label: 'Trial limitations mentioned',
        value: true,
        source: 'detected',
        confidence: 'medium',
      },
      {
        key: 'cancel_link',
        label: 'Cancellation info found in footer',
        value: true,
        source: 'detected',
        confidence: 'medium',
      },
      {
        key: 'privacy_policy',
        label: 'Privacy policy linked',
        value: true,
        source: 'detected',
        confidence: 'high',
      },
    ],
    notes: null,
  },
  {
    id: 'sr_02HQXK8L1M2N3O4P5Q6R7S8T',
    createdAt: '2026-01-11T09:15:00Z',
    domain: 'streamify.io',
    url: 'https://streamify.io/subscribe',
    overallScore: 52,
    ratingLabel: 'Mixed',
    confidence: 'high',
    categoryScores: [
      { category: 'pricing', label: 'Pricing', score: 70 },
      { category: 'trials', label: 'Trials', score: 45 },
      { category: 'cancellation', label: 'Cancellation', score: 38 },
      { category: 'data', label: 'Data Practices', score: 55 },
      { category: 'permissions', label: 'Permissions', score: 52 },
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
        label: 'Trial duration unclear',
        value: false,
        source: 'detected',
        confidence: 'medium',
      },
      {
        key: 'auto_renew',
        label: 'Auto-renewal terms not prominently displayed',
        value: false,
        source: 'detected',
        confidence: 'medium',
      },
      {
        key: 'cancel_link',
        label: 'No cancellation info on signup page',
        value: false,
        source: 'detected',
        confidence: 'high',
      },
      {
        key: 'data_sharing',
        label: 'Third-party data sharing mentioned',
        value: true,
        source: 'detected',
        confidence: 'medium',
      },
    ],
    notes: null,
  },
  {
    id: 'sr_03HQXK7K0L1M2N3O4P5Q6R7S',
    createdAt: '2026-01-10T16:45:00Z',
    domain: 'darkpattern.example',
    url: 'https://darkpattern.example/checkout',
    overallScore: 28,
    ratingLabel: 'Risky',
    confidence: 'high',
    categoryScores: [
      { category: 'pricing', label: 'Pricing', score: 35 },
      { category: 'trials', label: 'Trials', score: 20 },
      { category: 'cancellation', label: 'Cancellation', score: 15 },
      { category: 'data', label: 'Data Practices', score: 40 },
      { category: 'permissions', label: 'Permissions', score: 30 },
    ],
    evidenceItems: [
      {
        key: 'price_hidden',
        label: 'Final price only shown at checkout',
        value: false,
        source: 'detected',
        confidence: 'high',
      },
      {
        key: 'trial_auto_convert',
        label: 'Trial auto-converts without clear notice',
        value: false,
        source: 'detected',
        confidence: 'high',
      },
      {
        key: 'cancel_friction',
        label: 'Cancellation requires phone call',
        value: false,
        source: 'detected',
        confidence: 'medium',
      },
      {
        key: 'pre_checked',
        label: 'Pre-checked add-ons detected',
        value: false,
        source: 'detected',
        confidence: 'high',
      },
    ],
    notes: null,
  },
  {
    id: 'sr_04HQXK6J9K0L1M2N3O4P5Q6R',
    createdAt: '2026-01-09T11:20:00Z',
    domain: 'securebank.com',
    url: 'https://securebank.com/premium',
    overallScore: 45,
    ratingLabel: 'Mixed',
    confidence: 'low',
    categoryScores: [
      { category: 'pricing', label: 'Pricing', score: 50 },
      { category: 'trials', label: 'Trials', score: 40 },
      { category: 'cancellation', label: 'Cancellation', score: 35 },
      { category: 'data', label: 'Data Practices', score: 50 },
      { category: 'permissions', label: 'Permissions', score: 50 },
    ],
    evidenceItems: [
      {
        key: 'price_easy_find',
        label: 'User confirmed: price easy to find',
        value: true,
        source: 'user_input',
        confidence: 'medium',
      },
      {
        key: 'trial_limits_clear',
        label: 'User confirmed: trial limits unclear',
        value: false,
        source: 'user_input',
        confidence: 'medium',
      },
      {
        key: 'cancel_steps_clear',
        label: 'User confirmed: cancellation steps unclear',
        value: false,
        source: 'user_input',
        confidence: 'medium',
      },
    ],
    notes: 'Scored manually — page blocked automated analysis (CSP restriction)',
  },
];

// -----------------------------------------------------------------------------
// Subscriptions
// -----------------------------------------------------------------------------

export const subscriptionFixtures: Subscription[] = [
  {
    id: 'sub_01HQXK9P4Q5R6S7T8U9V0W1X',
    name: 'Streamify Pro',
    domain: 'streamify.io',
    monthlyCost: 14.99,
    status: 'active',
    renewalDate: '2026-02-11',
    notes: 'Annual plan, billed monthly',
    createdAt: '2026-01-11T09:20:00Z',
    updatedAt: '2026-01-11T09:20:00Z',
  },
  {
    id: 'sub_02HQXK8O3P4Q5R6S7T8U9V0W',
    name: 'Cloud Storage Plus',
    domain: 'cloudstorage.example',
    monthlyCost: 9.99,
    status: 'active',
    renewalDate: '2026-01-28',
    notes: null,
    createdAt: '2025-12-28T15:30:00Z',
    updatedAt: '2025-12-28T15:30:00Z',
  },
  {
    id: 'sub_03HQXK7N2O3P4Q5R6S7T8U9V',
    name: 'Design Tool Pro',
    domain: 'designtool.app',
    monthlyCost: 24.0,
    status: 'canceled',
    renewalDate: null,
    notes: 'Canceled — switched to free tier',
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2026-01-05T08:45:00Z',
  },
];

// -----------------------------------------------------------------------------
// Evidence Responses (for Evidence Prompt)
// -----------------------------------------------------------------------------

export const evidenceResponseFixtures: EvidenceResponse[] = [
  { questionId: 'price_clarity', question: 'Was the price easy to find?', answer: 'yes' },
  {
    questionId: 'trial_clarity',
    question: 'Were trial terms clearly explained?',
    answer: 'not_sure',
  },
  { questionId: 'cancel_clarity', question: 'Were cancellation steps clear?', answer: 'no' },
];

// -----------------------------------------------------------------------------
// Seed Functions (for development)
// -----------------------------------------------------------------------------

export async function seedFixtures(): Promise<void> {
  const { storage } = await import('../storage/adapter');

  // Seed score reports
  for (const report of scoreReportFixtures) {
    await storage.saveScoreReport(report);
  }

  // Seed subscriptions
  for (const sub of subscriptionFixtures) {
    await storage.saveSubscription(sub);
  }

  console.log('Fixtures seeded successfully');
}

export async function clearAndSeedFixtures(): Promise<void> {
  const { storage } = await import('../storage/adapter');
  await storage.clearAll();
  await seedFixtures();
}

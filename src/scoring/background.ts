// =============================================================================
// SubSense Background Service Worker
// Handles message passing and orchestrates scoring
// =============================================================================

import type { ScoreReport, EvidenceResponse } from '../state-machine/types';
import type { ExtractedSignals } from './extractor';
import { scoreSignals, type ManualAnswers, type ScoringOutput } from './scorer';

// -----------------------------------------------------------------------------
// Message Types
// -----------------------------------------------------------------------------

export type BackgroundMessage =
  | { type: 'ANALYZE_PAGE' }
  | { type: 'RESCORE_WITH_ANSWERS'; payload: { signals: ExtractedSignals; answers: ManualAnswers } }
  | { type: 'GET_TAB_INFO' };

export type BackgroundResponse =
  | { type: 'SCORE_RESULT'; payload: ScoreReport; shouldPrompt: boolean }
  | { type: 'ERROR'; payload: { code: 'CSP' | 'PERMISSION' | 'UNKNOWN'; message: string } }
  | { type: 'TAB_INFO'; payload: { url: string; domain: string } };

// -----------------------------------------------------------------------------
// Score Report Builder
// -----------------------------------------------------------------------------

function buildScoreReport(
  output: ScoringOutput,
  domain: string,
  url: string
): ScoreReport {
  return {
    id: `sr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    domain,
    url,
    overallScore: output.overallScore,
    ratingLabel: output.ratingLabel,
    confidence: output.confidence,
    categoryScores: output.categoryScores,
    evidenceItems: output.evidenceItems,
    notes: null,
  };
}

// -----------------------------------------------------------------------------
// Content Script Injection
// -----------------------------------------------------------------------------

async function extractFromTab(tabId: number): Promise<ExtractedSignals> {
  // Inject the extractor function and run it
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      // This runs in the page context
      // We inline the extraction logic here since we can't import modules

      const PATTERNS = {
        price: /\$\d+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:USD|EUR|GBP)|\b(?:free|paid)\s*plan/gi,
        billingCycle: /\b(?:month(?:ly)?|year(?:ly)?|annual(?:ly)?|per\s*(?:month|year)|billed?\s*(?:monthly|annually|yearly)|\/\s*mo(?:nth)?|\/\s*yr)\b/gi,
        contactSales: /\b(?:contact\s*(?:us|sales)|request\s*(?:a\s*)?(?:demo|quote)|get\s*(?:a\s*)?quote|talk\s*to\s*sales|schedule\s*(?:a\s*)?(?:call|demo))\b/gi,
        trial: /\b(?:free\s*trial|trial\s*(?:period|offer)?|try\s*(?:it\s*)?free|start\s*(?:your\s*)?free)\b/gi,
        trialDuration: /(\d+)\s*[-]?\s*(day|week|month)s?\s*(?:free\s*)?trial|trial\s*(?:for\s*)?(\d+)\s*[-]?\s*(day|week|month)s?|free\s*for\s*(\d+)\s*(day|week|month)s?/gi,
        autoRenew: /\b(?:auto(?:matic(?:ally)?)?[-\s]*renew|renews?\s*auto|subscription\s*(?:will\s*)?(?:automatically\s*)?renew|recurring\s*(?:billing|charge)|billed?\s*automatically)\b/gi,
        cancel: /\b(?:cancel(?:lation)?|unsubscribe|terminate|end\s*(?:your\s*)?(?:subscription|membership)|stop\s*(?:your\s*)?(?:subscription|billing))\b/gi,
        cancelSteps: /\b(?:account\s*settings?|billing\s*settings?|manage\s*subscription|subscription\s*(?:settings?|management)|my\s*account|settings?\s*>\s*billing|profile\s*>\s*subscription)\b/gi,
        refund: /\b(?:refund|money[-\s]*back|return\s*policy|full\s*refund|pro[-\s]*rata)\b/gi,
        contact: /\b(?:contact(?:\s*us)?|support|help\s*(?:center|desk)?|customer\s*service|live\s*chat)\b/gi,
      };

      // Get visible text
      function getVisibleText(): string {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
          acceptNode: (node) => {
            const el = node.parentElement;
            if (!el) return NodeFilter.FILTER_REJECT;
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') return NodeFilter.FILTER_REJECT;
            const tag = el.tagName.toLowerCase();
            if (['script', 'style', 'noscript', 'svg'].includes(tag)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        });
        const parts: string[] = [];
        let node: Node | null;
        while ((node = walker.nextNode())) {
          const text = node.textContent?.trim();
          if (text) parts.push(text);
        }
        return parts.join(' ').replace(/\s+/g, ' ').toLowerCase().trim();
      }

      const pageText = getVisibleText();
      const priceMatches = pageText.match(PATTERNS.price) || [];
      const trialDurationMatches = pageText.match(PATTERNS.trialDuration);
      const billingCycleMatches = pageText.match(PATTERNS.billingCycle);

      return {
        url: window.location.href,
        domain: window.location.hostname,
        title: document.title,
        pageText,
        links: Array.from(document.querySelectorAll('a[href]')).map((a) => ({
          href: (a.getAttribute('href') || '').toLowerCase(),
          text: (a.textContent || '').toLowerCase().trim(),
        })),
        hints: {
          foundPriceTokens: priceMatches.length > 0,
          foundBillingCycleTokens: PATTERNS.billingCycle.test(pageText),
          foundContactSalesTokens: PATTERNS.contactSales.test(pageText),
          foundTrialTokens: PATTERNS.trial.test(pageText),
          foundTrialDurationTokens: PATTERNS.trialDuration.test(pageText),
          foundAutoRenewTokens: PATTERNS.autoRenew.test(pageText),
          foundCancelTokens: PATTERNS.cancel.test(pageText),
          foundCancelStepsTokens: PATTERNS.cancelSteps.test(pageText),
          foundRefundTokens: PATTERNS.refund.test(pageText),
          foundContactTokens: PATTERNS.contact.test(pageText),
        },
        extracted: {
          priceMatches: priceMatches.slice(0, 5),
          trialDurationMatch: trialDurationMatches ? trialDurationMatches[0] : null,
          billingCycleMatch: billingCycleMatches ? billingCycleMatches[0] : null,
        },
      };
    },
  });

  if (!results || results.length === 0 || !results[0].result) {
    throw new Error('Failed to extract page content');
  }

  return results[0].result as ExtractedSignals;
}

// -----------------------------------------------------------------------------
// Message Handler
// -----------------------------------------------------------------------------

export async function handleMessage(
  message: BackgroundMessage
): Promise<BackgroundResponse> {
  try {
    if (message.type === 'ANALYZE_PAGE') {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab?.id || !tab.url) {
        throw new Error('No active tab found');
      }

      // Check for restricted URLs
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        return {
          type: 'ERROR',
          payload: { code: 'CSP', message: 'Cannot analyze browser pages' },
        };
      }

      // Extract signals from page
      let signals: ExtractedSignals;
      try {
        signals = await extractFromTab(tab.id);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        if (message.includes('Cannot access') || message.includes('permission')) {
          return {
            type: 'ERROR',
            payload: { code: 'PERMISSION', message },
          };
        }
        return {
          type: 'ERROR',
          payload: { code: 'CSP', message },
        };
      }

      // Run scoring engine
      const output = scoreSignals({ signals });

      // Build report
      const report = buildScoreReport(output, signals.domain, signals.url);

      // Determine if we should prompt for manual answers
      const shouldPrompt = output.confidence === 'low';

      return {
        type: 'SCORE_RESULT',
        payload: report,
        shouldPrompt,
      };
    }

    if (message.type === 'RESCORE_WITH_ANSWERS') {
      const { signals, answers } = message.payload;

      // Re-run scoring with manual answers
      const output = scoreSignals({ signals, manualAnswers: answers });

      // Build updated report
      const report = buildScoreReport(output, signals.domain, signals.url);

      return {
        type: 'SCORE_RESULT',
        payload: report,
        shouldPrompt: false,
      };
    }

    if (message.type === 'GET_TAB_INFO') {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const url = tab?.url || '';
      const domain = url ? new URL(url).hostname : '';

      return {
        type: 'TAB_INFO',
        payload: { url, domain },
      };
    }

    throw new Error('Unknown message type');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      type: 'ERROR',
      payload: { code: 'UNKNOWN', message },
    };
  }
}

// -----------------------------------------------------------------------------
// Development Mock (for testing without Chrome APIs)
// -----------------------------------------------------------------------------

export function getMockSignals(): ExtractedSignals {
  const pageTypes = ['pricing', 'trial', 'generic'];
  const type = pageTypes[Math.floor(Math.random() * pageTypes.length)];

  const base: ExtractedSignals = {
    url: 'https://example.com',
    domain: 'example.com',
    title: 'Example App',
    pageText: '',
    links: [],
    hints: {
      foundPriceTokens: false,
      foundBillingCycleTokens: false,
      foundContactSalesTokens: false,
      foundTrialTokens: false,
      foundTrialDurationTokens: false,
      foundAutoRenewTokens: false,
      foundCancelTokens: false,
      foundCancelStepsTokens: false,
      foundRefundTokens: false,
      foundContactTokens: false,
    },
    extracted: {
      priceMatches: [],
      trialDurationMatch: null,
      billingCycleMatch: null,
    },
  };

  if (type === 'pricing') {
    return {
      ...base,
      url: 'https://example.com/pricing',
      title: 'Example App - Pricing',
      pageText: '$9.99/month $19.99/month billed monthly cancel anytime 14-day free trial auto-renews',
      links: [
        { href: '/cancel', text: 'cancel subscription' },
        { href: '/privacy', text: 'privacy policy' },
      ],
      hints: {
        ...base.hints,
        foundPriceTokens: true,
        foundBillingCycleTokens: true,
        foundTrialTokens: true,
        foundTrialDurationTokens: true,
        foundAutoRenewTokens: true,
        foundCancelTokens: true,
        foundCancelStepsTokens: true,
      },
      extracted: {
        priceMatches: ['$9.99', '$19.99'],
        trialDurationMatch: '14-day free trial',
        billingCycleMatch: 'monthly',
      },
    };
  }

  if (type === 'trial') {
    return {
      ...base,
      url: 'https://example.com/signup',
      title: 'Start Your Free Trial',
      pageText: 'start your free trial try it free contact us to cancel',
      links: [],
      hints: {
        ...base.hints,
        foundTrialTokens: true,
        foundCancelTokens: true,
        foundContactSalesTokens: true,
      },
      extracted: base.extracted,
    };
  }

  // Generic - low information
  return {
    ...base,
    pageText: 'welcome to our website contact us for more information',
    hints: {
      ...base.hints,
      foundContactTokens: true,
    },
  };
}

// -----------------------------------------------------------------------------
// Register Listener (for actual extension)
// -----------------------------------------------------------------------------

export function registerBackgroundListeners(): void {
  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      handleMessage(message as BackgroundMessage)
        .then(sendResponse)
        .catch((err) => {
          sendResponse({
            type: 'ERROR',
            payload: { code: 'UNKNOWN', message: err.message },
          });
        });

      // Return true to indicate async response
      return true;
    });
  }
}

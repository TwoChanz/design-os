// =============================================================================
// SubSense Evidence Extractor
// Content script: extracts signals from DOM, does NOT score
// =============================================================================

// -----------------------------------------------------------------------------
// Extraction Result (sent to background)
// -----------------------------------------------------------------------------

export interface ExtractedSignals {
  // Page metadata
  url: string;
  domain: string;
  title: string;

  // Raw text (trimmed, for pattern matching in background)
  pageText: string;

  // Links found
  links: Array<{ href: string; text: string }>;

  // Structured hints (boolean signals)
  hints: {
    // Pricing
    foundPriceTokens: boolean;
    foundBillingCycleTokens: boolean; // monthly/yearly/annual
    foundContactSalesTokens: boolean;

    // Trial
    foundTrialTokens: boolean;
    foundTrialDurationTokens: boolean;
    foundAutoRenewTokens: boolean;

    // Cancellation
    foundCancelTokens: boolean;
    foundCancelStepsTokens: boolean; // settings, account, billing
    foundRefundTokens: boolean;

    // Support
    foundContactTokens: boolean;
  };

  // Extracted values
  extracted: {
    priceMatches: string[]; // "$9.99", "$19/mo", etc.
    trialDurationMatch: string | null; // "14 days", "7-day", etc.
    billingCycleMatch: string | null; // "monthly", "annually", etc.
  };
}

// -----------------------------------------------------------------------------
// Token Patterns (simple presence detection)
// -----------------------------------------------------------------------------

const PATTERNS = {
  // Pricing
  price: /\$\d+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:USD|EUR|GBP)|\b(?:free|paid)\s*plan/gi,
  billingCycle: /\b(?:month(?:ly)?|year(?:ly)?|annual(?:ly)?|per\s*(?:month|year)|billed?\s*(?:monthly|annually|yearly)|\/\s*mo(?:nth)?|\/\s*yr)\b/gi,
  contactSales: /\b(?:contact\s*(?:us|sales)|request\s*(?:a\s*)?(?:demo|quote)|get\s*(?:a\s*)?quote|talk\s*to\s*sales|schedule\s*(?:a\s*)?(?:call|demo))\b/gi,

  // Trial
  trial: /\b(?:free\s*trial|trial\s*(?:period|offer)?|try\s*(?:it\s*)?free|start\s*(?:your\s*)?free)\b/gi,
  trialDuration: /(\d+)\s*[-]?\s*(day|week|month)s?\s*(?:free\s*)?trial|trial\s*(?:for\s*)?(\d+)\s*[-]?\s*(day|week|month)s?|free\s*for\s*(\d+)\s*(day|week|month)s?/gi,
  autoRenew: /\b(?:auto(?:matic(?:ally)?)?[-\s]*renew|renews?\s*auto|subscription\s*(?:will\s*)?(?:automatically\s*)?renew|recurring\s*(?:billing|charge)|billed?\s*automatically)\b/gi,

  // Cancellation
  cancel: /\b(?:cancel(?:lation)?|unsubscribe|terminate|end\s*(?:your\s*)?(?:subscription|membership)|stop\s*(?:your\s*)?(?:subscription|billing))\b/gi,
  cancelSteps: /\b(?:account\s*settings?|billing\s*settings?|manage\s*subscription|subscription\s*(?:settings?|management)|my\s*account|settings?\s*>\s*billing|profile\s*>\s*subscription)\b/gi,
  refund: /\b(?:refund|money[-\s]*back|return\s*policy|full\s*refund|pro[-\s]*rata)\b/gi,

  // Support
  contact: /\b(?:contact(?:\s*us)?|support|help\s*(?:center|desk)?|customer\s*service|live\s*chat)\b/gi,
};

// -----------------------------------------------------------------------------
// DOM Text Extraction
// -----------------------------------------------------------------------------

function getVisibleText(): string {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const el = node.parentElement;
        if (!el) return NodeFilter.FILTER_REJECT;

        // Skip hidden elements
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') {
          return NodeFilter.FILTER_REJECT;
        }

        // Skip script/style
        const tag = el.tagName.toLowerCase();
        if (['script', 'style', 'noscript', 'svg'].includes(tag)) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  const parts: string[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node.textContent?.trim();
    if (text) parts.push(text);
  }

  return parts.join(' ').replace(/\s+/g, ' ').toLowerCase().trim();
}

function extractLinks(): Array<{ href: string; text: string }> {
  return Array.from(document.querySelectorAll('a[href]')).map((a) => ({
    href: (a.getAttribute('href') || '').toLowerCase(),
    text: (a.textContent || '').toLowerCase().trim(),
  }));
}

// -----------------------------------------------------------------------------
// Main Extraction Function
// -----------------------------------------------------------------------------

export function extractSignals(): ExtractedSignals {
  const url = window.location.href;
  const domain = window.location.hostname;
  const title = document.title;
  const pageText = getVisibleText();
  const links = extractLinks();

  // Run pattern matching
  const priceMatches = pageText.match(PATTERNS.price) || [];
  const trialDurationMatches = pageText.match(PATTERNS.trialDuration);
  const billingCycleMatches = pageText.match(PATTERNS.billingCycle);

  return {
    url,
    domain,
    title,
    pageText,
    links,
    hints: {
      // Pricing
      foundPriceTokens: priceMatches.length > 0,
      foundBillingCycleTokens: PATTERNS.billingCycle.test(pageText),
      foundContactSalesTokens: PATTERNS.contactSales.test(pageText),

      // Trial
      foundTrialTokens: PATTERNS.trial.test(pageText),
      foundTrialDurationTokens: PATTERNS.trialDuration.test(pageText),
      foundAutoRenewTokens: PATTERNS.autoRenew.test(pageText),

      // Cancellation
      foundCancelTokens: PATTERNS.cancel.test(pageText),
      foundCancelStepsTokens: PATTERNS.cancelSteps.test(pageText),
      foundRefundTokens: PATTERNS.refund.test(pageText),

      // Support
      foundContactTokens: PATTERNS.contact.test(pageText),
    },
    extracted: {
      priceMatches: priceMatches.slice(0, 5), // Limit to 5
      trialDurationMatch: trialDurationMatches ? trialDurationMatches[0] : null,
      billingCycleMatch: billingCycleMatches ? billingCycleMatches[0] : null,
    },
  };
}

// -----------------------------------------------------------------------------
// Chrome Message Handler (runs in content script context)
// -----------------------------------------------------------------------------

export function handleExtractRequest(): ExtractedSignals {
  return extractSignals();
}

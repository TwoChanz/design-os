# SubSense

## Description
SubSense is a privacy-first Chrome extension that helps users make informed subscription decisions by surfacing a ClarityScore (0–100) on pricing and signup pages. It analyzes transparency signals—pricing clarity, trial terms, cancellation friction, data practices, and permission scope—so users can subscribe with confidence.

## Problems & Solutions

### Problem 1: Opaque pricing and trial terms
SubSense scans pages for pricing transparency and trial clarity, surfacing signals that indicate whether terms are clearly disclosed.

### Problem 2: Hidden cancellation friction
The extension detects patterns associated with difficult cancellation processes, warning users before they commit.

### Problem 3: Unclear data and permission practices
SubSense evaluates data/AI disclosure clarity and extension permission scope, helping users understand what they're agreeing to.

### Problem 4: No centralized view of subscriptions
Users can manually track their subscriptions with a running monthly total, all stored locally with no account required.

## Key Features
- ClarityScore (0–100) with breakdown by category
- Manual "Score this page" activation (no background scanning)
- Local-only storage, no accounts, no telemetry by default
- Evidence Prompt for low-confidence scores (3 quick questions to improve accuracy)
- Shareable score cards
- Manual subscription tracker with monthly spend total
- Neutral, evidence-based language throughout

## Phase 1 Constraints
- Chrome extension popup UI only (no in-page overlays or web dashboard)
- Extension-first and local-only: no accounts, no backend, no telemetry by default
- Users manually trigger scoring via "Score this page" button

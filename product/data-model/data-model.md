# Data Model

## Entities

### ScoreReport
Represents one scoring run for a page, including the overall ClarityScore (0–100), confidence level, URL, and timestamp. This is the saved and shareable report that users can view in their history or export as a score card.

### CategoryScore
An individual transparency score for one of the five categories: pricing, trials, cancellation, data practices, or permissions. Each category contributes to the overall ScoreReport with its own score and relevant evidence.

### EvidenceItem
A single piece of evidence shown in the score breakdown. Each item has a confidence level and a source indicator: "detected" (extracted from page signals) or "user_input" (provided via the Evidence Prompt).

### EvidenceResponse
User answers to the 3-question Evidence Prompt, captured when page signals are insufficient to generate a confident score. Used to supplement detected signals and improve accuracy.

### Subscription
A manually-tracked subscription entry for the monthly spend tracker. Includes service name and monthlyCost. Phase 1 uses monthly cost only (no annual conversion).

### UserSettings
Local-only extension settings stored per installation. Includes rubricVersion (scoring rules version), onboardingSeen flag, and theme preference (future).

## Relationships

- ScoreReport has many CategoryScore
- ScoreReport has many EvidenceItem
- ScoreReport may have one EvidenceResponse (if the user completed the prompt)
- Subscription is standalone (not linked to ScoreReport in Phase 1)
- UserSettings is a singleton (one per extension installation)

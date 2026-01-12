# Page Scoring Specification

## Overview
The core extension popup UI for generating and displaying a ClarityScore. Users manually trigger scoring via "Score this page," then view results with category breakdowns, evidence items, and actions to save, share, or track subscriptions.

## User Flows
- Score a page: User clicks "Score this page" → Loading state → Success or Low-confidence result
- View score breakdown: User sees ScoreBadge, 5 CategoryScore rows (bars + numbers), and EvidenceItem list
- Improve low-confidence score: User clicks "Answer 3 questions" → Navigates to Evidence Prompt section
- Save report: User clicks Save → Report stored locally → Toast confirmation
- Share score card: User clicks Share → Score card image generated → Toast confirmation
- Add subscription: User clicks "Add Subscription" → Subscription Tracker pre-populated → Toast confirmation
- Handle errors: Blocked page or permission denied → Error state with explanation

## UI Requirements
- Popup-only, no in-page overlays
- Light theme, card-based layout
- Initial state: CTA button "Score this page" centered
- Loading state: Scanning/analyzing indicator with neutral messaging
- Success state: ScoreBadge (0–100 + Clear/Mixed/Risky label), 5 CategoryScore rows, EvidenceItem list, action buttons
- Low-confidence state: Score result + prompt banner to "Answer 3 questions"
- Error states: Blocked page (CSP), permission denied — clear explanation, no retry spam
- ScoreBadge: Number prominently displayed, label uses status colors (emerald/amber/rose)
- CategoryScore rows: Bar visualization + numeric score for: Pricing, Trials, Cancellation, Data Practices, Permissions
- EvidenceItem list: Each item shows confidence tag (high/medium/low) and source badge (detected/user_input)
- Actions: Save, Share (generates image), Add Subscription — all show toast on success
- Language: Neutral, evidence-based throughout — no "scam" or "fraudulent" labels

## Configuration
- shell: false

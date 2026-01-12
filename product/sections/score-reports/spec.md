# Score Reports Specification

## Overview
The "My Scores" section where users view their saved score history, open individual reports for detail, and share or delete reports. All data is stored locally with no account or sync required.

## User Flows
- View history: User navigates to My Scores → Sees list of saved ScoreReports sorted newest first
- Open detail: User taps a row → Opens Score Report Detail view (read-only Score Result layout)
- Share report: User clicks Share → Score card image generated → Toast: "Score card generated" (fallback: copy text summary → "Copied summary")
- Delete report: User clicks Delete → Confirm dialog → Report removed → Toast: "Deleted score" → Return to list
- Empty state: No saved scores → Show "No saved scores yet" + CTA "Score this page"
- Handle corrupted entry: Show "Couldn't load this report" → Allow delete only

## UI Requirements
- My Scores list view:
  - Each row displays: domain, score number, label (Clear/Mixed/Risky), createdAt (relative time), confidence indicator
  - Tapping row navigates to detail view
  - Sorted newest first
  - Empty state: "No saved scores yet" with "Score this page" CTA
- Score Report Detail view:
  - Reuses Score Result layout from Page Scoring (read-only)
  - Actions: Share, Delete
  - Delete requires confirmation before removing
- Toasts:
  - "Saved to My Scores" (triggered from Page Scoring)
  - "Score card generated" or "Copied summary" (fallback)
  - "Deleted score"
- Edge cases:
  - Share export fails → fallback to copy text summary
  - Corrupted storage entry → show error message, allow delete only
- Local-only storage messaging consistent with privacy positioning
- Light theme, card-based layout, avoid dense tables, 12–16px padding

## Configuration
- shell: false

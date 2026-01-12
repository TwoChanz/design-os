# Subscription Tracker Specification

## Overview
A manual subscription list with monthly spend total. Users add, edit, and delete subscriptions to track their recurring costs. No automation, bank scanning, or budgeting features — just a simple local tracker.

## User Flows
- View subscriptions: User opens Subscription Tracker → Sees monthly total at top + list of subscriptions
- Add subscription: User clicks "Add subscription" → Modal opens → Fills name, monthlyCost, optional renewalDate and notes → Save → Toast: "Subscription saved" → Monthly total updates
- Edit subscription: User clicks Edit on a row → Modal opens pre-filled → Makes changes → Save → Toast: "Subscription saved" → Monthly total updates
- Delete subscription: User clicks Delete on a row → Confirm dialog → Subscription removed → Toast: "Subscription deleted" → Monthly total updates
- Empty state: No subscriptions → Show "No subscriptions added yet" + CTA "Add subscription"
- Add from Page Scoring: User clicks "Add Subscription" from Score Result → Opens modal pre-populated with domain name

## UI Requirements
- Main view:
  - Monthly total displayed prominently at top (sum of all monthlyCost values)
  - Subscription list below, each row shows: name, monthly cost, status (active/paused/canceled), optional renewal date indicator
  - Row actions: Edit, Delete
- Add/Edit modal:
  - Fields: name (required), monthlyCost (required), renewalDate (optional), notes (optional)
  - Status selector: active/paused/canceled
  - Save button, Cancel/close button
- Empty state: "No subscriptions added yet" with "Add subscription" CTA
- Delete confirmation: Required before removing
- Toasts: "Subscription saved", "Subscription deleted"
- Monthly total updates immediately after any change
- No charts or analytics (Phase 1)
- Local-only storage, no sync, no account messaging
- Light theme, card-based layout, 12–16px padding
- Neutral, non-judgmental language throughout

## Configuration
- shell: false

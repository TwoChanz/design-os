# Phase 1 Popup Flows

End-to-end user flows across all Phase 1 sections, including navigation, data operations, and edge cases.

---

## Navigation Structure

**TabsNav (persistent):**
- **Scores** (default) — Page Scoring / My Scores
- **Subscriptions** — Subscription Tracker
- **Privacy** — Privacy Promise

**Back behavior:** Within popup context, Back returns to previous view in the same tab. Closing popup resets to Home (Scores tab, initial state).

---

## Flow 1: Score This Page (Success)

**Entry point:** User clicks extension icon on a pricing/signup page

**Steps:**
1. **Home (Initial State)** — CTA "Score this page" centered
2. User clicks "Score this page"
3. **Loading State** — "Analyzing page..." with spinner
4. Scoring engine analyzes page signals
5. **Score Result** — ScoreBadge, CategoryScores, EvidenceItems, Actions
6. User clicks "Save"
7. **Data write:** ScoreReport created and stored locally
8. **Toast:** "Saved to My Scores"
9. User navigates to My Scores (via tab or automatic)
10. **My Scores** — New ScoreReport appears at top of list

**Data operations:**
- Read: Page DOM/signals (content script)
- Write: ScoreReport (local storage)

**UI feedback:** Loading spinner → Score Result → Toast on save

**Back behavior:** From Score Result → returns to Initial State (clears current score)

**Edge cases:**
- User closes popup during loading → scoring aborted, no data saved
- Save fails (storage full) → Toast: "Couldn't save. Storage full." + suggest deleting old scores

---

## Flow 2: Score Low-Confidence → Evidence Prompt

**Entry point:** Score Result with low confidence indicator

**Steps:**
1. **Score Result (Low Confidence)** — Banner: "Low confidence — Answer 3 questions to improve accuracy"
2. User clicks "Answer 3 questions"
3. **Navigate to Evidence Prompt view**
4. **Evidence Prompt** — Header + 3 QuestionCards
5. User answers all 3 questions (Yes/No/Not sure)
6. Submit button becomes enabled
7. User clicks "Submit"
8. **Data write:** EvidenceResponse saved, linked to ScoreReport
9. Score recalculated with user input signals
10. **Data update:** ScoreReport updated with new score/confidence
11. **Navigate back to Score Result**
12. **Score Result (Updated)** — New score displayed, confidence improved
13. **Toast:** "Updated score with your answers"

**Data operations:**
- Read: Current ScoreReport
- Write: EvidenceResponse (new)
- Update: ScoreReport (recalculated score, updated confidence, new EvidenceItems with source: user_input)

**UI feedback:** Questions → Submit → Toast → Updated score

**Back behavior:**
- From Evidence Prompt (before submit) → Back returns to Score Result without saving
- After submit → automatically navigates to Score Result

**Edge cases:**
- User partially answers then clicks Back → no data saved, returns to low-confidence Score Result
- Recalculation doesn't change score → Toast: "Score unchanged, but confidence improved"

---

## Flow 3: Score Error (Blocked Page / CSP)

**Entry point:** User clicks "Score this page" on a blocked page

**Steps:**
1. **Home (Initial State)** — CTA "Score this page"
2. User clicks "Score this page"
3. **Loading State** — "Analyzing page..."
4. Content script blocked by CSP or page restrictions
5. **ErrorStateCard** displayed:
   - Title: "Can't analyze this page"
   - Message: "This page blocks extensions from reading content. This is common on banking, payment, and login pages."
   - Actions: "Answer questions manually" (optional), "Try another page"

**Data operations:** None (no ScoreReport created)

**UI feedback:** Loading → Error card with explanation

**Back behavior:** "Try another page" returns to Initial State

**Edge cases:**
- User clicks "Answer questions manually" → navigates to the same 3-question Evidence Prompt used in Flow 2 → user answers Yes/No/Not sure for each → Submit → generates a new ScoreReport based solely on user input (confidence: "low", all EvidenceItems have source: "user_input"). This allows users to manually score pages that block automated analysis.

---

## Flow 4: Score Error (Permission Denied)

**Entry point:** User clicks "Score this page" without granting host permission

**Steps:**
1. **Home (Initial State)** — CTA "Score this page"
2. User clicks "Score this page"
3. Extension lacks permission to read page
4. **ErrorStateCard** displayed:
   - Title: "Permission needed"
   - Message: "SubSense needs permission to read this page to analyze transparency signals."
   - Actions: "Grant permission" (opens Chrome permission prompt), "Learn more"
5. User clicks "Grant permission"
6. Chrome permission prompt appears
7. User grants permission
8. **Automatically retry scoring** → Loading → Score Result

**Data operations:** None until permission granted

**UI feedback:** Error card → Permission prompt → Retry on grant

**Back behavior:** N/A (user must grant permission or close popup)

**Edge cases:**
- User denies permission → remains on ErrorStateCard, "Grant permission" button still available
- Permission already granted but page still blocked → Flow 3 (CSP error)

---

## Flow 5: Share Success

**Entry point:** Score Result or Score Report Detail

**Steps:**
1. **Score Result** — User clicks "Share"
2. **Processing state** — Button shows loading spinner
3. Score card image generated (canvas render)
4. Image saved to downloads or clipboard
5. **Toast:** "Score card generated"

**Data operations:**
- Read: Current ScoreReport
- Write: Image file (browser download)

**UI feedback:** Button loading → Toast

**Back behavior:** N/A (action completes in place)

**Edge cases:**
- Download blocked by browser → attempt clipboard copy → Toast: "Score card copied to clipboard"

---

## Flow 6: Share Failure → Fallback

**Entry point:** Score Result or Score Report Detail

**Steps:**
1. **Score Result** — User clicks "Share"
2. **Processing state** — Button shows loading spinner
3. Image generation fails (canvas error, memory, etc.)
4. **Fallback:** Generate text summary, copy to clipboard
5. **Toast:** "Copied summary to clipboard"

**Text summary format:**
```
SubSense Score: 72/100 (Mixed)
Domain: example.com
Pricing: 85 | Trials: 60 | Cancellation: 45 | Data: 80 | Permissions: 90
Scored: Jan 12, 2026
```

**Data operations:**
- Read: Current ScoreReport
- Write: Text to clipboard

**UI feedback:** Button loading → Fallback toast

**Edge cases:**
- Clipboard also fails → Toast: "Couldn't share. Try again."

---

## Flow 7: View History + Open Detail

**Entry point:** My Scores tab (Scores tab after initial scoring)

**Steps:**
1. **My Scores** — List of saved ScoreReports (newest first)
2. User taps a row
3. **Navigate to Score Report Detail**
4. **Score Report Detail** — Full ScoreBadge, CategoryScores, EvidenceItems (read-only), Actions: Share, Delete

**Data operations:**
- Read: All ScoreReports (list), single ScoreReport (detail)

**UI feedback:** List → Detail view

**Back behavior:** From Detail → returns to My Scores list

**Edge cases:**
- Corrupted ScoreReport entry → Row shows "Couldn't load this report" + Delete button only
- Empty list → EmptyStateCard: "No saved scores yet" + CTA "Score this page"

---

## Flow 8: Delete Score

**Entry point:** Score Report Detail

**Steps:**
1. **Score Report Detail** — User clicks "Delete"
2. **ConfirmDialog** opens:
   - Title: "Delete this score?"
   - Message: "This will permanently remove this score report."
   - Actions: "Cancel", "Delete"
3. User clicks "Delete"
4. **Data delete:** ScoreReport removed from local storage
5. **Toast:** "Deleted score"
6. **Navigate back to My Scores**
7. **My Scores** — List updates (item removed)

**Data operations:**
- Delete: ScoreReport (and associated EvidenceResponse if exists)

**UI feedback:** Confirm dialog → Toast → Return to list

**Back behavior:** Cancel in dialog → returns to Detail view

**Edge cases:**
- Delete fails (storage error) → Toast: "Couldn't delete. Try again."
- Last score deleted → My Scores shows EmptyStateCard

---

## Flow 9: Add Subscription from Score Result

**Entry point:** Score Result (after scoring a page)

**Steps:**
1. **Score Result** — User clicks "Add Subscription"
2. **ModalShell** opens with **SubscriptionForm**
   - name field pre-filled with domain (e.g., "example.com")
   - monthlyCost empty (required)
   - status defaults to "active"
   - renewalDate and notes empty (optional)
3. User fills monthlyCost (required)
4. User optionally fills other fields
5. User clicks "Save"
6. **Data write:** Subscription created in local storage
7. **Toast:** "Subscription saved"
8. Modal closes
9. User navigates to Subscriptions tab
10. **Subscriptions** — New item in list, monthly total updated

**Data operations:**
- Write: Subscription (new)

**UI feedback:** Modal → Form → Toast → Modal closes

**Back behavior:** Cancel/close modal → returns to Score Result, no data saved

**Edge cases:**
- Subscription with same name exists → Toast: "Subscription already exists" + option to "View existing" or "Save anyway"
- monthlyCost left empty → form validation error, Save disabled

---

## Flow 10: Subscription Tracker (Full CRUD)

### 10a: View Subscriptions (with data)

**Entry point:** Subscriptions tab

**Steps:**
1. User clicks Subscriptions tab
2. **Subscriptions view** — Monthly total at top, list below
3. Each row shows: name, monthlyCost, status badge, renewalDate (if set)

**Data operations:**
- Read: All Subscriptions, calculate sum of monthlyCost

---

### 10b: Empty State

**Entry point:** Subscriptions tab (no subscriptions)

**Steps:**
1. User clicks Subscriptions tab
2. **EmptyStateCard**:
   - Title: "No subscriptions added yet"
   - Message: "Track your recurring costs in one place."
   - CTA: "Add subscription"
3. User clicks "Add subscription"
4. → Flow 10c (Add)

---

### 10c: Add Subscription

**Entry point:** Subscriptions view or Empty State CTA

**Steps:**
1. User clicks "Add subscription"
2. **ModalShell** opens with **SubscriptionForm** (empty)
3. User fills name (required), monthlyCost (required)
4. User optionally sets status, renewalDate, notes
5. User clicks "Save"
6. **Data write:** Subscription created
7. **Toast:** "Subscription saved"
8. Modal closes
9. **Subscriptions view** — New item in list, monthly total updated

**Data operations:**
- Write: Subscription (new)

**UI feedback:** Modal → Form → Toast → List updates

---

### 10d: Edit Subscription

**Entry point:** Subscriptions view

**Steps:**
1. User clicks Edit (pencil icon) on a subscription row
2. **ModalShell** opens with **SubscriptionForm** (pre-filled)
3. User modifies fields
4. User clicks "Save"
5. **Data update:** Subscription updated
6. **Toast:** "Subscription saved"
7. Modal closes
8. **Subscriptions view** — Row updated, monthly total recalculated if cost changed

**Data operations:**
- Read: Subscription (to pre-fill)
- Update: Subscription

**UI feedback:** Modal → Form → Toast → List updates

---

### 10e: Delete Subscription

**Entry point:** Subscriptions view

**Steps:**
1. User clicks Delete (trash icon) on a subscription row
2. **ConfirmDialog** opens:
   - Title: "Delete subscription?"
   - Message: "Remove [name] from your tracked subscriptions?"
   - Actions: "Cancel", "Delete"
3. User clicks "Delete"
4. **Data delete:** Subscription removed
5. **Toast:** "Subscription deleted"
6. **Subscriptions view** — Row removed, monthly total recalculated
7. If last subscription deleted → EmptyStateCard

**Data operations:**
- Delete: Subscription

**UI feedback:** Confirm dialog → Toast → List updates

---

## Flow 11: Privacy Tab

**Entry point:** Privacy tab

**Steps:**
1. User clicks Privacy tab
2. **Privacy Promise view**:
   - Header: "Your data stays yours"
   - Content:
     - "All data stored locally on your device"
     - "No accounts required"
     - "No data sent to servers"
     - "No tracking or telemetry"
   - Optional: Link to full privacy policy (opens in new tab)
   - Optional: "Clear all data" button (destructive, with confirm)

**Data operations:**
- Read only (display static content)
- Optional: Delete all (if "Clear all data" clicked)

**UI feedback:** Static informational view

**Back behavior:** N/A (tab navigation)

**Edge cases:**
- "Clear all data" clicked → ConfirmDialog: "Delete all SubSense data? This cannot be undone." → Confirm → All local storage cleared → Toast: "All data cleared" → Reset to initial state

---

## Navigation State Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        TabsNav                                   │
│  [Scores]              [Subscriptions]           [Privacy]       │
└─────────────────────────────────────────────────────────────────┘
      │                        │                        │
      ▼                        ▼                        ▼
┌─────────────┐        ┌─────────────────┐      ┌─────────────┐
│ Home        │        │ Subscriptions   │      │ Privacy     │
│ (Initial)   │        │ List + Total    │      │ Promise     │
└─────────────┘        └─────────────────┘      └─────────────┘
      │                        │
      │ "Score this page"      │ "Add subscription"
      ▼                        ▼
┌─────────────┐        ┌─────────────────┐
│ Loading     │        │ SubscriptionForm│
└─────────────┘        │ (Modal)         │
      │                └─────────────────┘
      ├─── Success ───────────┐
      │                       │
      ▼                       ▼
┌─────────────┐        ┌─────────────────┐
│ Score       │        │ Score Result    │
│ Result      │◄───────│ (Low Confidence)│
└─────────────┘        └─────────────────┘
      │                       │
      │ "Save"                │ "Answer 3 questions"
      ▼                       ▼
┌─────────────┐        ┌─────────────────┐
│ My Scores   │        │ Evidence Prompt │
│ (History)   │        └─────────────────┘
└─────────────┘               │
      │                       │ "Submit"
      │ Tap row               ▼
      ▼                ┌─────────────────┐
┌─────────────┐        │ Score Result    │
│ Score Report│        │ (Updated)       │
│ Detail      │        └─────────────────┘
└─────────────┘
```

---

## Data Model Summary

| Entity | Created | Read | Updated | Deleted |
|--------|---------|------|---------|---------|
| ScoreReport | Flow 1, 3 (manual) | Flow 5-8 | Flow 2 | Flow 8 |
| EvidenceResponse | Flow 2 | Flow 7 | — | Flow 8 (cascade) |
| Subscription | Flow 9, 10c | Flow 10a | Flow 10d | Flow 10e |
| UserSettings | Onboarding | All flows | Settings changes | Flow 11 (clear all) |

---

## Toast Messages Reference

| Context | Message |
|---------|---------|
| Save score | "Saved to My Scores" |
| Evidence submitted | "Updated score with your answers" |
| Share success | "Score card generated" |
| Share fallback | "Copied summary to clipboard" |
| Share failure | "Couldn't share. Try again." |
| Delete score | "Deleted score" |
| Subscription saved | "Subscription saved" |
| Subscription deleted | "Subscription deleted" |
| Clear all data | "All data cleared" |
| Storage error | "Couldn't save. Storage full." |

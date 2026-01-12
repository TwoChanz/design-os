# Popup UI State Machine — Phase 1

Version: 1.1.0

Defines all states, transitions, async operations, and navigation behavior for the SubSense Chrome extension popup.

**Phase 1 Design Decisions:**
- Save auto-navigates to My Scores (intentional UX choice to confirm persistence)
- All counts (scoreReportCount, subscriptionCount) stored in context, loaded from storage on popup open
- Modal parent state tracked explicitly via context.modalParentState
- All async operations dispatch success/failure events for proper state handling

---

## Top-Level States

| State | Description | Tab |
|-------|-------------|-----|
| `Home` | Initial state with "Score this page" CTA | Scores |
| `Loading` | Scoring in progress, spinner displayed | Scores |
| `Result` | Score result displayed (high or low confidence) | Scores |
| `EvidencePrompt` | 3-question form for manual input | Scores |
| `ErrorCSP` | Page blocked by CSP/restrictions | Scores |
| `ErrorPermission` | Extension lacks host permission | Scores |
| `MyScores` | List of saved score reports | Scores |
| `ScoreDetail` | Single score report detail view | Scores |
| `Subscriptions` | Subscription list with monthly total | Subscriptions |
| `Privacy` | Privacy promise static view | Privacy |
| `ModalOpen` | Overlay state (SubscriptionForm, ConfirmDialog) | Any |

---

## State Transitions

### Scores Tab Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                         SCORES TAB                                │
└──────────────────────────────────────────────────────────────────┘

     ┌─────────┐
     │  Home   │◄──────────────────────────────────────────────────┐
     └────┬────┘                                                    │
          │ SCORE_PAGE                                              │
          ▼                                                         │
     ┌─────────┐                                                    │
     │ Loading │──── SCORE_ERROR_CSP ────►┌───────────┐             │
     └────┬────┘                          │ ErrorCSP  │─── BACK ────┤
          │                               └─────┬─────┘             │
          │                                     │ ANSWER_MANUAL     │
          │ SCORE_ERROR_PERMISSION              ▼                   │
          │                          ┌────────────────┐             │
          │                          │ EvidencePrompt │◄────────┐   │
          │                          └───────┬────────┘         │   │
          │                                  │ SUBMIT           │   │
          │                                  ▼                  │   │
          │                          ┌────────────────┐         │   │
          ├──────────────────────────►    Result     │─────────┤   │
          │ SCORE_SUCCESS             │ (updated)    │ ANSWER_Q│   │
          │                          └───────┬───────┘         │   │
          │                                  │                 │   │
          │                                  │ SAVE            │   │
          │                                  ▼                 │   │
          │                          ┌────────────────┐        │   │
          │                          │   MyScores    │◄───┐    │   │
          │                          └───────┬───────┘    │    │   │
          │                                  │ SELECT     │    │   │
          │                                  ▼            │    │   │
          │                          ┌────────────────┐   │    │   │
          │                          │  ScoreDetail  │───┘    │   │
          │                          └───────────────┘ BACK   │   │
          │                                  │ DELETE         │   │
          │                                  ▼                │   │
          │                          (ConfirmDialog)──────────┘   │
          │                                                       │
          ▼                                                       │
     ┌─────────────────┐                                          │
     │ ErrorPermission │─── PERMISSION_GRANTED ───► Loading       │
     └────────┬────────┘                                          │
              │ BACK                                               │
              └───────────────────────────────────────────────────┘
```

### From → To Transition Table

| From | To | Trigger | Flow | Guard |
|------|----|---------|------|-------|
| `Home` | `Loading` | SCORE_PAGE | 1 | — |
| `Loading` | `Result` | SCORE_SUCCESS | 1 | — |
| `Loading` | `Result` | SCORE_LOW_CONFIDENCE | 2 | hasLowConfidence |
| `Loading` | `ErrorCSP` | SCORE_ERROR_CSP | 3 | notPageReadable |
| `Loading` | `ErrorPermission` | SCORE_ERROR_PERMISSION | 4 | notPermissionGranted |
| `Result` | `Home` | BACK | 1 | — |
| `Result` | `EvidencePrompt` | ANSWER_QUESTIONS | 2 | hasLowConfidence |
| `Result` | `MyScores` | SAVE | 1 | — | *Phase 1: auto-navigates* |
| `Result` | `ModalOpen` | ADD_SUBSCRIPTION | 9 | — |
| `EvidencePrompt` | (async) | SUBMIT | 2 | allQuestionsAnswered |
| `EvidencePrompt` | `Result` | RECALC_SUCCESS | 2 | — |
| `EvidencePrompt` | (stay) | RECALC_FAILURE | 2 | — |
| `EvidencePrompt` | `Result` | BACK | 2 | notSubmitting |
| `ErrorCSP` | `Home` | BACK | 3 | — |
| `ErrorCSP` | `EvidencePrompt` | ANSWER_MANUAL | 3 | — |
| `ErrorPermission` | `Home` | BACK | 4 | — |
| `ErrorPermission` | `Loading` | PERMISSION_GRANTED | 4 | permissionGranted |
| `MyScores` | `ScoreDetail` | SELECT_REPORT | 7 | — |
| `MyScores` | `Home` | SCORE_PAGE | 1 | — |
| `ScoreDetail` | `MyScores` | BACK | 7 | — |
| `ScoreDetail` | `MyScores` | DELETE_CONFIRMED | 8 | — |
| `ScoreDetail` | `ModalOpen` | DELETE | 8 | — |

### Subscriptions Tab

| From | To | Trigger | Flow | Guard |
|------|----|---------|------|-------|
| `Subscriptions` | `ModalOpen` | ADD_SUBSCRIPTION | 10c | — |
| `Subscriptions` | `ModalOpen` | EDIT_SUBSCRIPTION | 10d | — |
| `Subscriptions` | `ModalOpen` | DELETE_SUBSCRIPTION | 10e | — |
| `ModalOpen` | `Subscriptions` | MODAL_CLOSE | 10 | — |
| `ModalOpen` | `Subscriptions` | SAVE_SUBSCRIPTION | 10c/d | — |
| `ModalOpen` | `Subscriptions` | DELETE_CONFIRMED | 10e | — |

### Tab Navigation (Global)

| From | To | Trigger |
|------|----|---------|
| Any (Scores) | `Subscriptions` | TAB_SUBSCRIPTIONS |
| Any (Scores) | `Privacy` | TAB_PRIVACY |
| Any (Subscriptions) | `Home` or `MyScores` | TAB_SCORES |
| Any (Subscriptions) | `Privacy` | TAB_PRIVACY |
| Any (Privacy) | `Home` or `MyScores` | TAB_SCORES |
| Any (Privacy) | `Subscriptions` | TAB_SUBSCRIPTIONS |

**Note:** Tab switches from Scores tab preserve state:
- If user was on `MyScores`, returning to Scores tab goes to `MyScores`
- If user was mid-scoring (`Result`), returning clears to `Home`

---

## Async States

These states involve asynchronous operations:

| State | Async Operation | Side Effect | On Success | On Failure |
|-------|-----------------|-------------|------------|------------|
| `Loading` | Page analysis | `startScoring` | → `Result` | → `ErrorCSP` or `ErrorPermission` |
| `Result` (Share) | Image generation | `generateShareImage` | Toast: "Score card generated" | Fallback: `copyTextSummary` |
| `Result` (Save) | Local storage write | `saveScore` | Toast + → `MyScores` | Toast: "Couldn't save" |
| `EvidencePrompt` | Score recalculation | `recalcScore` | → `Result` (updated) | Toast: "Calculation failed" |
| `ModalOpen` | Subscription save | `saveSubscription` | Toast + close modal | Toast: "Couldn't save" |

### Async Indicator States

```
Loading:
  - isScoring: true
  - progress: "Analyzing page..."

Result (during Share):
  - isSharing: true
  - shareButton: loading spinner

Result (during Save):
  - isSaving: true
  - saveButton: loading spinner

EvidencePrompt (during Submit):
  - isSubmitting: true
  - submitButton: disabled + spinner
```

---

## Back Button Behavior

| Current State | Back Action | Result |
|---------------|-------------|--------|
| `Home` | — | No-op (nothing to go back to) |
| `Loading` | — | Disabled during async |
| `Result` | BACK | → `Home` (clears current score) |
| `EvidencePrompt` | BACK | → `Result` (no data saved) |
| `ErrorCSP` | BACK | → `Home` |
| `ErrorPermission` | BACK | → `Home` |
| `MyScores` | — | No back (top-level list) |
| `ScoreDetail` | BACK | → `MyScores` |
| `Subscriptions` | — | No back (top-level list) |
| `Privacy` | — | No back (top-level view) |
| `ModalOpen` | BACK or ESC | Close modal, return to parent state |

---

## Popup Close Behavior (Global Reset)

When the popup is closed (user clicks outside or presses ESC at top level):

| Previous State | On Reopen |
|----------------|-----------|
| `Home` | → `Home` |
| `Loading` | → `Home` (scoring aborted, no data) |
| `Result` (unsaved) | → `Home` (score discarded) |
| `Result` (saved) | → `MyScores` |
| `EvidencePrompt` | → `Home` (answers discarded) |
| `ErrorCSP` | → `Home` |
| `ErrorPermission` | → `Home` |
| `MyScores` | → `MyScores` (persisted) |
| `ScoreDetail` | → `MyScores` |
| `Subscriptions` | → `Subscriptions` (persisted) |
| `Privacy` | → `Home` |
| `ModalOpen` | → Parent state (modal discarded) |

**Persistence rule:** Only `MyScores` and `Subscriptions` persist across popup close because they reflect saved local data. All transient states (scoring flow, modals) reset to `Home`.

---

## Guards

| Guard | Condition |
|-------|-----------|
| `permissionGranted` | Extension has activeTab/host permission for current page |
| `notPermissionGranted` | Extension lacks permission for current page |
| `pageReadable` | Content script can access page DOM (no CSP block) |
| `notPageReadable` | Content script cannot access page DOM |
| `hasLowConfidence` | Current ScoreReport has `confidence: "low"` |
| `allQuestionsAnswered` | All 3 EvidencePrompt questions have answers |
| `notSubmitting` | Not currently in async submit operation |
| `isManualScore` | Scoring initiated from ErrorCSP → EvidencePrompt path |
| `hasScoreReports` | context.scoreReportCount > 0 |
| `noScoreReports` | context.scoreReportCount === 0 |
| `hasSubscriptions` | context.subscriptionCount > 0 |
| `noSubscriptions` | context.subscriptionCount === 0 |
| `isScoreDelete` | Modal is for deleting a ScoreReport |
| `isSubscriptionDelete` | Modal is for deleting a Subscription |
| `isClearAllData` | Modal is for clearing all data |

---

## Side Effects

| Effect | Trigger | Dispatches | Description |
|--------|---------|------------|-------------|
| `startScoring` | SCORE_PAGE | SCORE_SUCCESS, SCORE_LOW_CONFIDENCE, SCORE_ERROR_CSP, SCORE_ERROR_PERMISSION | Initiates content script page analysis |
| `saveScore` | SAVE | SAVE_SUCCESS, SAVE_FAILURE | Writes ScoreReport to local storage |
| `recalcScore` | SUBMIT | RECALC_SUCCESS, RECALC_FAILURE | Recalculates score with user input |
| `generateShareImage` | SHARE | SHARE_SUCCESS, SHARE_FAILURE | Renders score card to canvas |
| `copyTextSummary` | SHARE_FAILURE | — | Copies text summary to clipboard (fallback) |
| `deleteScore` | DELETE_CONFIRMED | DELETE_SCORE_SUCCESS, DELETE_SCORE_FAILURE | Removes ScoreReport from local storage |
| `saveSubscription` | SAVE_SUBSCRIPTION | SAVE_SUBSCRIPTION_SUCCESS, SAVE_SUBSCRIPTION_FAILURE | Writes Subscription to local storage |
| `deleteSubscription` | DELETE_CONFIRMED | DELETE_SUBSCRIPTION_SUCCESS, DELETE_SUBSCRIPTION_FAILURE | Removes Subscription from local storage |
| `requestPermission` | GRANT_PERMISSION | PERMISSION_GRANTED, PERMISSION_DENIED | Opens Chrome permission prompt |
| `clearAllData` | DELETE_CONFIRMED | CLEAR_ALL_SUCCESS, CLEAR_ALL_FAILURE | Clears all local storage data |
| `showToast` | Various | — | Displays toast notification |

---

## Toast Triggers by State

| State | Action | Toast Message |
|-------|--------|---------------|
| `Result` | Save success | "Saved to My Scores" |
| `Result` | Share success | "Score card generated" |
| `Result` | Share fallback | "Copied summary to clipboard" |
| `Result` | Share failure | "Couldn't share. Try again." |
| `Result` | Save failure | "Couldn't save. Storage full." |
| `EvidencePrompt` | Submit success | "Updated score with your answers" |
| `EvidencePrompt` | Submit failure | "Couldn't update score. Try again." |
| `ScoreDetail` | Delete success | "Deleted score" |
| `Subscriptions` | Save success | "Subscription saved" |
| `Subscriptions` | Delete success | "Subscription deleted" |
| `Privacy` | Clear all success | "All data cleared" |

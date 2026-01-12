# Shared Components Specification

Reusable UI components extracted from Phase 1 sections. All components are props-based, mostly stateless, and designed for Chrome extension popup constraints.

---

## Navigation

### TabsNav
Top-level navigation for the extension popup.

**Props:**
- `activeTab`: `'scores' | 'subscriptions' | 'privacy'`
- `onTabChange`: `(tab: string) => void`

**Visual states:** Default, active tab highlighted

**Used in:** All sections (persistent navigation)

---

## Score Display

### ScoreBadge
Displays the ClarityScore with status label and color.

**Props:**
- `score`: `number` (0–100)
- `label`: `'Clear' | 'Mixed' | 'Risky'`
- `size?`: `'sm' | 'md' | 'lg'` (default: 'md')
- `showLabel?`: `boolean` (default: true)

**Visual states:**
- Clear (emerald): score 70–100
- Mixed (amber): score 40–69
- Risky (rose): score 0–39

**Used in:** Page Scoring (Score Result), Score Reports (list rows, detail view)

---

### CategoryScoreRow
A single category score with label, bar visualization, and numeric value.

**Props:**
- `category`: `'pricing' | 'trials' | 'cancellation' | 'data' | 'permissions'`
- `label`: `string` (display name)
- `score`: `number` (0–100)
- `maxScore?`: `number` (default: 100)

**Visual states:** Bar fill based on score percentage, color follows status thresholds

**Used in:** Page Scoring (Score Result), Score Reports (detail view)

---

### EvidenceItemRow
Displays a single evidence item with confidence and source indicators.

**Props:**
- `text`: `string`
- `confidence`: `'high' | 'medium' | 'low'`
- `source`: `'detected' | 'user_input'`

**Visual states:**
- Confidence tag: high (solid), medium (muted), low (outline)
- Source badge: detected (auto icon), user_input (user icon)

**Used in:** Page Scoring (Score Result), Score Reports (detail view)

---

## Buttons

### PrimaryButton
Main action button with blue accent.

**Props:**
- `children`: `ReactNode`
- `onClick`: `() => void`
- `disabled?`: `boolean`
- `loading?`: `boolean`
- `fullWidth?`: `boolean`

**Visual states:** Default, hover, active, disabled, loading

**Used in:** All sections (primary CTAs)

---

### SecondaryButton
Secondary/ghost action button.

**Props:**
- `children`: `ReactNode`
- `onClick`: `() => void`
- `disabled?`: `boolean`
- `variant?`: `'outline' | 'ghost'` (default: 'outline')

**Visual states:** Default, hover, active, disabled

**Used in:** All sections (Back, Cancel, secondary actions)

---

### ActionButtonGroup
Horizontal group of action buttons for Score Result.

**Props:**
- `onSave?`: `() => void`
- `onShare?`: `() => void`
- `onAddSubscription?`: `() => void`
- `savedState?`: `'idle' | 'saving' | 'saved'`

**Visual states:** Buttons show loading/success states individually

**Used in:** Page Scoring (Score Result)

---

## Feedback

### Toast
Brief confirmation message that auto-dismisses.

**Props:**
- `message`: `string`
- `type?`: `'success' | 'error' | 'info'` (default: 'success')
- `duration?`: `number` (ms, default: 3000)
- `onDismiss?`: `() => void`

**Visual states:** Slide in from bottom, auto-dismiss with fade

**Used in:** All sections

---

## State Cards

### LoadingStateCard
Displayed while scanning/analyzing a page.

**Props:**
- `title?`: `string` (default: "Analyzing page...")
- `subtitle?`: `string`

**Visual states:** Animated spinner or pulse, neutral messaging

**Used in:** Page Scoring (loading state)

---

### ErrorStateCard
Displayed when an error occurs.

**Props:**
- `title`: `string`
- `message`: `string`
- `type?`: `'blocked' | 'permission' | 'generic'`
- `onRetry?`: `() => void`
- `onDismiss?`: `() => void`

**Visual states:** Error icon, muted colors (not alarming)

**Used in:** Page Scoring (blocked page, permission denied)

---

### EmptyStateCard
Displayed when a list has no items.

**Props:**
- `title`: `string`
- `message?`: `string`
- `ctaLabel?`: `string`
- `onCtaClick?`: `() => void`
- `icon?`: `ReactNode`

**Visual states:** Centered layout, muted icon, optional CTA button

**Used in:** Score Reports (empty history), Subscription Tracker (no subscriptions)

---

## Modals & Dialogs

### ModalShell
Base modal container with header, body, and footer slots.

**Props:**
- `isOpen`: `boolean`
- `onClose`: `() => void`
- `title`: `string`
- `children`: `ReactNode`
- `footer?`: `ReactNode`

**Visual states:** Backdrop overlay, centered modal, close button

**Used in:** Subscription Tracker (Add/Edit modal)

---

### ConfirmDialog
Confirmation dialog for destructive actions.

**Props:**
- `isOpen`: `boolean`
- `onConfirm`: `() => void`
- `onCancel`: `() => void`
- `title`: `string`
- `message`: `string`
- `confirmLabel?`: `string` (default: "Delete")
- `cancelLabel?`: `string` (default: "Cancel")
- `variant?`: `'danger' | 'warning'` (default: 'danger')

**Visual states:** Modal with destructive action highlighted

**Used in:** Score Reports (delete), Subscription Tracker (delete)

---

## Subscription Components

### SubscriptionRow
A single subscription entry in the list.

**Props:**
- `subscription`: `Subscription`
- `onEdit`: `() => void`
- `onDelete`: `() => void`

**Visual states:** Default, hover (show actions)

**Fields displayed:** name, monthlyCost, status badge, renewalDate (if present)

**Used in:** Subscription Tracker (list view)

---

### SubscriptionForm
Form for adding/editing a subscription.

**Props:**
- `initialData?`: `Partial<Subscription>`
- `onSubmit`: `(data: SubscriptionFormData) => void`
- `onCancel`: `() => void`
- `isLoading?`: `boolean`

**Fields:**
- name (TextField, required)
- monthlyCost (MoneyField, required)
- status (SelectField: active/paused/canceled)
- renewalDate (DateField, optional)
- notes (TextField multiline, optional)

**Used in:** Subscription Tracker (Add/Edit modal)

---

## Form Fields

### TextField
Basic text input with label and validation.

**Props:**
- `label`: `string`
- `value`: `string`
- `onChange`: `(value: string) => void`
- `placeholder?`: `string`
- `required?`: `boolean`
- `error?`: `string`
- `multiline?`: `boolean`
- `rows?`: `number`

**Visual states:** Default, focus, error, disabled

---

### MoneyField
Currency input for monthly costs.

**Props:**
- `label`: `string`
- `value`: `number | undefined`
- `onChange`: `(value: number) => void`
- `currency?`: `string` (default: "$")
- `required?`: `boolean`
- `error?`: `string`

**Visual states:** Default, focus, error, disabled

---

### SelectField
Dropdown select for status and other options.

**Props:**
- `label`: `string`
- `value`: `string`
- `onChange`: `(value: string) => void`
- `options`: `{ value: string; label: string }[]`
- `required?`: `boolean`
- `error?`: `string`

**Visual states:** Default, focus, open, disabled

---

### DateField
Optional date picker for renewal dates.

**Props:**
- `label`: `string`
- `value`: `string | undefined` (ISO date)
- `onChange`: `(value: string | undefined) => void`
- `required?`: `boolean`
- `error?`: `string`

**Visual states:** Default, focus, calendar open, disabled

---

## Evidence Prompt Components

### QuestionCard
A single question in the Evidence Prompt flow.

**Props:**
- `question`: `string`
- `selectedAnswer`: `'yes' | 'no' | 'not_sure' | null`
- `onAnswer`: `(answer: 'yes' | 'no' | 'not_sure') => void`

**Visual states:** Unanswered, answered (selected option highlighted)

**Used in:** Evidence Prompt

---

## Layout Notes

- All components follow 12–16px padding guidelines
- Card-based containers with subtle borders (slate-200)
- Light theme only (Phase 1)
- System font stack (system-ui)
- Blue accent for primary actions
- Status colors: emerald (Clear), amber (Mixed), rose (Risky)

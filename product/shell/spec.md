# Application Shell Specification

## Overview
SubSense uses a bottom tab bar navigation pattern optimized for Chrome extension popups. The shell provides a minimal header with dynamic titles and a fixed bottom tab bar for navigating between the three main sections.

## Navigation Structure
- **Scores** tab → Page Scoring, Evidence Prompt, Score History, Score Details
- **Subscriptions** tab → Subscription Tracker
- **Privacy** tab → Privacy Promise

## Header
- **Left:** Small "SubSense" wordmark (subtle branding)
- **Right:** Dynamic title based on current state

### Dynamic Titles by State
| State | Title |
|-------|-------|
| Home | "Score" |
| Loading | "Scoring..." |
| Result | "Score" |
| EvidencePrompt | "Questions" |
| MyScores | "My Scores" |
| ScoreDetail | "Score Details" |
| Subscriptions | "Subscriptions" |
| Privacy | "Privacy" |
| ErrorCSP | "Error" |
| ErrorPermission | "Error" |

## Tab Bar
- Fixed position at bottom of popup
- 3 tabs with icons and labels
- Active tab highlighted with primary color (blue-600)
- Inactive tabs in neutral color (slate-500)

### Tab Items
1. **Scores** — Shield icon, default tab
2. **Subscriptions** — CreditCard icon
3. **Privacy** — Lock icon

## Layout Pattern
```
┌─────────────────────────────────┐
│ SubSense              [Title]  │  Header (48px)
├─────────────────────────────────┤
│                                 │
│         Content Area            │  Scrollable
│         (flex-1)                │
│                                 │
├─────────────────────────────────┤
│  [Scores]  [Subs]  [Privacy]   │  Tab Bar (64px)
└─────────────────────────────────┘
```

## Dimensions
- **Width:** 400px (fixed, Chrome extension standard)
- **Min Height:** 400px
- **Max Height:** 600px
- **Header Height:** 48px
- **Tab Bar Height:** 64px

## Design Tokens Applied
- **Primary:** blue (active states, CTA buttons)
- **Neutral:** slate (text, borders, backgrounds)
- **Typography:** system-ui (native feel, fast load)

## Responsive Behavior
- **Extension Popup:** Fixed 400px width, content scrolls vertically
- No mobile breakpoints needed (popup is already compact)

## Design Notes
- No user menu (no accounts in Phase 1)
- Header stays fixed during scroll
- Tab bar stays fixed at bottom
- Content area scrolls independently
- Dark mode supported via `dark:` variants

# Evidence Prompt Specification

## Overview
A separate popup view triggered when users click "Answer 3 questions" from a low-confidence score result. Users answer 3 quick Yes/No/Not sure questions to provide additional signals, which are used to recalculate the score and improve confidence.

## User Flows
- Enter Evidence Prompt: User clicks "Answer 3 questions" from low-confidence state → Navigates to Evidence Prompt view
- Answer questions: User selects Yes/No/Not sure for each of 3 questions
- Submit answers: User clicks Submit → EvidenceResponse saved → Score recalculated → Navigate back to Score Result → Toast: "Updated score with your answers"
- Cancel without saving: User clicks Back → Returns to Score Result without changes

## UI Requirements
- Separate view (not inline), navigated from Page Scoring
- Header: "Help improve accuracy" with subtext "3 quick questions"
- 3 questions displayed as cards or rows:
  1. "Was the price easy to find in under 30 seconds?"
  2. "Were trial/free tier limits clearly explained?"
  3. "Were cancellation steps easy to find?"
- Each question has 3 choice buttons: Yes / No / Not sure
- Submit button disabled until all 3 questions are answered
- Back button: returns to Score Result without saving
- Submit button: saves EvidenceResponse, recalculates score, navigates back
- Toast on success: "Updated score with your answers"
- Neutral language throughout (no guilt or pressure)
- Light theme, card-based layout, 12–16px padding

## Configuration
- shell: false

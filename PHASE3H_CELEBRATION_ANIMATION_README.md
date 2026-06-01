# Phase 3H — Celebration Animation + Share Win

This phase adds a lightweight celebration card for correct predictions.

## What changed

- Adds a celebration card on match detail pages when a match is final and the user's saved prediction earns points.
- Supports the existing scoring logic:
  - Exact score: 50 points
  - Correct draw: 15 points
  - Correct winner: 10 points
- Adds buttons:
  - Share this win
  - Copy win text
- Share text keeps the correct branding order:
  - User result first
  - FIFA WorldCup 2026 Predictor second
  - Virtual Beehive Inc. / Hobbee.FUN mention at the end
- Reads match overrides from Firestore `matches/{matchId}` when a match detail page opens, so admin-entered final scores can trigger celebrations.
- No new media permissions.
- No photo upload.
- No Firebase Storage cost.

## Test notes

To test the celebration card, sign in as admin and set a match status to `final` with a final score that matches a saved prediction. Then reopen that match detail page.


# Phase 3P-E — User-Facing Text Cleanup

This phase handles Danny's Item 6.

## Scope

Remove internal/developer/helper text from user-facing screens before final release.

## Goal

The final app should not show text like:

- "Cost-controlled leaderboard view..."
- "The app loads a limited page first..."
- "Firebase cost control..."
- "Admin validation checklist..."
- "Build: Phase..."
- Any text that was only meant to communicate with Danny/developer/testing.

## What should remain

Normal user-friendly text only, such as:

- Top Predictors
- Leaderboard
- Load more
- No scored predictors yet
- Predict matches before halftime
- Share
- Copy

## Apply

Run:

```bash
python3 apply_phase3PE_user_facing_text_cleanup.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3P-E user-facing text cleanup"
git push
```

No production build is required immediately.

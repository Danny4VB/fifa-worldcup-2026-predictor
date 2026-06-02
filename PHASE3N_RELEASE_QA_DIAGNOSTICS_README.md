# Phase 3N — Release QA Diagnostics + App Status Screen

This phase adds a lightweight QA/status foundation before the next preview build or production update.

## Goals

- Add helper constants for the current app build checkpoint.
- Add a QA checklist data structure for testing.
- Add app status labels for admin/testing.
- Prepare a cleaner "what to test" list inside the app/codebase.
- Avoid new permissions.
- Avoid Firebase Storage.
- Avoid extra Firebase reads.

## Why this phase matters

Many features were added quickly. Before production update, the app needs one clear QA checkpoint to confirm:

- Menu opens
- Admin panel opens
- Sponsor controls work
- Share links use Google Play
- Avatar picker works
- Delete account flow opens
- Notification preferences show
- Celebration/share win logic works
- No crashes

## Apply

Run:

```bash
python3 apply_phase3N_release_qa_diagnostics.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3N release QA diagnostics"
git push
```

No build is required immediately, but this is a good phase to build after if you want a checkpoint APK.

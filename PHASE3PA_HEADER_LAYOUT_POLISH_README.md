# Phase 3P-A — Header Layout Polish

This phase fixes Item 1 only from Danny's feedback.

## Scope

Only the top app header is touched.

## Goals

- Make the top header taller.
- Move header content down slightly so it does not feel pushed into the phone status bar.
- Make the app logo larger.
- Make "Virtual Beehive Inc." easier to read.
- Make "FIFA WorldCup 2026 Predictor" cleaner and more readable.
- Improve spacing between the logo, title area, mood icon, and menu icon.
- Keep all current app logic unchanged.

## Not included in this phase

These will be handled separately later:

- App name change
- Share message changes
- Groups/team card simplification
- Knockout bracket redesign
- Top tab text cleanup
- Menu cleanup

## Apply

Run:

```bash
python3 apply_phase3PA_header_layout_polish.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3P-A header layout polish"
git push
```

No production build is required immediately.

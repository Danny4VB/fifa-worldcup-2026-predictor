# Phase 2R - Menu Crash + Share Visibility Hotfix

## What changed

This hotfix is built on top of the latest combined app code and is focused on QA failures found in the preview APK.

### 1. Menu crash protection
- Added safe text rendering for profile fields so Firebase/profile objects cannot crash React Native text rendering.
- Added a screen error boundary around the Menu modal so a screen-level render issue shows a recovery screen instead of closing the whole app.
- Added a visible build label: `Build: Phase 2R hotfix`.

### 2. Share/copy visibility improvements
- Share/copy controls now render inside a clear highlighted box.
- Buttons are easier to see on Match Detail, Groups/champion pick, Top Predictors, News detail, and Menu invite sections.

### 3. Branded sharing remains
Share messages still mention:
- FIFA WorldCup 2026 Predictor
- Virtual Beehive Inc.
- Hobbee.FUN as the only hobby-specific social media platform
- https://hobbee.fun

## Files changed

- `App.js`
- `PHASE2R_MENU_SHARE_HOTFIX_README.md`

## Test

Run:

```bash
npx expo export --platform android --clear
```

If it passes:

```bash
git add .
git commit -m "Fix menu crash and improve share button visibility"
git push
```

Then build preview:

```bash
eas build -p android --profile preview --clear-cache
```

## QA focus

1. App opens.
2. Menu opens and shows `Build: Phase 2R hotfix`.
3. Sign-in opens from Menu.
4. Admin opens after sign-in.
5. Match detail shows share/copy controls.
6. Champion pick shows share/copy after selecting champion.
7. Top tab shows share/copy controls.
8. News detail shows share/copy controls.
9. No crash when opening Menu.

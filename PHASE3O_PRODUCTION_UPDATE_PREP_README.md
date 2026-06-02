# Phase 3O — Production Update Preparation

This phase prepares the app for the next Google Play update after QA passes.

## Goals

- Set the app version name to 1.0.1.
- Keep Android build version/code managed by EAS remote version source.
- Add production release notes for Google Play.
- Add a final pre-production checklist.
- Keep direct Google Play share links.
- Keep the iOS App Store link TODO for later.

## Important

Do not upload to Google Play until the preview APK passes QA.

Recommended order:

1. Apply this phase.
2. Run export-test.
3. Commit and push.
4. Build preview APK.
5. Test.
6. If everything passes, build production AAB.
7. Upload as Google Play version 1.0.1.

## Apply

Run:

```bash
python3 apply_phase3O_production_update_prep.py
npx expo export --platform android --clear
git add .
git commit -m "Prepare Phase 3O production update"
git push
```

## Later preview build

```bash
eas build -p android --profile preview --clear-cache
```

## Later production build

```bash
eas build -p android --profile production --clear-cache
```

# Phase 2L - Share Prediction Screens

## What changed

Phase 2L keeps the previous updates and adds native sharing features.

### New share actions
- Share a match prediction from the match detail page.
- Share champion pick from the Groups page after a champion is confirmed.
- Share leaderboard challenge from the Top Predictors page.
- Share app invite from the Menu page.
- Share news/app message from the News detail page.

### How sharing works
- Uses the phone native share sheet through React Native `Share`.
- No new permissions are required.
- No image/file generation yet, so this is safe for Google Play and simple to test.
- Future phase can upgrade this to generated branded share images.

### Share link
Current share link points to:

`https://hobbee.fun`

This can later be changed to the Google Play link after the app is approved.

## Files changed

- `App.js`
- `PHASE2L_SHARE_PREDICTIONS_README.md`

## Test

Run:

```bash
npx expo export --platform android --clear
```

If it passes:

```bash
git add .
git commit -m "Add Phase 2L share prediction features"
git push
```

Do not start another EAS build until the current queue clears.

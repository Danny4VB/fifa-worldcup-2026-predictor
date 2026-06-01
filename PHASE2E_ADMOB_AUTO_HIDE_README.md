# Phase 2E - AdMob Auto-Hide + Admin Ad Control

This update keeps AdMob placements in the app code, but improves the user experience:

## What changed

1. **Real AdMob mode is now the default**
   - `USE_ADMOB_TEST_ADS` is set to `false`.
   - The app requests your real AdMob banner units.

2. **Ad placements auto-hide when AdMob has no fill**
   - If an ad loads, the user sees the ad row.
   - If AdMob returns no fill / fails to load, the entire ad row disappears.
   - Users should not see blank ad boxes or test ad messages.

3. **Admin AdMob Display Control added**
   - Hidden admin panel now includes controls for:
     - Ad placements on/off
     - Test ads on/off
     - Auto-hide no-fill ads on/off
     - Non-personalized ad requests on/off
   - Settings save to Firestore:
     - `appConfig/ads`

## Recommended public settings

Use these settings for public release:

- Ad placements: ON
- Test ads: OFF
- Auto-hide no-fill ads: ON
- Non-personalized request: ON

This means AdMob placements are ready, but if AdMob does not serve ads yet, users will not see the ad areas.

## Files changed

- `App.js`
- `PHASE2E_ADMOB_AUTO_HIDE_README.md`

## Suggested commands

```bash
npx expo export --platform android --clear
git add .
git commit -m "Add AdMob auto-hide and admin ad controls"
git push
eas build -p android --profile preview
```

Use a preview build first. After confirming no crash, you can create a production build if needed.

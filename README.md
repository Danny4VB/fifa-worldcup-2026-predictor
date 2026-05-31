# FIFA WorldCup 2026 Predictor

A Phase 1 Expo/React Native APK preview for Virtual Beehive Inc.

## What is included

- Matches tab with past/live/upcoming cards
- Prediction score controls
- Our Users' Prediction average score
- Match detail tabs: Summary, Head-to-head, Team A, Team B
- Full 48-team champion picker
- 12-group tournament map preview
- Players & Goals tab
- News tab
- Top Predictors leaderboard
- Profile/settings with dark mode and location permission demo
- Sponsor card defaulting to Hobbee.FUN
- Ad placeholder areas
- Admin preview dashboard
- App icon from `assets/app-logo.png`

## Install and run locally

```bash
npm install
npx expo start
```

Use Expo Go on your phone for quick preview.

## Build APK with EAS

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

The `preview` profile in `eas.json` builds an APK for Android testing.

## Notes

- This Phase 1 version uses local mock data.
- Backend, login, database, live/free sports API, AdMob, admin roles, screenshot sharing, and production privacy tools should be added in Phase 2.
- Confirm rights before using official FIFA names, event logos, or official ball artwork in public app stores.

# Phase 2B Firebase Backend Setup

This update connects the app to Firebase for email/password authentication and online Firestore storage.

## Included
- Firebase app initialization using the Firebase Web SDK
- Email/password sign up and sign in
- User profile saved to Firestore: `users/{uid}`
- Admin role check from Firestore: `users/{uid}.isAdmin === true`
- Predictions saved online: `predictions/{matchId}_{uid}`
- Champion pick saved once: `championPicks/{uid}`
- Best player vote saved online: `bestPlayerVotes/{matchId}_{uid}`
- Sponsor banner reads from Firestore: `sponsors/active`

## Keep costs low
- The base match list stays bundled in the app.
- Users only write their own predictions.
- Public averages/leaderboards should use summary documents later instead of reading all predictions.
- Stadium/player/coach images should be stored as URL fields first, not uploaded to Firebase Storage.

## Optional sponsor document
Create `sponsors/active` in Firestore with fields:
- `name` string, e.g. `Hobbee.FUN`
- `message` string, e.g. `Discover hobbies and share predictions with fans`
- `callToAction` string, e.g. `Visit Hobbee.FUN`
- `url` string, optional
- `active` boolean, true

## Important
Do not put `expo-asset`, `expo-font`, or `expo-status-bar` inside the `plugins` section of `app.json` if Expo adds them automatically and the build complains.

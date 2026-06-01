# Phase 2G - Firebase Cost Control + Data Optimization

## What changed

Phase 2G is built on top of Phase 2E, 2F, and 2H.

### 1. Cached low-change Firestore documents
The app now caches low-change documents on the device to reduce repeat reads:

- `sponsors/active` cached for 6 hours
- `appConfig/ads` cached for 6 hours

This means users do not re-read sponsor/ad settings from Firestore every time the app re-renders.

### 2. Safe cached-read fallback
If Firestore is temporarily slow or unavailable, the app can use the last cached sponsor/ad settings instead of failing or creating extra retries.

### 3. Cache invalidation after admin writes
When admin writes a document using the app, the matching local cache key is cleared so the next load can get fresh data.

### 4. Leaderboard pagination foundation
Top Predictors now loads only the first page first:

- first page: 25 predictors
- Load More button: next 25 predictors

This prepares the app for real Firebase leaderboard pagination later.

### 5. Admin cost-control reminder
The admin panel now includes a Firebase Cost Control card with recommended budget alerts and data-design reminders.

## Recommended Firebase budget alerts

Set these alerts in Google Cloud / Firebase billing:

- $5
- $10
- $25
- $50
- $100

## Important design rule for future leaderboard

When real users grow, do not calculate leaderboard by reading every prediction document on the client.

Use summary documents instead:

```txt
leaderboard/{userId}
matchPredictionSummaries/{matchId}
matchResults/{matchId}
```

## Files changed

- `App.js`
- `PHASE2G_FIREBASE_COST_CONTROL_README.md`

## Suggested commands

```bash
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 2G Firebase cost controls"
git push
```

Do not start another EAS build while the queue is backed up. Build once later after all currently planned phases are pushed.

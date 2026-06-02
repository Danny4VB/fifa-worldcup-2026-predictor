# Phase 3L — Real Leaderboard Finalization

This phase strengthens the leaderboard/scoring foundation without adding new permissions or Firebase Storage.

## Goals

- Add real leaderboard helper functions.
- Standardize prediction scoring:
  - Exact score = 50 points
  - Correct draw = 15 points
  - Correct winner = 10 points
- Prepare Firebase leaderboard records.
- Add pagination constants for cost control.
- Add clear field names for leaderboard data.
- Keep Firebase reads low.

## Firebase collections used

- predictions
- matches
- leaderboard
- matchPredictionSummaries

## Leaderboard document shape

leaderboard/{userId}

```json
{
  "userId": "firebase-user-id",
  "nickname": "Danny",
  "avatar": "🐝",
  "country": "United States",
  "points": 120,
  "exactScores": 2,
  "correctWinners": 5,
  "correctDraws": 1,
  "matchesScored": 8,
  "updatedAt": "server timestamp"
}
```

## Cost-control rules

- Load top 25 first.
- Use "Load more" for the next page.
- Do not read all users at once.
- Do not read all predictions for every user on app load.
- Recalculate leaderboard only when match result changes or admin triggers scoring.

## Apply

Run:

```bash
python3 apply_phase3L_real_leaderboard.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3L real leaderboard foundation"
git push
```

No build is required immediately unless this becomes your next checkpoint.

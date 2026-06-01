# Phase 2F - Smart Matches + Real Scoring + Smart Scroll

## What changed

1. Smart Matches page
- Matches are organized by live, today, recent finished, future, then older finished.
- Added filters: Smart, Live, Today, Upcoming, Finished, All.
- The smart list can auto-scroll toward the most relevant match while still allowing manual scrolling through all 104 matches.

2. Status-aware match cards
- Live matches are highlighted.
- Finished matches are dimmed/gray and show final score.
- Locked matches clearly show prediction locked.
- Open matches show prediction open until halftime.

3. Prediction scoring foundation
- Exact score: 50 points.
- Correct draw: 15 points.
- Correct winner: 10 points.
- Local score is calculated from finished matches.

4. Top Predictors scoring foundation
- Shows the user's calculated score when predictions/results exist.
- Sample rows remain as placeholders until Firebase leaderboard summaries are populated by real users.

5. Firebase match override loading
- Reads matches/{matchId} documents from Firestore.
- Admin-entered score/status can affect match status and scoring.

## Firestore match override example

matches/1

{
  "teamAScore": 2,
  "teamBScore": 1,
  "status": "final"
}

Supported status examples: upcoming, live, halftime, locked, final, finished.

## Recommended next backend improvement

Create Firebase summary documents to avoid reading all raw predictions:
- matchPredictionSummaries/{matchId}
- leaderboard/{userId}

This will become Phase 2G cost-control and real global leaderboard aggregation.

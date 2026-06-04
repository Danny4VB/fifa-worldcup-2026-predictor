# Phase 4G-A — Match Details: History + Fan Player Poll Foundation

This phase adds a safe UI/data foundation for match history and fan best-player polls.

## Scope

This is a controlled feature foundation. It does NOT add live sports API automation yet.

## What this phase prepares

For each match, the app can support:

- History tab / section
- Previous meetings summary
- Roster/player list placeholders
- Summary/Fan Poll section
- Vote fields for best player from each team
- Highest selected player display
- Firebase-friendly data structure

## Important

This phase is designed to be low-cost:

- The app reads summary/cached Firebase data.
- The app should not call sports APIs directly.
- Full roster/lineup/head-to-head import automation should be added later.
- No player photos.
- No Firebase Storage.

## Firebase structure prepared

```txt
matchDetails_2026/{matchId}
  historySummary
  previousMeetings[]
  teamAPlayers[]
  teamBPlayers[]
  teamACoach
  teamBCoach
  fanPoll
  topSelectedPlayer
```

## Apply

Run:

```bash
python3 apply_phase4GA_match_details_history_poll.py
npx expo export --platform android --clear
git add App.js PHASE4GA_MATCH_DETAILS_HISTORY_POLL_README.md
git commit -m "Add Phase 4G-A match history and fan poll foundation"
git push
```

No EAS build is required immediately. Build only when you are ready for a full phone test.

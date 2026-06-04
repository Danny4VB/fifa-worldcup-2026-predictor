# Phase 4P — Verified Football Data Import Workflow

## Purpose

This phase prepares the FIFA WorldCup 2026 Predictor app for real football data without publishing unverified information.

The app now has structures for:

- Teams
- Players
- Coaches
- Stadiums
- Jerseys
- Head-to-head history

This phase tracks which data is verified, pending, or ready to import.

## Priority order

1. Start with Mexico vs USA head-to-head history as the first sample.
2. Add Mexico and USA player roster details.
3. Add coach and stadium information.
4. Expand to other high-interest matches.
5. Expand to all teams.

## Verification rules

Do not mark data as real unless it has a source.

Each real data item should include:

- `sourceUrl`
- `lastVerified`
- `status`
- `notes`

## Important roster rule

World Cup player rosters can change. Player information should be treated as updateable until official final tournament rosters are confirmed.

## Cost rule

Do not call sports APIs directly from user phones.

Use this workflow instead:

1. Verify data.
2. Store data in JSON.
3. Import data to Firebase.
4. Let the app read cached Firebase data.

## Files

- `data/verified/phase4P_verified_data_queue.json`
- `scripts/validate_phase4P_verified_queue.js`

## Validation

Run:

```bash
node scripts/validate_phase4P_verified_queue.js

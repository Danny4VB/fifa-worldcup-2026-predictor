# Phase 3P-D — Full Knockout Bracket Diagram

This phase handles the second part of Danny's Item 5.

## Scope

This phase prepares a more serious knockout bracket foundation that can be displayed separately from the simplified Groups list.

## Goals

- Create a dedicated bracket data structure for:
  - Round of 32
  - Round of 16
  - Quarter-finals
  - Semi-finals
  - Final
- Prepare a horizontal-scroll bracket layout foundation.
- Keep the phone in portrait mode while allowing the bracket area to scroll horizontally.
- Keep current Groups tab stable.
- Avoid expensive API integration for now.
- Prepare the bracket to later read winners from Firebase match results/admin data.

## Important

This phase is a foundation/polish phase, not the final full FIFA-style graphic image.

The final smart bracket should be powered by:

- existing match data
- admin-entered final results
- Firebase `matches/{matchId}` results
- later live-score API if/when added

## Cheap smart behavior

For now, the cheapest reliable approach is:

1. Admin enters/saves match final scores.
2. App calculates winner locally.
3. Bracket advances winner labels into later rounds.
4. Later, live-score API can replace manual/admin entry.

## Apply

Run:

```bash
python3 apply_phase3PD_full_knockout_bracket.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3P-D full knockout bracket foundation"
git push
```

No production build is required immediately.

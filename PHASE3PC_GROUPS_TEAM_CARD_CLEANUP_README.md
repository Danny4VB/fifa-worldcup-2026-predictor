# Phase 3P-C — Groups Team Card Cleanup

This phase handles the first part of Danny's Item 5 only.

## Scope

This phase simplifies the Groups tab team display.

## What changes

Group team rows/cards should show only:

- Team flag
- Team name
- Continent/confederation under the team name

Nothing else should be shown on the team row/card.

## Continent labels

The app should use simple continent/confederation labels:

- Europe
- Africa
- Asia
- North America
- South America
- Oceania

## Not included in this phase

The full knockout bracket redesign is NOT included here because it is a bigger visual/logic phase.

The bracket redesign should be the next separate phase:

Phase 3P-D — Full Knockout Bracket Diagram

That later phase should create a proper bracket-style diagram similar to Danny's reference image and may require a separate landscape/bracket screen.

## Apply

Run:

```bash
python3 apply_phase3PC_groups_team_card_cleanup.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3P-C groups team card cleanup"
git push
```

No production build is required immediately.

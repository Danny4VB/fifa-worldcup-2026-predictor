# Phase 2J - Groups + Knockout Bracket Visual Upgrade

## What changed

Phase 2J keeps the previous updates and improves the Groups tab visually.

### 1. Groups first
- All 12 groups are shown at the top.
- Groups use a compact two-column layout.
- Each group row shows flags and team names.
- Champion selection remains available by tapping a team.
- Long press still opens team details.

### 2. Knockout map below groups
- Added a wider horizontal bracket section.
- The bracket is visible now instead of waiting for admin/backend data.
- Round of 32 paths show colorful team flags as possible advancing teams.
- Trophy is shown at the center of the bracket.
- Future backend/admin results can later gray out eliminated teams and advance winners automatically.

### 3. Landscape-style bracket behavior
- The bracket section scrolls horizontally so the app can keep the phone in portrait mode.
- This avoids forcing the entire app to rotate while still giving the bracket more room.

## Files changed

- `App.js`
- `PHASE2J_GROUPS_KNOCKOUT_README.md`

## Firestore impact

No new Firestore reads are required in this phase. This keeps Firebase cost controlled.

## Recommended test

Run:

```bash
npx expo export --platform android --clear
```

Then commit:

```bash
git add .
git commit -m "Add Phase 2J groups and knockout bracket upgrade"
git push
```

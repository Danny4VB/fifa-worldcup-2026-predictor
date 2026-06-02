# Phase 3P-I — Groups + Sponsor Final Cleanup

This phase covers the remaining red-mark comments from Danny's screenshots that were not fully covered by Phase 3P-H.

## Scope

This phase focuses only on:

1. Groups tab team text cleanup
2. Sponsor bar clipping cleanup
3. Share-box copy button fallback cleanup

## What this phase should fix

### Groups tab

Final team cards should show only:

```txt
🇲🇽 Mexico
North America
```

or:

```txt
🇦🇷 Argentina
South America
```

Remove public helper text such as:

```txt
Seed 1 • tap to pick champion • long press for team info
Seed 2 • tap to pick champion • long press for team info
Group team • tap to pick champion • long press for team info
tap to pick champion
long press for team info
```

Remove the Groups intro paragraph:

```txt
Group teams are shown first, then the knockout map appears below just like a tournament board.
```

### Sponsor bar

Fix sponsor clipping by shortening the sponsor text to:

```txt
Visit Hobbee.FUN
```

and making sponsor message containers less likely to cut off the first letters.

### Share boxes

Remove leftover Copy buttons/labels from share boxes if any survived previous cleanup.

## Apply

Run:

```bash
python3 apply_phase3PI_groups_sponsor_final_cleanup.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3P-I groups and sponsor final cleanup"
git push
```

If export fails, do not build. Send the red error lines.

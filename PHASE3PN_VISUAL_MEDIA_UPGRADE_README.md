# Phase 3P-N — Visual Media Upgrade

This phase makes the app feel more alive and less text-heavy by adding visible media holders and a live countdown foundation.

## Scope

This phase targets visible UI improvement, not backend image upload.

## What this phase adds/prepares

1. A large visual hero/media holder for the Matches tab.
2. A live WorldCup countdown helper that can show days, hours, minutes, and seconds.
3. Match detail media sections for stadium/team/player images.
4. Groups tab media hero/featured image holder.
5. Sponsor banner cleanup to reduce boring/clipped text.
6. Admin URL-only media hints using the 3P-M media foundation.

## Important

This phase keeps image handling URL-only to avoid Firebase Storage/upload costs.

Admin should paste direct image URLs later for:

- stadium image
- team image
- player photo
- coach photo
- sponsor banner image

## Countdown target

Default target in this phase:

June 11, 2026 at 1:00 PM Mexico City time.

## Apply

Run:

```bash
python3 apply_phase3PN_visual_media_upgrade.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3P-N visual media upgrade"
git push
```

If export fails, do not build. Send the red error lines.

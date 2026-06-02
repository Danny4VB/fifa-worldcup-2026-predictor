# Phase 2V — Sponsor Bar + Header Polish + Small Ball Animation

This patch improves visual polish without adding new permissions, Firebase Storage, or extra app-store declarations.

## What it changes

- Makes the sponsor bar taller and more readable.
- Makes the sponsor logo frame larger and uses `resizeMode="contain"` already present in the app so the logo should not stretch.
- Keeps sponsor fallback if the logo cannot load.
- Makes the top app header taller.
- Makes the app logo slightly larger.
- Makes the app title less cramped.
- Reduces the large `Matches` heading size.
- Shortens the Matches helper text to:

  `Tap any match to predict before halftime.`

- Adds a small, simple bouncing soccer ball next to the Matches title.
- Updates the build label to:

  `Build: Phase 2V visual polish`

## Important sponsor-logo note

The sponsor logo still needs a direct image URL. Google Drive preview/share links may not display reliably inside a React Native app.

Best logo URL types:

- `https://.../logo.png`
- `https://.../logo.jpg`
- `https://static.wixstatic.com/media/...`

If the logo fails, the app should show the sponsor fallback instead of crashing.

## How to apply

Copy these files into your project root:

- `apply_phase2V_visual_polish.py`
- `PHASE2V_SPONSOR_HEADER_POLISH_README.md`

Then run:

```bash
python3 apply_phase2V_visual_polish.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 2V sponsor and header polish"
git push
```

You do not have to build immediately unless this is your next testing checkpoint.

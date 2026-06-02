# Phase 3K — Final Admin/Firebase Validation Fix

This phase focuses on making admin controls easier to verify and less confusing.

## Goals

- Add a clearer Admin/Firebase validation section.
- Add helper text explaining what each admin setting affects.
- Add a visible "Current Admin Settings" status area.
- Add a refresh instruction for testing Firebase-controlled settings.
- Standardize share/download link text if possible.
- Avoid adding Firebase Storage, image uploads, or new permissions.

## What to test later after the next build

1. Sign in as admin.
2. Open Admin Control Panel.
3. Change ad settings.
4. Save settings.
5. Confirm the admin panel shows the saved setting values.
6. Change sponsor name/message/logo URL.
7. Save sponsor.
8. Confirm the sponsor bar updates or cleanly falls back if the logo URL does not load.
9. Confirm the app does not crash if image URL is bad.
10. Confirm match manager score/status saves.
11. Confirm news manager saves.
12. Confirm image URL manager saves text fields only.

## Apply

Run:

```bash
python3 apply_phase3K_admin_firebase_validation.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3K admin Firebase validation polish"
git push
```

No build is required immediately unless this becomes your next test checkpoint.

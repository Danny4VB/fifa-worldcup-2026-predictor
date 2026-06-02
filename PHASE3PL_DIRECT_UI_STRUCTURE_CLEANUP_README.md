# Phase 3P-L — Direct UI Structure Cleanup

This phase handles Danny's items 1–5 from the latest feedback.

## Scope

This phase is for visible UI structure only:

1. Delete Copy buttons completely and center Share buttons.
2. Make the main header logo larger and better aligned.
3. Make match detail header/back/title area match the main header better.
4. Clean Menu into main sections:
   - Account
   - Settings
   - Invite Friends
   - Privacy & Account
   - About This App
   - Admin Control Panel
5. Add visible fallback labels for England and Scotland flags:
   - England: 🏴 ENG
   - Scotland: 🏴 SCO

## Not included

Admin image/media management is NOT included here. That should be Phase 3P-M because it needs its own data structure.

## Apply

Run:

```bash
python3 apply_phase3PL_direct_ui_structure_cleanup.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3P-L direct UI structure cleanup"
git push
```

If export fails, do not build. Send the red error lines.

# Phase 3P-H — Menu Restructure + Header Final Cleanup

This phase handles the new direction from Danny:

- Header should be cleaner.
- Remove "Virtual Beehive Inc." from the top header.
- Move Virtual Beehive Inc. ownership text into Menu/About.
- Menu should be less crowded.
- Menu should show clear high-level sections:
  - Profile
  - Settings
  - Invite Friends
  - Privacy & Account
  - About This App
  - Admin Control Panel for admin users only
- Move profile-related items into Profile.
- Move notification/settings-related items into Settings.
- Move delete/account/legal items into Privacy & Account.
- Keep Invite Friends simple with one Share button.
- Remove confusing public buttons:
  - Copy
  - Copy deletion request text
  - Clear local profile on this phone
  - Delete My Account Permanently large explanation button

## Important

This phase is a UI organization cleanup. It should not change Firebase, AdMob, login, or permission behavior.

## Apply

Run:

```bash
python3 apply_phase3PH_menu_restructure_header_final.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3P-H menu restructure and header cleanup"
git push
```

If export fails, do not build. Send the red error lines.

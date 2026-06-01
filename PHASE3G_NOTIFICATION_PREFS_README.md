# Phase 3G - Notification Preferences Prep

This phase adds a safe notification preference center without enabling push notifications yet.

## What changed

- Adds a Notifications card inside Menu.
- Users can turn notification categories ON/OFF:
  - Match reminders
  - Prediction reminders
  - Prediction result alerts
  - Leaderboard updates
  - Sponsor/app updates
- Preferences are saved locally with AsyncStorage.
- No native push notification package is added yet.
- No Firebase cost added.
- No Google Play permission change yet.

## Why this phase is safe

This prepares notification settings before adding actual push notification delivery in a later version. It avoids adding new permissions until the app is ready.

## Apply

Run:

```bash
python3 apply_phase3G_notifications_prep.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3G notification preferences"
git push
```

Do not build until the next checkpoint.

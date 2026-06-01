# Phase 3E — Preset Avatar Picker

This update adds built-in profile avatars without requiring photo uploads, media permissions, or Firebase Storage.

## What changed

- Added 24 built-in emoji-style avatar choices.
- Added `Choose Your Avatar` section inside the Menu.
- Avatar saves to local profile and, when signed in, to Firebase user profile.
- Avatar is stored in user profile fields:
  - `avatar`
  - `avatarEmoji`
- Menu profile card now shows the selected avatar.
- Top Predictors screen now shows avatar-style leaderboard rows.
- Added a small “Your public leaderboard look” preview.

## Why this phase is low risk

- No image upload.
- No photo/media permissions.
- No Firebase Storage cost.
- No moderation risk from user-uploaded images.

## Testing checklist

1. Open app.
2. Open Menu.
3. Confirm `Build: Phase 3E avatar picker` appears.
4. Tap several avatars.
5. Confirm avatar changes in Menu.
6. Sign in and choose an avatar.
7. Close/reopen app and confirm avatar remains saved.
8. Open Top Predictors and confirm avatar preview appears.

## Build guidance

Run export-test only first:

```bash
npx expo export --platform android --clear
```

If export passes:

```bash
git add .
git commit -m "Add Phase 3E preset avatar picker"
git push
```

Build later only when ready for a combined preview build.

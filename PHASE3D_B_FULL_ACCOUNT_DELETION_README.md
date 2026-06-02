# Phase 3D-B - Full Automatic Account Deletion

This phase adds a defensive Firebase account deletion helper and clearer Menu wording for full deletion.

## What it is designed to do

- Show a serious delete account confirmation.
- Anonymize the user's profile document.
- Delete user-owned predictions and best-player votes when Firestore rules allow it.
- Delete champion pick and leaderboard record when possible.
- Create a minimal deletedUsers compliance record.
- Attempt Firebase Auth account deletion.
- If Firebase requires recent login, tell the user to sign out/sign in again and retry.

## Why it is defensive

Firebase Auth deletion often requires a recent sign-in. This patch does not try to bypass that. It shows a user-friendly message if re-authentication is needed.

## Apply

Run:

```bash
python3 apply_phase3DB_full_account_deletion.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3D-B full account deletion helper"
git push
```

## Important

After applying, inspect the Menu delete-account area. If the app's internal variable names for `auth`, `db`, or `user` are different, wire the button call to:

```js
phase3DBDeleteAccount({ auth, db, user, clearLocalProfile, afterDeleted })
```

This phase does not add Firebase Storage and does not add media/photo permissions.

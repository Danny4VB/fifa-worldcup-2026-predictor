# Phase 2S - Restore Admin, Sharing, Wording, and Ad Placeholder Hotfix

This hotfix is built on top of the latest combined code and focuses only on the QA issues found in the preview APK.

## What changed

1. **Sign-in wording cleaned up**
   - `Create New Account` -> `Create account`
   - `Sign In` -> `Sign in`
   - `Save profile locally only` -> `Continue as guest`
   - Account description no longer says Firebase to normal users.

2. **Admin access is easier to find**
   - After successful sign-in, the app reopens Menu so the admin card can be seen.
   - A quick `Open Admin Control Panel` button appears on the main screen for admin users.
   - Menu still includes the hidden admin card and admin panel button.

3. **Ad placeholders hidden by default**
   - Public default now starts with `adsEnabled: false` so users will not see AdMob placeholder areas.
   - Admin can turn ad placements on later from Firebase/admin controls.

4. **Share/copy labels are clearer**
   - Share boxes now say users can share to social apps or copy the branded message.

5. **Build label updated**
   - Menu/recovery screens show: `Build: Phase 2S restore hotfix`.

## Files changed

- `App.js`
- `PHASE2S_RESTORE_HOTFIX_README.md`

## Test

Run:

```bash
npx expo export --platform android --clear
```

If it passes:

```bash
git add .
git commit -m "Restore admin sharing wording and hide ad placeholders"
git push
```

Then build preview and test:

```bash
eas build -p android --profile preview --clear-cache
```

## QA priority

1. Menu opens.
2. Menu shows `Build: Phase 2S restore hotfix`.
3. Sign-in wording is friendly.
4. Admin sign-in reopens Menu.
5. Admin card/button is visible.
6. Main screen shows `Open Admin Control Panel` when admin is signed in.
7. Ad placeholder is not visible when ads are off.
8. Share/copy boxes are visible in Menu, match detail, groups, news, and Top.

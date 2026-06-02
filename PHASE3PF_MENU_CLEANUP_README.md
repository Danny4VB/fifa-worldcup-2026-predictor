# Phase 3P-F — Menu Cleanup

This phase handles Danny's Item 7 only.

## Scope

Clean up the Menu screen so it is less busy and more final-user friendly.

## What changes

- Remove "Copy deletion request text" from the visible Menu.
- Remove "Clear local profile on this phone" from the visible Menu unless it is needed for debugging.
- Simplify Delete Account / Data Request area.
- Keep Privacy Policy, Terms of Use, and Delete Account Page links.
- Keep account/sign-in/admin access logic unchanged.
- Keep full account deletion helper available if already implemented, but avoid confusing users with too many buttons.

## Recommended final Menu privacy section

Privacy & Account

- Privacy Policy
- Terms of Use
- Delete Account / Data

Delete Account / Data should open the deletion info/action screen, not show too many buttons directly in the main Menu.

## Apply

Run:

```bash
python3 apply_phase3PF_menu_cleanup.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3P-F menu cleanup"
git push
```

No production build is required immediately.

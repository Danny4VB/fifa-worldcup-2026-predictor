# Phase 2D - Firebase Admin Control Panel

This update adds a hidden admin control panel that is visible only after an approved admin signs in.

## Included admin tools

- Sponsor Manager: saves the active sponsor banner to `sponsors/active`
- Match Manager: saves manual score/status overrides to `matches/{matchId}`
- News Manager: creates new news documents in `news/{news_id}`
- Image URL Manager: saves stadium/team/player/jersey image links without using Firebase Storage

## Important

The panel is controlled by the Firestore user document:

`users/{uid}.isAdmin === true`

For Danny's admin account, the UID is:

`dsSd7SwEIBRr6YAuclHvQHeQK6n2`

## Test steps

1. Build and install the app.
2. Sign in with the admin account.
3. Open Menu.
4. Tap Hidden Admin -> Open Admin Control Panel.
5. Save sponsor text first.
6. Restart or reload the app to see the sponsor text update.

## Low-cost design

Images are stored as URLs in Firestore, not uploaded to Firebase Storage. This keeps Firebase cost lower and avoids heavy storage/bandwidth usage in this phase.

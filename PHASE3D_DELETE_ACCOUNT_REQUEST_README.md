# Phase 3D-A — Safe Delete Account / Data Request Flow

This update adds a safer account deletion request flow to the Menu without directly deleting Firebase Auth inside the app.

## Added

- Privacy & Legal card with buttons for Privacy Policy and Terms of Use.
- Delete Account / Data Request card.
- Open Delete Account web page.
- Email deletion request using the phone email app.
- Copy deletion request text.
- Clear local profile button for local/guest data.

## URLs used

- Privacy Policy: https://hobbee.fun/worldcup-predictor-privacy-policy
- Terms of Use: https://hobbee.fun/worldcup-predictor-terms
- Delete Account: https://hobbee.fun/worldcup-predictor-delete-account

## Why this approach

This is safer while the Menu is still being stabilized. A later Phase 3D-B can add full Firebase Auth deletion with re-authentication handling.

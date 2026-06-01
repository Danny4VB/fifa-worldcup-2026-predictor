# Phase 2U - Sponsor, Admin Controls, and Share Link Fix

This phase focuses on polish and wiring fixes after testing the working Phase 2S build.

## What changed

### 1. Share link and share wording
- All branded share messages now use:
  - `https://hobbee.fun/worldcup-predictor`
- The shared message now focuses first on the user prediction or app invite.
- Virtual Beehive Inc. and Hobbee.FUN are mentioned only at the end:
  - `A product of Virtual Beehive Inc., the company behind Hobbee.FUN.`
- This prepares the app for a smart landing page that can later redirect:
  - Android users to Google Play
  - iPhone/iPad users to App Store when iOS is ready
  - desktop users to a landing/download page

### 2. Sponsor bar polish
- Sponsor bar is taller and more readable.
- Sponsor logo area is larger.
- Sponsor logo supports multiple fields:
  - `logoUrl`
  - `logo`
  - `imageUrl`
  - `logoURL`
- If the logo fails to load, the app shows a clean sponsor fallback icon instead of a broken image.
- The sponsor bar opens the sponsor link if a link URL is provided.

### 3. Google Drive logo links
- The app now tries to convert common Google Drive file links to a direct view URL.
- Best practice is still to use a direct image URL ending in `.png`, `.jpg`, `.jpeg`, or `.webp`.

### 4. Admin AdMob controls wiring
- Admin ad switches are still controlled from the admin panel.
- After saving ad settings, the current device applies the setting immediately.
- Other users receive the Firebase setting when the app reads `appConfig/ads`.
- Admin panel now shows a clearer current draft status line:
  - Ads ON/OFF
  - Test ads ON/OFF
  - Auto-hide ON/OFF
  - Non-personalized ON/OFF

### 5. Image URL manager clarification
- The Image URL Manager now explains how to use collections and document IDs.
- No Firebase Storage upload was added, so this phase does not add storage cost.

## Files changed
- `App.js`
- `PHASE2U_SPONSOR_ADMIN_SHARE_FIX_README.md`

## Test plan
1. Open app.
2. Confirm sponsor bar is taller.
3. Sign in as admin.
4. Open Admin Control Panel.
5. Toggle Ad placements ON/OFF and save.
6. Return to app and confirm ad behavior changes.
7. Save sponsor with a logo URL.
8. Confirm sponsor bar shows logo or fallback.
9. Share a match/champion/menu invite and confirm the text focuses on FIFA WorldCup 2026 Predictor.
10. Confirm the shared link is `https://hobbee.fun/worldcup-predictor`.

## Important note
Create a Wix page at:

`https://hobbee.fun/worldcup-predictor`

Set that page's social preview image/title to the FIFA WorldCup 2026 Predictor app branding so WhatsApp/Facebook previews show the correct app, not the Hobbee.FUN homepage preview.

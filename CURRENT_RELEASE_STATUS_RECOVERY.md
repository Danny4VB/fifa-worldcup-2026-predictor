# FIFA WorldCup 2026 Predictor — Current Release Recovery Status

Date: 2026-06-05

## Current working status

### Confirmed working
- App opens.
- Share smart link works.
- Firebase Hosting smart link design works.
- Android redirect works to the correct Google Play Store link:
  https://play.google.com/store/apps/details?id=com.virtualbeehive.fifaworldcup2026predictor&pcampaignid=web_share
- Apple App Store button is intentionally a placeholder / Coming Soon.
- Smart link page now uses the real app logo instead of the soccer ball.
- App logo on smart link page was enlarged and white background removed.
- Admin sign-in works enough for several admin actions.
- Sponsor Manager Plus saves successfully.
- Match Manager Plus / Save Match Update works.
- Tested Mexico vs South Africa match update and it changed inside the app.
- Groups tab no longer crashes.
- Continent TBD text under group teams was removed.

## Current known issues

### 1. AdMob save permission issue
Problem:
- In Admin Panel, AdMob Display Control shows switches.
- Pressing "Save ad settings" gives:
  "Ad settings failed — Missing or insufficient permissions."

Diagnosis:
- This is likely NOT admin login anymore.
- This is likely Firestore Rules blocking write to:
  appConfig/ads

Likely fix:
Add Firestore rule:

match /appConfig/{docId} {
  allow read: if true;
  allow write: if isAdmin();
}

Where isAdmin() should check:
users/{request.auth.uid}.isAdmin == true

No app build needed for this rules fix.

### 2. Stadium image URL saved but image did not show
Test performed:
- Admin Panel → Image URL Manager Plus
- Added:
  collection/document shown as stadiums/mexico_city
  image URL
- App showed:
  "Image links saved — stadiums/mexico_city was saved to Firebase."

Problem:
- Mexico City Stadium card still showed placeholder/emoji style image, not the saved image.

Diagnosis:
Possible causes:
- App expects stadiums_2026 but admin saved to stadiums.
- App reads a different field name than the one saved.
- Match is connected by stadium name but not by stadium document/image.
- Stadium card UI may not yet be wired to Firebase imageUrl/stadiumImageUrl.

Next code inspection:
grep -n "stadiums_2026\|stadiums\|stadiumId\|stadiumImageUrl\|imageUrl\|Mexico City Stadium" App.js

### 3. Match detail release text cleanup still needed
Current text still visible:
- "Our Users Prediction"
- "Placeholder until backend global averages are connected."
- "Live Score" may be misleading if not truly live.

Suggested release wording:
- "Our Users Prediction" → "Fan Predictions"
- Placeholder → "Community predictions will appear as more fans make picks."
- "Live Score" → "Match Score" unless real live score source is connected.

### 4. Countdown/count-up postponed
Reason:
- Previous countdown/count-up attempts caused crash risk.
- Do not reintroduce before release unless there is time for full testing.

## Important code/admin changes already made

### Admin verification improvement
We patched requireAdmin() so it checks Firestore directly:
- If firebaseUser exists and local admin state is false, it reads:
  users/{firebaseUser.uid}
- If isAdmin === true, it sets admin true and allows save.
- If not, it shows signed-in email and UID.

Purpose:
- Fix inconsistent admin save buttons.
- Save Match Update now works after latest build.
- AdMob now reaches Firestore but is blocked by rules.

### Smart link / Firebase Hosting
Files involved:
- public/index.html
- public/app-logo.png
- smart-app-download.html

Firebase Hosting config:
- firebase.json uses "public": "public"
- /app rewrites to /index.html
- /download rewrites to /index.html

Current smart page behavior:
- Android redirects to Google Play.
- iPhone shows Coming Soon / does not redirect to generic App Store.
- Desktop shows designed page with both buttons.

## Current priority order

1. Fix Firestore Rules for appConfig/ads so AdMob save works.
2. Fix stadium image display/path/wiring.
3. Clean match detail placeholder/release text.
4. Run export check.
5. Save builds for only important final preview/production due Expo build credit warning.
6. Final QA.
7. Production AAB build for Google Play.

## Build credit warning

Expo notified:
- 86% of included build credits used.

Recommendation:
- Avoid builds for small changes.
- Use:
  npx expo export --platform android --clear
  for syntax/bundle checks.
- Use EAS only for:
  one final preview build
  one production build

## Useful commands

Check current git state:
git status

Clean generated export files:
git restore .expo
git restore dist
git clean -fd dist
git status

Export check:
npx expo export --platform android --clear

Commit current recovery/status note:
git add CURRENT_RELEASE_STATUS_RECOVERY.md
git commit -m "Add current release recovery status"
git push

## End-of-day status update

Stopped here:
- Smart share/download link works.
- Firebase Hosting smart link redirects Android to Google Play correctly.
- Smart link page now uses enlarged app logo with no white background.
- Apple App Store button remains Coming Soon placeholder.
- Firestore Rules were fixed for appConfig.
- AdMob admin save now works.
- Test ads show in app when Test Ads are ON.
- Real ads do not show yet when Test Ads are OFF, likely due to AdMob readiness / no-fill / app-ads.txt / policy / propagation, not app code.
- Sponsor save works.
- Match Manager Save Match Update works.
- Stadium image URL saved to Firebase but does not show yet in match detail.
- Next issue to fix: stadium image display wiring/path.
- After that: clean match detail text such as "Our Users Prediction" and placeholder wording.
- Avoid unnecessary EAS builds due Expo build-credit warning.

Next steps:
1. Inspect stadium image wiring in App.js.
2. Confirm whether match detail reads stadiums/mexico_city or another path/field.
3. Fix stadium image display.
4. Clean release text.
5. Run export.
6. Use one final preview build only when ready.

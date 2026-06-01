# Phase 2H - Better Admin Tools

## What changed

Phase 2H is built on top of Phase 2F and keeps:
- Phase 2E AdMob auto-hide/admin ad controls
- Phase 2F smart matches, smart scroll, and scoring foundation

## New admin improvements

1. **Admin note / change reason**
   - Optional note saved with admin logs.

2. **Sponsor Manager Plus**
   - Active/inactive sponsor toggle
   - Sponsor name, message, CTA, link, logo URL
   - Optional start date and end date
   - Priority field
   - Saves to `sponsors/active`

3. **Match Manager Plus**
   - Status quick buttons: upcoming, live, halftime, second half, final, postponed
   - Prediction locked toggle
   - Score fields
   - Minute field
   - Admin notes
   - Saves to `matches/{matchId}`

4. **News Manager Plus**
   - Create news item
   - Update existing item by News ID
   - Active/inactive toggle
   - Pinned toggle
   - Disable existing news ID without deleting history
   - Saves to `news/{newsId}`

5. **Image URL Manager Plus**
   - Main image URL
   - Stadium image URL
   - Coach image URL
   - Player image URL
   - Home jersey URL
   - Away jersey URL
   - Saves to any chosen collection/document ID

6. **Admin Logs**
   - Saves admin changes to `adminLogs/{timestamp_adminUid}`
   - Records admin UID, email, action, target document, optional note, and timestamp

## Files changed

- `App.js`
- `PHASE2H_ADMIN_TOOLS_README.md`

## Recommended commands

Do not start another EAS build while the EAS queue is stuck. First export-test and commit:

```bash
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 2H better admin tools"
git push
```

When EAS queue clears, build one combined preview containing Phase 2E + 2F + 2H:

```bash
eas build -p android --profile preview --clear-cache
```

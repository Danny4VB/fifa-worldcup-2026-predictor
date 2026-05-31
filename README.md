# FIFA WorldCup 2026 Predictor - Phase 2A

Phase 2A update for local APK testing.

## Includes
- All 104 World Cup 2026 matches
- Match detail prediction page at the top
- Countdown to prediction lock
- Local prediction saving with AsyncStorage
- Hobbee.FUN moving sponsor banner placeholder
- Redesigned groups/champion page
- News detail page
- Team comparison and team player detail pages
- Hidden admin placeholder through menu sign-in

## Install/update commands
```bash
npm install
npx expo install --fix
git add .
git commit -m "Phase 2A real fixtures and local prediction flow"
git push
eas build -p android --profile preview
```

Do not add expo-asset/expo-font/expo-status-bar to app.json plugins manually.

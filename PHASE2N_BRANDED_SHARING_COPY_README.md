# Phase 2N - Branded Sharing + Copy Text

## What changed

Phase 2N builds on Phase 2L and makes every share message more brand-aware and easier for users to reuse.

### 1. Branded share footer
Every major share message now includes:

- FIFA WorldCup 2026 Predictor
- Virtual Beehive Inc.
- Hobbee.FUN as the only hobby-specific social media platform
- https://hobbee.fun
- Social hashtags

### 2. Copy text support
Users can now copy share messages instead of opening the phone share sheet.

Added copy buttons for:

- Match prediction
- Champion pick
- Leaderboard challenge
- News/app share
- Menu app invite

### 3. App invite from Menu
The Menu now has an Invite Friends card with:

- Share app invite
- Copy invite text

### 4. Safe Google Play approach
This phase uses text sharing and clipboard only.

- No image generation
- No photo/media permission
- No Firebase cost increase
- No new sensitive Google Play declaration

## Files changed

- `App.js`
- `package.json` adds `expo-clipboard`
- `PHASE2N_BRANDED_SHARING_COPY_README.md`

## Test

Run:

```bash
npx expo export --platform android --clear
```

If needed, install the new dependency first:

```bash
npm install expo-clipboard
```

Then commit:

```bash
git add .
git commit -m "Add Phase 2N branded sharing and copy text"
git push
```

# Phase 3M — Stadium / Team / Player Data Structure

This phase improves the data structure for stadiums, teams, coaches, players, and image URLs without adding uploads, Firebase Storage, or new permissions.

## Goals

- Add clear data templates for stadium/team/player/coach records.
- Add helper functions for safe image URL handling.
- Add fallback images/text when image URLs are missing or invalid.
- Add admin instructions for image URL fields.
- Avoid Firebase Storage cost.
- Avoid photo/media permissions.
- Prepare the app for future real stadium/player/team data.

## Firebase collections prepared

### stadiums/{stadiumId}

```json
{
  "name": "MetLife Stadium",
  "city": "East Rutherford",
  "state": "New Jersey",
  "country": "USA",
  "capacity": "82,500",
  "ticketRange": "To be announced / varies by match",
  "imageUrl": "https://...",
  "sourceUrl": "https://..."
}
```

### teams/{teamId}

```json
{
  "name": "Argentina",
  "flag": "🇦🇷",
  "group": "A",
  "description": "Short team profile.",
  "homeJerseyUrl": "https://...",
  "awayJerseyUrl": "https://...",
  "coachName": "Coach name",
  "coachImageUrl": "https://...",
  "sourceUrl": "https://..."
}
```

### players/{playerId}

```json
{
  "teamId": "argentina",
  "name": "Player name",
  "jerseyNumber": "10",
  "position": "Forward",
  "height": "",
  "weight": "",
  "languages": "",
  "education": "",
  "achievements": "",
  "photoUrl": "https://...",
  "fullBodyImageUrl": "https://...",
  "sourceUrl": "https://..."
}
```

## Important image URL rule

Use direct image URLs when possible:

- .png
- .jpg
- .jpeg
- .webp

Google Drive preview links and random webpage links may not display correctly in React Native.

## Apply

Run:

```bash
python3 apply_phase3M_stadium_team_player_structure.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3M stadium team player data structure"
git push
```

No build is required immediately unless this becomes your next checkpoint.

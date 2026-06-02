# Phase 3P-M — Admin Media Manager URL-Only Foundation

This phase handles Danny's item 6:

- Stadium images should not be mixed between stadiums.
- Player images should not be mixed between teams/players.
- Admin needs a clear way to manage exact images.
- Avoid Firebase Storage/upload cost for now.

## Scope

This phase adds a URL-only media-management foundation.

## Why URL-only?

Uploading images inside the app usually requires Firebase Storage or another storage service, which can cost money.

The cheaper approach:

```txt
Admin pastes direct image URL
App saves that URL with the correct stadium/team/player/coach record
```

## Data structure

### Stadium media

```txt
media/stadiums/{stadiumId}
- name
- city
- imageUrl
- credit
- source
- updatedAt
```

### Team media

```txt
media/teams/{teamId}
- name
- flagImageUrl
- teamImageUrl
- coachImageUrl
- updatedAt
```

### Player media

```txt
media/players/{playerId}
- name
- teamId
- jerseyNumber
- photoUrl
- updatedAt
```

### Match links

```txt
matches/{matchId}
- stadiumId
- teamAId
- teamBId
```

This prevents:

- Texas stadium showing Mexico stadium image
- USA player #10 showing England player image
- coach/player/team images being mixed

## Admin rules

Admin should use stable IDs:

```txt
stadium_mexico_city
stadium_dallas
team_usa
team_england
player_usa_10
player_england_10
coach_usa
coach_england
```

## Apply

Run:

```bash
python3 apply_phase3PM_admin_media_manager_url_only.py
npx expo export --platform android --clear
git add .
git commit -m "Add Phase 3P-M admin media manager URL foundation"
git push
```

If export fails, do not build. Send the red error lines.

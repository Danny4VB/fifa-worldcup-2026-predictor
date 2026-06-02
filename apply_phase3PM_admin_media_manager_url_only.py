from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run from project root.")

s = APP.read_text()
backup = Path("App.phase3PM.backup.js")
if not backup.exists():
    backup.write_text(s)

marker = "PHASE3PM_ADMIN_MEDIA_MANAGER_URL_ONLY"
helper = """
// PHASE3PM_ADMIN_MEDIA_MANAGER_URL_ONLY
// URL-only media foundation. No Firebase Storage upload is used in this phase.
const PHASE3PM_MEDIA_PATHS = {
  stadiums: 'media/stadiums',
  teams: 'media/teams',
  players: 'media/players',
  coaches: 'media/coaches',
};

const phase3PMNormalizeId = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const phase3PMIsLikelyImageUrl = (url = '') => {
  const clean = String(url || '').trim();
  if (!clean) return false;
  return /^https?:\\/\\//i.test(clean);
};

const phase3PMDirectImageHint =
  'Use a direct image URL for this exact stadium, team, coach, or player. Do not use the same image URL for unrelated records.';

const phase3PMBuildStadiumMediaId = (stadiumName = '', city = '') =>
  `stadium_${phase3PMNormalizeId(stadiumName || city || 'unknown')}`;

const phase3PMBuildTeamMediaId = (teamName = '') =>
  `team_${phase3PMNormalizeId(teamName || 'unknown')}`;

const phase3PMBuildPlayerMediaId = (teamName = '', jerseyNumber = '', playerName = '') =>
  `player_${phase3PMNormalizeId(teamName || 'team')}_${phase3PMNormalizeId(jerseyNumber || playerName || 'unknown')}`;

const phase3PMBuildCoachMediaId = (teamName = '', coachName = '') =>
  `coach_${phase3PMNormalizeId(teamName || coachName || 'unknown')}`;

const phase3PMMediaRecordExample = {
  stadium: {
    id: 'stadium_dallas',
    name: 'Dallas Stadium',
    imageUrl: '',
    credit: '',
    source: '',
  },
  player: {
    id: 'player_usa_10',
    teamId: 'team_usa',
    jerseyNumber: '10',
    name: '',
    photoUrl: '',
  },
};

const PHASE3PM_ADMIN_MEDIA_RULES = [
  'Use unique IDs for each stadium/team/player/coach.',
  'Paste only image URLs that belong to the exact record.',
  'Do not reuse Mexico City Stadium image for Texas/Dallas stadium.',
  'Do not reuse a USA player image for England or another team.',
  'Firebase Storage upload is intentionally not included in this phase to avoid storage cost.'
];
"""
if marker not in s:
    imports = list(re.finditer(r"^import .+?;\\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\n" + helper + "\n" + s[idx:]
    else:
        s = helper + "\n" + s

# Improve existing admin image wording if present.
replacements = {
    "Image URL for stadium and players": "Exact image URL for this stadium/team/player",
    "Image URL": "Image URL",
    "Use a direct image URL when possible (.png, .jpg, .jpeg, or .webp). Google Drive preview links and regular webpage links may not display correctly.": "Paste a direct image URL for the exact stadium/team/player record.",
    "Google Drive preview links may not display. Use a direct image URL when possible.": "Use a direct image URL. Do not reuse unrelated stadium or player images.",
    "Stadium image URL": "Exact stadium image URL",
    "Player image URL": "Exact player photo URL",
    "Coach image URL": "Exact coach image URL",
    "Team image URL": "Exact team image URL",
}
for old, new in replacements.items():
    s = s.replace(old, new)

# Add admin label constants for future UI without changing storage.
if "PHASE3PM_ADMIN_MEDIA_LABELS" not in s:
    labels = """
// PHASE3PM_ADMIN_MEDIA_LABELS
const PHASE3PM_ADMIN_MEDIA_LABELS = {
  stadiumImageUrl: 'Exact stadium image URL',
  teamImageUrl: 'Exact team image URL',
  playerPhotoUrl: 'Exact player photo URL',
  coachImageUrl: 'Exact coach image URL',
  flagImageUrl: 'Exact flag image URL',
};
"""
    s = s.replace(helper, helper + "\n" + labels + "\n")

# Update build label.
for old in [
    "Build: Phase 3P-L direct UI structure cleanup",
    "Build: Phase 3P-K direct visible cleanup",
    "Build: Phase 3P-I groups sponsor cleanup",
]:
    s = s.replace(old, "Build: Phase 3P-M admin media URL foundation")

s = re.sub(r"\n\s*\n\s*\n", "\n\n", s)

APP.write_text(s)
print("Phase 3P-M admin media manager URL foundation applied.")
print("Next: npx expo export --platform android --clear")

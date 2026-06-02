from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run from the project root.")

s = APP.read_text()
backup = Path("App.phase3M.backup.js")
if not backup.exists():
    backup.write_text(s)

marker = "PHASE3M_DATA_STRUCTURE_HELPERS"
helper = r"""
// PHASE3M_DATA_STRUCTURE_HELPERS
const PHASE3M_DIRECT_IMAGE_HELP =
  'Use a direct image URL when possible (.png, .jpg, .jpeg, or .webp). Google Drive preview links and regular webpage links may not display correctly.';

const normalizePhase3MImageUrl = (value) => {
  if (!value || typeof value !== 'string') return '';
  const url = value.trim();

  // Basic Google Drive file link conversion attempt.
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
  }

  return url;
};

const getPhase3MImageUrl = (...values) => {
  const found = values.find((v) => typeof v === 'string' && v.trim().length > 0);
  return normalizePhase3MImageUrl(found || '');
};

const buildPhase3MStadiumRecord = ({
  name = '',
  city = '',
  state = '',
  country = '',
  capacity = '',
  ticketRange = '',
  imageUrl = '',
  sourceUrl = ''
} = {}) => ({
  name,
  city,
  state,
  country,
  capacity,
  ticketRange,
  imageUrl: normalizePhase3MImageUrl(imageUrl),
  sourceUrl,
  updatedAt: new Date().toISOString(),
});

const buildPhase3MTeamRecord = ({
  name = '',
  flag = '',
  group = '',
  description = '',
  homeJerseyUrl = '',
  awayJerseyUrl = '',
  coachName = '',
  coachImageUrl = '',
  sourceUrl = ''
} = {}) => ({
  name,
  flag,
  group,
  description,
  homeJerseyUrl: normalizePhase3MImageUrl(homeJerseyUrl),
  awayJerseyUrl: normalizePhase3MImageUrl(awayJerseyUrl),
  coachName,
  coachImageUrl: normalizePhase3MImageUrl(coachImageUrl),
  sourceUrl,
  updatedAt: new Date().toISOString(),
});

const buildPhase3MPlayerRecord = ({
  teamId = '',
  name = '',
  jerseyNumber = '',
  position = '',
  height = '',
  weight = '',
  languages = '',
  education = '',
  achievements = '',
  photoUrl = '',
  fullBodyImageUrl = '',
  sourceUrl = ''
} = {}) => ({
  teamId,
  name,
  jerseyNumber,
  position,
  height,
  weight,
  languages,
  education,
  achievements,
  photoUrl: normalizePhase3MImageUrl(photoUrl),
  fullBodyImageUrl: normalizePhase3MImageUrl(fullBodyImageUrl),
  sourceUrl,
  updatedAt: new Date().toISOString(),
});

const PHASE3M_ADMIN_IMAGE_FIELDS = [
  'stadium.imageUrl',
  'team.homeJerseyUrl',
  'team.awayJerseyUrl',
  'team.coachImageUrl',
  'player.photoUrl',
  'player.fullBodyImageUrl'
];

const PHASE3M_ADMIN_HELP_TEXT =
  'Image URL manager stores links only. It does not upload files, so there is no Firebase Storage cost.';
"""

if marker not in s:
    imports = list(re.finditer(r"^import .+?;\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\n" + helper + "\n" + s[idx:]
    else:
        s = helper + "\n" + s

for old in [
    "Build: Phase 3L real leaderboard foundation",
    "Build: Phase 3K admin Firebase validation",
    "Build: Phase 3I-A personalized share polish",
]:
    s = s.replace(old, "Build: Phase 3M stadium team player structure")

# Improve common admin text.
replacements = {
    "Image URL (direct link preferred)": "Image URL (direct image link preferred)",
    "Logo URL (direct image link preferred)": "Logo URL (direct image link preferred)",
    "Use a direct image URL when possible.": "Use a direct image URL when possible (.png, .jpg, .jpeg, or .webp).",
    "Google Drive preview links may not display.": "Google Drive preview links may not display. Use a direct image URL when possible.",
}
for old, new in replacements.items():
    s = s.replace(old, new)

notes_marker = "PHASE3M_DATA_VALIDATION_NOTES"
notes = r"""
// PHASE3M_DATA_VALIDATION_NOTES
const PHASE3M_DATA_VALIDATION_NOTES = [
  'Stadium image URL should point to a direct image file.',
  'Coach and player images should only use reliable/permitted sources.',
  'No image upload is used in this phase.',
  'If an image fails, show text fallback instead of crashing.',
  'Final team/player rosters may change before WorldCup 2026.'
];
"""
if notes_marker not in s:
    s = s.replace(helper, helper + "\n" + notes + "\n")

APP.write_text(s)
print("Phase 3M stadium/team/player data structure applied.")
print("Next: npx expo export --platform android --clear")

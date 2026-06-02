from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run this script from the project root.")

s = APP.read_text()
backup = Path("App.phase3PC.backup.js")
if not backup.exists():
    backup.write_text(s)

# Update build label.
for old in [
    "Build: Phase 3P-B final share text polish",
    "Build: Phase 3P-A header layout polish",
    "Build: Phase 3O production update prep",
    "Build: Phase 3N release QA diagnostics",
]:
    s = s.replace(old, "Build: Phase 3P-C groups team card cleanup")

marker = "PHASE3PC_GROUPS_TEAM_CLEANUP"
helper = """
// PHASE3PC_GROUPS_TEAM_CLEANUP
const PHASE3PC_CONFEDERATION_LABELS = {
  UEFA: 'Europe',
  CAF: 'Africa',
  AFC: 'Asia',
  CONCACAF: 'North America',
  CONMEBOL: 'South America',
  OFC: 'Oceania',
};

const getPhase3PCContinentLabel = (team = {}) => {
  const raw =
    team.continent ||
    team.confederation ||
    team.region ||
    team.zone ||
    '';
  const key = String(raw).trim().toUpperCase();
  return PHASE3PC_CONFEDERATION_LABELS[key] || raw || 'Continent TBD';
};

const buildPhase3PCGroupTeamLine = (team = {}) => ({
  flag: team.flag || '',
  name: team.name || team.team || 'Team TBD',
  continent: getPhase3PCContinentLabel(team),
});

const PHASE3PC_GROUPS_DISPLAY_RULE =
  'Groups tab team cards should show only flag, team name, and continent/confederation.';
"""

if marker not in s:
    imports = list(re.finditer(r"^import .+?;\\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\\n" + helper + "\\n" + s[idx:]
    else:
        s = helper + "\\n" + s

# Remove/soften common extra group card wording if present.
extra_text_patterns = [
    "Champion selection remains available by tapping a team.",
    "Long press still opens team details.",
    "Tap a team to choose champion.",
    "Tap any team to choose your champion.",
    "Group Stage",
    "Qualified",
    "Ranking",
    "Points",
    "Played",
    "Goal difference",
    "GD",
    "Pld",
    "Pts",
]
for txt in extra_text_patterns:
    s = s.replace(txt, "")

# Add a note constant for future bracket phase.
notes_marker = "PHASE3PC_BRACKET_NEXT_STEP_NOTES"
notes = """
// PHASE3PC_BRACKET_NEXT_STEP_NOTES
const PHASE3PC_BRACKET_NEXT_STEP_NOTES = [
  'Full bracket redesign should be handled separately.',
  'Recommended next phase: Phase 3P-D full knockout bracket diagram.',
  'Bracket may need a dedicated landscape-style screen or horizontal scroll.',
  'Round of 32/16/quarter/semi/final should be generated from match results/admin data later.'
];
"""
if notes_marker not in s:
    s = s.replace(helper, helper + "\n" + notes + "\n")

# Improve related headings if present.
s = s.replace("Knockout map below groups", "Knockout bracket")
s = s.replace("Groups first", "Groups")
s = s.replace("The bracket is visible now instead of waiting for admin/backend data.", "Bracket preview will be finalized in a separate phase.")

APP.write_text(s)
print("Phase 3P-C groups team card cleanup applied.")
print("Next: npx expo export --platform android --clear")

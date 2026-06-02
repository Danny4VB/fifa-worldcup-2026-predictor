from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run this script from the project root.")

s = APP.read_text()
backup = Path("App.phase3L.backup.js")
if not backup.exists():
    backup.write_text(s)

marker = "PHASE3L_REAL_LEADERBOARD_HELPERS"
helper = r"""
// PHASE3L_REAL_LEADERBOARD_HELPERS
const PHASE3L_LEADERBOARD_PAGE_SIZE = 25;

const PHASE3L_SCORE_RULES = {
  exactScore: 50,
  correctDraw: 15,
  correctWinner: 10,
};

const calculatePhase3LPredictionPoints = (prediction, match) => {
  if (!prediction || !match) return 0;

  const status = String(match.status || '').toLowerCase();
  if (status !== 'final' && status !== 'finished') return 0;

  const predA = Number(prediction.teamAScore ?? prediction.homeScore ?? prediction.scoreA);
  const predB = Number(prediction.teamBScore ?? prediction.awayScore ?? prediction.scoreB);
  const actualA = Number(match.teamAScore ?? match.homeScore ?? match.scoreA);
  const actualB = Number(match.teamBScore ?? match.awayScore ?? match.scoreB);

  if ([predA, predB, actualA, actualB].some((n) => Number.isNaN(n))) return 0;

  if (predA === actualA && predB === actualB) {
    return PHASE3L_SCORE_RULES.exactScore;
  }

  const predDiff = predA - predB;
  const actualDiff = actualA - actualB;

  if (predDiff === 0 && actualDiff === 0) {
    return PHASE3L_SCORE_RULES.correctDraw;
  }

  if ((predDiff > 0 && actualDiff > 0) || (predDiff < 0 && actualDiff < 0)) {
    return PHASE3L_SCORE_RULES.correctWinner;
  }

  return 0;
};

const getPhase3LScoreType = (prediction, match) => {
  if (!prediction || !match) return 'none';

  const predA = Number(prediction.teamAScore ?? prediction.homeScore ?? prediction.scoreA);
  const predB = Number(prediction.teamBScore ?? prediction.awayScore ?? prediction.scoreB);
  const actualA = Number(match.teamAScore ?? match.homeScore ?? match.scoreA);
  const actualB = Number(match.teamBScore ?? match.awayScore ?? match.scoreB);

  if ([predA, predB, actualA, actualB].some((n) => Number.isNaN(n))) return 'none';

  if (predA === actualA && predB === actualB) return 'exactScore';

  const predDiff = predA - predB;
  const actualDiff = actualA - actualB;

  if (predDiff === 0 && actualDiff === 0) return 'correctDraw';
  if ((predDiff > 0 && actualDiff > 0) || (predDiff < 0 && actualDiff < 0)) return 'correctWinner';

  return 'none';
};

const buildPhase3LLeaderboardRecord = ({ userId, profile = {}, totals = {} }) => ({
  userId,
  nickname: profile.nickname || profile.name || 'WorldCup fan',
  avatar: profile.avatar || profile.avatarEmoji || profile.selectedAvatar || '⚽',
  country: profile.country || '',
  points: Number(totals.points || 0),
  exactScores: Number(totals.exactScores || 0),
  correctWinners: Number(totals.correctWinners || 0),
  correctDraws: Number(totals.correctDraws || 0),
  matchesScored: Number(totals.matchesScored || 0),
  updatedAt: new Date().toISOString(),
});

const PHASE3L_LEADERBOARD_HELP_TEXT =
  'Leaderboard loads top 25 first to control Firebase reads. Use Load more for additional predictors.';
"""

if marker not in s:
    imports = list(re.finditer(r"^import .+?;\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\n" + helper + "\n" + s[idx:]
    else:
        s = helper + "\n" + s

# Update build label if present.
for old in [
    "Build: Phase 3K admin Firebase validation",
    "Build: Phase 3I-A personalized share polish",
    "Build: Phase 2S restore hotfix",
]:
    s = s.replace(old, "Build: Phase 3L real leaderboard foundation")

# Improve common leaderboard display wording if present.
replacements = {
    "Top Predictors": "Top Predictors",
    "Load more": "Load more predictors",
    "No predictors yet": "No scored predictors yet",
    "Leaderboard": "Leaderboard",
}
for old, new in replacements.items():
    s = s.replace(old, new)

# Add documentation constants only; avoid risky JSX changes.
text_marker = "PHASE3L_LEADERBOARD_VALIDATION_NOTES"
notes = r"""
// PHASE3L_LEADERBOARD_VALIDATION_NOTES
const PHASE3L_LEADERBOARD_VALIDATION_NOTES = [
  'Exact score = 50 points',
  'Correct draw = 15 points',
  'Correct winner = 10 points',
  'Only show users with at least one scored result',
  'Load leaderboard in pages of 25 to control Firebase cost',
  'Admin match final score should trigger recalculation or manual scoring refresh'
];
"""
if text_marker not in s:
    insert = s.find(marker)
    if insert != -1:
        s = s.replace(helper, helper + "\n" + notes + "\n")
    else:
        s = notes + "\n" + s

APP.write_text(s)
print("Phase 3L real leaderboard foundation applied.")
print("Next: npx expo export --platform android --clear")

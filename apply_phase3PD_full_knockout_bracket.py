from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run this script from the project root.")

s = APP.read_text()
backup = Path("App.phase3PD.backup.js")
if not backup.exists():
    backup.write_text(s)

# Update build label.
for old in [
    "Build: Phase 3P-C groups team card cleanup",
    "Build: Phase 3P-B final share text polish",
    "Build: Phase 3P-A header layout polish",
    "Build: Phase 3O production update prep",
    "Build: Phase 3N release QA diagnostics",
]:
    s = s.replace(old, "Build: Phase 3P-D full knockout bracket foundation")

marker = "PHASE3PD_FULL_KNOCKOUT_BRACKET"
helper = """
// PHASE3PD_FULL_KNOCKOUT_BRACKET
const PHASE3PD_BRACKET_ROUNDS = [
  'Round of 32',
  'Round of 16',
  'Quarter-finals',
  'Semi-finals',
  'Final'
];

const PHASE3PD_BRACKET_NOTE =
  'Bracket should scroll horizontally in portrait mode and advance winners from Firebase/admin match results.';

const getPhase3PDMatchWinner = (match = {}) => {
  const status = String(match.status || '').toLowerCase();
  if (status !== 'final' && status !== 'finished') return '';

  const a = Number(match.teamAScore ?? match.homeScore ?? match.scoreA);
  const b = Number(match.teamBScore ?? match.awayScore ?? match.scoreB);
  if (Number.isNaN(a) || Number.isNaN(b) || a === b) return '';

  return a > b
    ? (match.teamA || match.homeTeam || match.teamAName || 'Winner A')
    : (match.teamB || match.awayTeam || match.teamBName || 'Winner B');
};

const buildPhase3PDBracketSlot = ({ id, label, teamA, teamB, winner, matchId, source = 'manual/admin' } = {}) => ({
  id,
  label,
  teamA: teamA || 'TBD',
  teamB: teamB || 'TBD',
  winner: winner || '',
  matchId: matchId || '',
  source,
});

const buildPhase3PDBracketFoundation = (matches = []) => {
  const roundOf32 = matches
    .filter((m) => String(m.round || m.stage || '').toLowerCase().includes('32') || Number(m.matchNumber || m.id || 0) >= 73)
    .slice(0, 16)
    .map((m, index) =>
      buildPhase3PDBracketSlot({
        id: `r32-${index + 1}`,
        label: m.label || `M${m.matchNumber || index + 73}`,
        teamA: m.teamA || m.homeTeam || m.teamAName,
        teamB: m.teamB || m.awayTeam || m.teamBName,
        winner: getPhase3PDMatchWinner(m),
        matchId: m.id || m.matchId || String(m.matchNumber || ''),
      })
    );

  return {
    roundOf32,
    roundOf16: Array.from({ length: 8 }, (_, i) => buildPhase3PDBracketSlot({ id: `r16-${i + 1}`, label: `Winner R32-${i * 2 + 1} vs Winner R32-${i * 2 + 2}` })),
    quarterFinals: Array.from({ length: 4 }, (_, i) => buildPhase3PDBracketSlot({ id: `qf-${i + 1}`, label: `Winner R16-${i * 2 + 1} vs Winner R16-${i * 2 + 2}` })),
    semiFinals: Array.from({ length: 2 }, (_, i) => buildPhase3PDBracketSlot({ id: `sf-${i + 1}`, label: `Winner QF-${i * 2 + 1} vs Winner QF-${i * 2 + 2}` })),
    final: [buildPhase3PDBracketSlot({ id: 'final', label: 'Winner SF Left vs Winner SF Right' })],
  };
};

const PHASE3PD_BRACKET_DISPLAY_RULES = [
  'Use a dedicated bracket section/screen.',
  'Keep phone portrait mode.',
  'Bracket area can scroll horizontally.',
  'Round labels: Round of 32, Round of 16, Quarter-finals, Semi-finals, Final.',
  'Advance winners from admin/Firebase match results first.',
  'Live-score API can be added later after cost review.'
];
"""

if marker not in s:
    imports = list(re.finditer(r"^import .+?;\\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\\n" + helper + "\\n" + s[idx:]
    else:
        s = helper + "\\n" + s

# Adjust common bracket wording.
replacements = {
    "Knockout map below groups": "Knockout bracket",
    "Bracket preview will be finalized in a separate phase.": "Full bracket foundation added. Final winners advance from admin/Firebase results.",
    "The bracket section scrolls horizontally so the app can keep the phone in portrait mode.": "The bracket scrolls horizontally so the app can keep the phone in portrait mode.",
    "This avoids forcing the entire app to rotate while still giving the bracket more room.": "A later visual pass can make the bracket closer to the full tournament diagram.",
}
for old, new in replacements.items():
    s = s.replace(old, new)

# Add common style hints if style objects exist.
style_helper = """
// PHASE3PD_BRACKET_STYLE_HINTS
const PHASE3PD_BRACKET_STYLE_HINTS = {
  bracketMinWidth: 1400,
  bracketCardWidth: 150,
  bracketCardHeight: 58,
  bracketRoundGap: 24,
  bracketCardGap: 10,
};
"""
if "PHASE3PD_BRACKET_STYLE_HINTS" not in s:
    s = s.replace(helper, helper + "\n" + style_helper + "\n")

APP.write_text(s)
print("Phase 3P-D full knockout bracket foundation applied.")
print("Next: npx expo export --platform android --clear")

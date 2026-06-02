from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run from project root.")

s = APP.read_text()
backup = Path("App.phase3PN.backup.js")
if not backup.exists():
    backup.write_text(s)

marker = "PHASE3PN_VISUAL_MEDIA_UPGRADE"
helper = """
// PHASE3PN_VISUAL_MEDIA_UPGRADE
const PHASE3PN_WORLD_CUP_START_ISO = '2026-06-11T13:00:00-06:00';

const phase3PNFormatCountdown = (targetIso = PHASE3PN_WORLD_CUP_START_ISO) => {
  const now = Date.now();
  const target = new Date(targetIso).getTime();
  const diff = Math.max(0, target - now);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    label: `${days}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M ${String(seconds).padStart(2, '0')}S`,
  };
};

const PHASE3PN_DEFAULT_MEDIA = {
  matchesHero: '',
  groupsHero: '',
  stadiumFallback: '',
  teamFallback: '',
  playerFallback: '',
  sponsorBanner: '',
};

const phase3PNResolveImageUrl = (...urls) =>
  urls.find((url) => typeof url === 'string' && url.trim().startsWith('http')) || '';

const PHASE3PN_MEDIA_RULES = [
  'Use large image holders to make the app feel more exciting.',
  'Keep media URL-only for now to avoid upload/storage cost.',
  'Admin can paste exact image URLs for stadiums, teams, players, coaches, and sponsor banners.',
  'Use fallback holders when an image URL is missing.',
];
"""
if marker not in s:
    imports = list(re.finditer(r"^import .+?;\\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\n" + helper + "\n" + s[idx:]
    else:
        s = helper + "\n" + s

# Add countdown ticking state if useEffect/useState already exists.
# This injects generic state near the start of App() function if possible.
countdown_state_marker = "phase3PNCountdown"
if countdown_state_marker not in s:
    m = re.search(r"(function\s+App\s*\([^)]*\)\s*\{)", s)
    if not m:
        m = re.search(r"(export\s+default\s+function\s+App\s*\([^)]*\)\s*\{)", s)
    if m:
        insert = """
  const [phase3PNCountdown, setPhase3PNCountdown] = useState(phase3PNFormatCountdown());

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase3PNCountdown(phase3PNFormatCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

"""
        s = s[:m.end()] + insert + s[m.end():]

# Visible text replacements / cleanup for better visuals.
replacements = {
    "All 104 tournament matches are listed. Tap any match to predict before halftime.": "Tap any match to predict before halftime.",
    "Cost-controlled leaderboard view. The app loads a limited page first, then users can load more.": "",
    "Discover hobbies and share predictions with fans. • Visit Hobbee.FUN": "Visit Hobbee.FUN",
    "Discover hobbies and share predictions with fans.": "Visit Hobbee.FUN",
}
for old, new in replacements.items():
    s = s.replace(old, new)

# Add visual section helper constants. This does not force risky JSX replacement,
# but provides labels and reusable text for direct insertion/use.
if "PHASE3PN_VISIBLE_MEDIA_LABELS" not in s:
    labels = """
// PHASE3PN_VISIBLE_MEDIA_LABELS
const PHASE3PN_VISIBLE_MEDIA_LABELS = {
  countdownTitle: 'WorldCup starts in',
  matchesHeroTitle: 'WorldCup 2026 Countdown',
  groupsHeroTitle: 'Teams, groups, and road to the final',
  stadiumImageTitle: 'Stadium spotlight',
  teamImagesTitle: 'Team spotlight',
  adminMediaHint: 'Paste exact image URLs so stadium, team, player, and coach pictures do not get mixed.',
};
"""
    s = s.replace(helper, helper + "\n" + labels + "\n")

# Try to improve existing stadium card/image styles where they exist.
style_updates = [
    (r"(stadiumCard\s*:\s*\{[^}]*?minHeight\s*:\s*)\d+", r"\g<1>190"),
    (r"(stadiumCard\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>210"),
    (r"(stadiumImage\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>190"),
    (r"(stadiumImage\s*:\s*\{[^}]*?width\s*:\s*)['\"]?\d+%?['\"]?", r"\g<1>'100%'"),
    (r"(teamImage\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>150"),
    (r"(playerImage\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>150"),
    (r"(sponsorLogo\s*:\s*\{[^}]*?width\s*:\s*)\d+", r"\g<1>92"),
    (r"(sponsorLogo\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>92"),
    (r"(sponsorText\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>20"),
    (r"(sponsorMessage\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>20"),
]
for pat, repl in style_updates:
    s = re.sub(pat, repl, s, flags=re.S)

# Add style hints if StyleSheet exists. Safe constants can be used later.
if "phase3PNMediaHero" not in s:
    media_styles = """
// PHASE3PN_MEDIA_STYLE_HINTS
const PHASE3PN_MEDIA_STYLE_HINTS = {
  phase3PNMediaHero: {
    minHeight: 190,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 18,
  },
  phase3PNCountdownBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  phase3PNCountdownText: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
};
"""
    s = s.replace(helper, helper + "\n" + media_styles + "\n")

# Add admin media wording for exact URL management.
media_wording = {
    "Exact stadium image URL": "Exact stadium image URL",
    "Exact player photo URL": "Exact player photo URL",
    "Image URL for stadium and players": "Exact image URL for this specific stadium/team/player",
    "Image URL": "Image URL",
}
for old, new in media_wording.items():
    s = s.replace(old, new)

# Update build label.
for old in [
    "Build: Phase 3P-M admin media URL foundation",
    "Build: Phase 3P-L direct UI structure cleanup",
    "Build: Phase 3P-K direct visible cleanup",
]:
    s = s.replace(old, "Build: Phase 3P-N visual media upgrade")

s = re.sub(r"\n\s*\n\s*\n", "\n\n", s)

APP.write_text(s)
print("Phase 3P-N visual media upgrade applied.")
print("Next: npx expo export --platform android --clear")

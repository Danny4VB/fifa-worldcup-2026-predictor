from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run from the project root.")

s = APP.read_text()
backup = Path("App.phase3N.backup.js")
if not backup.exists():
    backup.write_text(s)

marker = "PHASE3N_RELEASE_QA_DIAGNOSTICS"
helper = r"""
// PHASE3N_RELEASE_QA_DIAGNOSTICS
const PHASE3N_APP_BUILD_LABEL = 'Build: Phase 3N release QA diagnostics';

const PHASE3N_QA_CHECKLIST = [
  'App opens without crash',
  'Menu opens without crash',
  'Sign-in wording is clean',
  'Admin panel opens for authorized admin',
  'Sponsor bar is readable and logo fallback works',
  'Ad controls save and apply from Firebase',
  'Share messages use the Google Play link',
  'Personalized share text includes avatar and nickname',
  'Avatar picker appears and saves',
  'Matches filters work',
  'Smart scroll / smart match order works',
  'Groups and knockout bracket show correctly',
  'Leaderboard opens and pagination foundation is ready',
  'News detail opens',
  'Privacy, Terms, and Delete Account links open',
  'Full delete helper opens but is not tested on admin account',
  'Notification preferences appear',
  'Celebration/share win appears when prediction earns points',
  'No Google AdMob placeholder visible when ads are off',
];

const PHASE3N_RELEASE_NOTES_DRAFT =
  'Updated FIFA WorldCup 2026 Predictor with improved match browsing, groups and knockout bracket, admin sponsor controls, personalized sharing, avatar selection, account deletion support, and leaderboard/scoring foundations.';

const PHASE3N_GOOGLE_PLAY_LINK =
  'https://play.google.com/store/apps/details?id=com.virtualbeehive.fifaworldcup2026predictor';

const PHASE3N_IOS_LINK_TODO =
  'TODO: Add Apple App Store link after iOS app is built and published.';

const getPhase3NQaSummary = () => PHASE3N_QA_CHECKLIST.map((item, index) => `${index + 1}. ${item}`).join('\\n');
"""

if marker not in s:
    imports = list(re.finditer(r"^import .+?;\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\n" + helper + "\n" + s[idx:]
    else:
        s = helper + "\n" + s

# Update known build labels.
for old in [
    "Build: Phase 3M stadium team player structure",
    "Build: Phase 3L real leaderboard foundation",
    "Build: Phase 3K admin Firebase validation",
    "Build: Phase 3I-A personalized share polish",
    "Build: Phase 2V visual polish",
    "Build: Phase 2S restore hotfix",
]:
    s = s.replace(old, "Build: Phase 3N release QA diagnostics")

# Ensure share URL stays Google Play direct link if landing page remnants exist.
s = s.replace(
    "https://hobbee.fun/worldcup-predictor",
    "https://play.google.com/store/apps/details?id=com.virtualbeehive.fifaworldcup2026predictor"
)

# Improve common internal text if present.
s = s.replace("Download or learn more:", "Download the app:")
s = s.replace(
    "A product of Virtual Beehive Inc., the company behind Hobbee.FUN — the only hobby-specific social media platform.",
    "FIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN."
)

APP.write_text(s)
print("Phase 3N release QA diagnostics applied.")
print("Next: npx expo export --platform android --clear")

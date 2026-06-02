from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run this script from the project root.")

s = APP.read_text()
backup = Path("App.phase3IA.backup.js")
if not backup.exists():
    backup.write_text(s)

# Ensure direct Google Play share URL is used.
GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.virtualbeehive.fifaworldcup2026predictor"
s = s.replace("https://hobbee.fun/worldcup-predictor", GOOGLE_PLAY)

# Insert helper text constants/functions in a safe way.
helper_marker = "PHASE3IA_PERSONALIZED_SHARE_HELPERS"
helper = f"""
// {helper_marker}
const APP_SHARE_URL = typeof APP_SHARE_URL !== 'undefined'
  ? APP_SHARE_URL
  : '{GOOGLE_PLAY}';

const getPhase3IAShareAvatar = (profile) => {{
  return profile?.avatar || profile?.avatarEmoji || profile?.selectedAvatar || '⚽';
}};

const getPhase3IAShareName = (profile, user) => {{
  return (
    profile?.nickname ||
    profile?.name ||
    user?.displayName ||
    user?.email?.split?.('@')?.[0] ||
    'A WorldCup fan'
  );
}};

const getPhase3IAFooter = () =>
  `Download the app:\\n${{APP_SHARE_URL}}\\n\\nFIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.`;

const buildPhase3IAMatchShareText = (profile, user, matchText, predictionText) => {{
  const avatar = getPhase3IAShareAvatar(profile);
  const name = getPhase3IAShareName(profile, user);
  return `${{avatar}} ${{name}} thinks this match will end:\\n\\n${{predictionText || matchText}}\\n\\nDo you agree? Tell them what you think by predicting all WorldCup 2026 matches on FIFA WorldCup 2026 Predictor — then share your predictions with the world.\\n\\n${{getPhase3IAFooter()}}`;
}};

const buildPhase3IAChampionShareText = (profile, user, championText) => {{
  const avatar = getPhase3IAShareAvatar(profile);
  const name = getPhase3IAShareName(profile, user);
  return `${{avatar}} ${{name}} thinks ${{championText}} will win WorldCup 2026.\\n\\nDo you agree? Choose your champion, predict every match, and share your picks with the world on FIFA WorldCup 2026 Predictor.\\n\\n${{getPhase3IAFooter()}}`;
}};

const buildPhase3IALeaderboardShareText = (profile, user) => {{
  const avatar = getPhase3IAShareAvatar(profile);
  const name = getPhase3IAShareName(profile, user);
  return `${{avatar}} ${{name}} is competing on the FIFA WorldCup 2026 Predictor leaderboard.\\n\\nPredict all WorldCup 2026 matches, challenge your friends, and share your predictions with the world.\\n\\n${{getPhase3IAFooter()}}`;
}};

const buildPhase3IAInviteShareText = (profile, user) => {{
  const avatar = getPhase3IAShareAvatar(profile);
  const name = getPhase3IAShareName(profile, user);
  return `${{avatar}} ${{name}} invited you to join FIFA WorldCup 2026 Predictor.\\n\\nPredict WorldCup 2026 matches, choose your champion, follow groups, and compete on the leaderboard.\\n\\n${{getPhase3IAFooter()}}`;
}};
"""

if helper_marker not in s:
    # Put helpers after imports if possible, otherwise near top.
    # Avoid replacing inside comments by finding first non-import code block.
    import_matches = list(re.finditer(r"^import .+?;\s*$", s, flags=re.M))
    if import_matches:
        insert_at = import_matches[-1].end()
        s = s[:insert_at] + "\n" + helper + "\n" + s[insert_at:]
    else:
        s = helper + "\n" + s

# Improve common share copy phrases while preserving existing app logic.
replacements = [
    ("A WorldCup fan invited you to join FIFA WorldCup 2026 Predictor.", 
     "A WorldCup fan invited you to join FIFA WorldCup 2026 Predictor."),
    ("Make your own WorldCup 2026 predictions, choose your champion, follow groups, and compete on the leaderboard.",
     "Predict WorldCup 2026 matches, choose your champion, follow groups, and compete on the leaderboard."),
    ("A product of Virtual Beehive Inc., the company behind Hobbee.FUN — the only hobby-specific social media platform.",
     "FIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN."),
    ("By Virtual Beehive Inc., creators of Hobbee.FUN — the only hobby-specific social media platform.",
     "FIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN."),
    ("Hobbee.FUN — the only hobby-specific social media platform.",
     "Hobbee.FUN."),
    ("Download or learn more:", "Download the app:"),
]
for old, new in replacements:
    s = s.replace(old, new)

# Add a visible phase label if prior build labels exist.
if "Phase 3I-A personalized share polish" not in s:
    s = s.replace("Phase 2S restore hotfix", "Phase 3I-A personalized share polish")
    s = s.replace("Phase 3D-B full account deletion", "Phase 3I-A personalized share polish")

APP.write_text(s)
print("Phase 3I-A personalized share polish applied.")
print("Next: npx expo export --platform android --clear")

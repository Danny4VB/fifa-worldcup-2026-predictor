from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run this script from the project root.")

s = APP.read_text()
backup = Path("App.phase3PB.backup.js")
if not backup.exists():
    backup.write_text(s)

GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.virtualbeehive.fifaworldcup2026predictor"

# Update build label.
for old in [
    "Build: Phase 3P-A header layout polish",
    "Build: Phase 3O production update prep",
    "Build: Phase 3N release QA diagnostics",
    "Build: Phase 3M stadium team player structure",
    "Build: Phase 3L real leaderboard foundation",
]:
    s = s.replace(old, "Build: Phase 3P-B final share text polish")

# Keep direct Google Play link.
s = s.replace("https://hobbee.fun/worldcup-predictor", GOOGLE_PLAY)

marker = "PHASE3PB_FINAL_SHARE_TEXT"
helper = f"""
// {marker}
const PHASE3PB_SHARE_LINK = '{GOOGLE_PLAY}';
const PHASE3PB_HASHTAGS = '#WorldCup2026 #Soccer #HobbeeFUN #DiscoverFUN';

const getPhase3PBShareAvatar = (profile) =>
  profile?.avatar || profile?.avatarEmoji || profile?.selectedAvatar || '⚽';

const getPhase3PBShareName = (profile, user) =>
  profile?.nickname ||
  profile?.name ||
  user?.displayName ||
  user?.email?.split?.('@')?.[0] ||
  'A WorldCup fan';

const buildPhase3PBMatchPredictionText = ({{ profile, user, teamA, teamB, flagA = '', flagB = '', scoreA = '', scoreB = '' }} = {{}}) => {{
  const avatar = getPhase3PBShareAvatar(profile);
  const name = getPhase3PBShareName(profile, user);
  const left = `${{flagA ? flagA + ' ' : ''}}${{teamA || 'Team A'}}`.trim();
  const right = `${{flagB ? flagB + ' ' : ''}}${{teamB || 'Team B'}}`.trim();
  return `${{avatar}} ${{name}} predicted:\\n\\n${{left}} ${{scoreA}} - ${{scoreB}} ${{right}}\\n\\nDo you agree, or do you think the result will be different?\\n\\nDownload the app and predict all WorldCup 2026 matches:\\n${{PHASE3PB_SHARE_LINK}}\\n\\nFIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.\\n\\n${{PHASE3PB_HASHTAGS}}`;
}};

const buildPhase3PBGenericChallengeText = ({{ profile, user, subject = 'WorldCup 2026' }} = {{}}) => {{
  const avatar = getPhase3PBShareAvatar(profile);
  const name = getPhase3PBShareName(profile, user);
  return `${{avatar}} ${{name}} is challenging you on FIFA WorldCup 2026 Predictor.\\n\\nDo you agree with their picks, or do you think the results will be different?\\n\\nDownload the app and predict all WorldCup 2026 matches:\\n${{PHASE3PB_SHARE_LINK}}\\n\\nFIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.\\n\\n${{PHASE3PB_HASHTAGS}}`;
}};

const buildPhase3PBChampionChallengeText = ({{ profile, user, champion = 'their champion pick' }} = {{}}) => {{
  const avatar = getPhase3PBShareAvatar(profile);
  const name = getPhase3PBShareName(profile, user);
  return `${{avatar}} ${{name}} predicted ${{champion}} will win WorldCup 2026.\\n\\nDo you agree, or do you think another team will win?\\n\\nDownload the app and predict all WorldCup 2026 matches:\\n${{PHASE3PB_SHARE_LINK}}\\n\\nFIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.\\n\\n${{PHASE3PB_HASHTAGS}}`;
}};
"""

if marker not in s:
    imports = list(re.finditer(r"^import .+?;\\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\\n" + helper + "\\n" + s[idx:]
    else:
        s = helper + "\\n" + s

# Replace old share/copy labels with short labels.
label_replacements = {
    "Share app invite": "Share",
    "Share prediction": "Share",
    "Share Prediction": "Share",
    "Share champion pick": "Share",
    "Share Champion Pick": "Share",
    "Share leaderboard challenge": "Share",
    "Share Leaderboard Challenge": "Share",
    "Share this win": "Share",
    "Share This Win": "Share",
    "Share news/app": "Share",
    "Copy invite text": "Copy",
    "Copy prediction": "Copy",
    "Copy Prediction": "Copy",
    "Copy champion pick": "Copy",
    "Copy Champion Pick": "Copy",
    "Copy leaderboard text": "Copy",
    "Copy win text": "Copy",
    "Copy Win Text": "Copy",
    "Copy text": "Copy",
}
for old, new in label_replacements.items():
    s = s.replace(old, new)

# Replace older share message fragments with final desired tone.
text_replacements = {
    "Do you agree? Tell them what you think by predicting all WorldCup 2026 matches on FIFA WorldCup 2026 Predictor — then share your predictions with the world.": 
        "Do you agree, or do you think the result will be different?",
    "Make your own WorldCup 2026 predictions, choose your champion, follow groups, and compete on the leaderboard.":
        "Download the app and predict all WorldCup 2026 matches:",
    "Predict WorldCup 2026 matches, choose your champion, follow groups, and compete on the leaderboard.":
        "Download the app and predict all WorldCup 2026 matches:",
    "Download the app:":
        "Download the app and predict all WorldCup 2026 matches:",
    "FIFA WorldCup 2026 Predictor\\nBy Virtual Beehive Inc., creators of Hobbee.FUN — the only hobby-specific social media platform.":
        "FIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.",
    "A product of Virtual Beehive Inc., the company behind Hobbee.FUN.":
        "FIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.",
    "#WorldCup2026 #Soccer #WorldCupPredictor":
        "#WorldCup2026 #Soccer #HobbeeFUN #DiscoverFUN",
}
for old, new in text_replacements.items():
    s = s.replace(old, new)

# Ensure hashtag line exists after common brand footer where simple static messages are used.
brand_footer = "FIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN."
if brand_footer in s and "#DiscoverFUN" not in s:
    s = s.replace(brand_footer, brand_footer + "\\n\\n#WorldCup2026 #Soccer #HobbeeFUN #DiscoverFUN")

# Try to make button text bold if common button text styles exist.
# This safely upgrades common style names if present.
for style_name in ["buttonText", "shareButtonText", "copyButtonText", "primaryButtonText", "secondaryButtonText"]:
    pattern = rf"({style_name}\\s*:\\s*\\{{[^}}]*?fontWeight\\s*:\\s*)['\\\"]\\w+['\\\"]"
    s = re.sub(pattern, rf"\g<1>'800'", s, flags=re.S)

def add_font_weight(src, style_name):
    m = re.search(rf"({style_name}\\s*:\\s*\\{{)", src)
    if not m:
        return src
    close = src.find("}", m.end())
    if close == -1:
        return src
    body = src[m.end():close]
    if "fontWeight" in body:
        return src
    return src[:close] + "    fontWeight: '800',\\n" + src[close:]

for style_name in ["buttonText", "shareButtonText", "copyButtonText"]:
    s = add_font_weight(s, style_name)

APP.write_text(s)
print("Phase 3P-B final share text polish applied.")
print("Next: npx expo export --platform android --clear")

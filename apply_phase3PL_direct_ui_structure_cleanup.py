from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run from project root.")

s = APP.read_text()
backup = Path("App.phase3PL.backup.js")
if not backup.exists():
    backup.write_text(s)

marker = "PHASE3PL_DIRECT_UI_STRUCTURE_CLEANUP"
helper = """
// PHASE3PL_DIRECT_UI_STRUCTURE_CLEANUP
const PHASE3PL_MENU_SECTIONS = [
  'Account',
  'Settings',
  'Invite Friends',
  'Privacy & Account',
  'About This App',
  'Admin Control Panel'
];

const PHASE3PL_COMPANY_LINE =
  'FIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.';

const phase3PLFlagFallback = (team = {}) => {
  const name = String(team.name || team.team || team.teamName || '').toLowerCase();
  if (name.includes('england')) return '🏴 ENG';
  if (name.includes('scotland')) return '🏴 SCO';
  return team.flag || '';
};

const phase3PLContinentLabel = (team = {}) => {
  const raw = team.continent || team.confederation || team.region || team.zone || '';
  const key = String(raw).trim().toUpperCase();
  const map = {
    UEFA: 'Europe',
    CAF: 'Africa',
    AFC: 'Asia',
    CONCACAF: 'North America',
    CONMEBOL: 'South America',
    OFC: 'Oceania',
  };
  return map[key] || raw || '';
};
"""
if marker not in s:
    imports = list(re.finditer(r"^import .+?;\\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\n" + helper + "\n" + s[idx:]
    else:
        s = helper + "\n" + s

copy_labels = [
    "Copy champion text","Copy Champion Text","Copy challenge text","Copy Challenge Text",
    "Copy prediction text","Copy Prediction Text","Copy invite text","Copy Invite Text",
    "Copy win text","Copy Win Text","Copy deletion request text","Copy Deletion Request Text",
    "Copy text","Copy Text","Copy",
]

for tag in ["TouchableOpacity", "Pressable"]:
    for label in copy_labels:
        pattern = rf"<{tag}[^>]*>\s*(?:(?!</{tag}>).)*?<Text[^>]*>\s*{re.escape(label)}\s*</Text>\s*(?:(?!</{tag}>).)*?</{tag}>"
        s = re.sub(pattern, "", s, flags=re.I | re.S)

for label in copy_labels:
    s = re.sub(rf"<Button[^>]*title=\{{?['\"]{re.escape(label)}['\"]\}}?[^>]*/>", "", s, flags=re.I | re.S)

for label in copy_labels:
    if label != "Copy":
        s = s.replace(label, "")
s = re.sub(r"(['\"])Copy\1", r"''", s)
s = re.sub(r">\s*Copy\s*<", "><", s)

for label in [
    "Share app invite","Share App Invite","Share champion pick","Share Champion Pick",
    "Share leaderboard challenge","Share Leaderboard Challenge","Share this prediction",
    "Share This Prediction","Share prediction","Share Prediction"
]:
    s = s.replace(label, "Share")

for text in [
    "Share to social apps or copy this branded message",
    "Share to social apps",
    "copy this branded message",
    "or copy this branded message",
    "Share FIFA WorldCup 2026 Predictor with your social networks, or copy the message and paste it anywhere.",
    "Share FIFA WorldCup 2026 Predictor with your social networks, or copy the message and paste it anywhere",
]:
    s = s.replace(text, "")

style_updates = [
    (r"(shareRow\s*:\s*\{[^}]*?justifyContent\s*:\s*)['\"][^'\"]+['\"]", r"\g<1>'center'"),
    (r"(shareActions\s*:\s*\{[^}]*?justifyContent\s*:\s*)['\"][^'\"]+['\"]", r"\g<1>'center'"),
    (r"(shareButton\s*:\s*\{[^}]*?alignSelf\s*:\s*)['\"][^'\"]+['\"]", r"\g<1>'center'"),
    (r"(shareButton\s*:\s*\{[^}]*?minWidth\s*:\s*)\d+", r"\g<1>260"),
    (r"(shareButtonText\s*:\s*\{[^}]*?fontWeight\s*:\s*)['\"][^'\"]+['\"]", r"\g<1>'900'"),
    (r"(appLogo\s*:\s*\{[^}]*?width\s*:\s*)\d+", r"\g<1>74"),
    (r"(appLogo\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>74"),
    (r"(headerLogo\s*:\s*\{[^}]*?width\s*:\s*)\d+", r"\g<1>74"),
    (r"(headerLogo\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>74"),
    (r"(logo\s*:\s*\{[^}]*?width\s*:\s*)\d+", r"\g<1>74"),
    (r"(logo\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>74"),
    (r"(header\s*:\s*\{[^}]*?paddingTop\s*:\s*)\d+", r"\g<1>44"),
    (r"(appHeader\s*:\s*\{[^}]*?paddingTop\s*:\s*)\d+", r"\g<1>44"),
    (r"(topHeader\s*:\s*\{[^}]*?paddingTop\s*:\s*)\d+", r"\g<1>44"),
    (r"(header\s*:\s*\{[^}]*?minHeight\s*:\s*)\d+", r"\g<1>126"),
    (r"(appHeader\s*:\s*\{[^}]*?minHeight\s*:\s*)\d+", r"\g<1>126"),
    (r"(topHeader\s*:\s*\{[^}]*?minHeight\s*:\s*)\d+", r"\g<1>126"),
    (r"(headerTitle\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>27"),
    (r"(appTitle\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>27"),
    (r"(detailHeader\s*:\s*\{[^}]*?paddingTop\s*:\s*)\d+", r"\g<1>44"),
    (r"(matchHeader\s*:\s*\{[^}]*?paddingTop\s*:\s*)\d+", r"\g<1>44"),
    (r"(detailHeader\s*:\s*\{[^}]*?minHeight\s*:\s*)\d+", r"\g<1>110"),
    (r"(matchHeader\s*:\s*\{[^}]*?minHeight\s*:\s*)\d+", r"\g<1>110"),
    (r"(detailTitle\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>26"),
    (r"(matchTitle\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>26"),
]
for pat, repl in style_updates:
    s = re.sub(pat, repl, s, flags=re.S)

s = re.sub(r"<Text[^>]*>\s*Virtual Beehive Inc\.\s*</Text>", "", s, flags=re.S)
s = s.replace("Virtual Beehive Inc.\\nFIFA WorldCup 2026 Predictor", "FIFA WorldCup 2026 Predictor")
s = s.replace("Virtual Beehive Inc. • FIFA WorldCup 2026 Predictor", "FIFA WorldCup 2026 Predictor")

for old, new in {
    "Profile": "Account",
    "Account & Privacy": "Privacy & Account",
    "Privacy & Legal": "Privacy & Account",
    "Notification preferences": "Settings",
    "Notifications": "Settings",
    "Delete Account / Data Request": "Delete Account / Data",
    "Open Privacy Policy": "Privacy Policy",
    "Open Terms of Use": "Terms of Use",
    "Open Delete Account Page": "Delete Account / Data",
}.items():
    s = s.replace(old, new)

for text in [
    "Choose which reminders you want. Push notifications will be connected in a later update; these settings prepare your preferences now.",
    "You can request deletion of your FIFA WorldCup 2026 Predictor account and related app data. This may include your email, name, nickname, profile details, predictions, votes, champion pick, and leaderboard records connected to your account.",
    "Review how FIFA WorldCup 2026 Predictor handles account data, predictions, ads, leaderboard activity, and deletion requests.",
    "Build: Phase 3G notification preferences",
]:
    s = s.replace(text, "")

company = "FIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN."
if company not in s:
    s = s.replace(helper, helper + f"\nconst PHASE3PL_ABOUT_THIS_APP_LINE = '{company}';\n")

s = re.sub(r"(name\s*:\s*['\"]England['\"][^}]*?flag\s*:\s*)['\"][^'\"]*['\"]", r"\1'🏴 ENG'", s, flags=re.S)
s = re.sub(r"(name\s*:\s*['\"]Scotland['\"][^}]*?flag\s*:\s*)['\"][^'\"]*['\"]", r"\1'🏴 SCO'", s, flags=re.S)
s = re.sub(r"(team\s*:\s*['\"]England['\"][^}]*?flag\s*:\s*)['\"][^'\"]*['\"]", r"\1'🏴 ENG'", s, flags=re.S)
s = re.sub(r"(team\s*:\s*['\"]Scotland['\"][^}]*?flag\s*:\s*)['\"][^'\"]*['\"]", r"\1'🏴 SCO'", s, flags=re.S)

for text in [
    "Group teams are shown first, then the knockout map appears below just like a tournament board.",
    "Group teams are shown first, then the knockout bracket appears below just like a tournament board.",
    "Seed 1 • tap to pick champion • long press for team info",
    "Seed 2 • tap to pick champion • long press for team info",
    "Seed 3 • tap to pick champion • long press for team info",
    "Seed 4 • tap to pick champion • long press for team info",
    "Group team • tap to pick champion • long press for team info",
    "tap to pick champion • long press for team info",
    "tap to pick champion",
    "long press for team info",
]:
    s = s.replace(text, "")

s = re.sub(r"`Seed\s*\$\{[^`]+?\}\s*•\s*tap to pick champion\s*•\s*long press for team info`", "phase3PLContinentLabel(team)", s)
s = re.sub(r"`Group team\s*•\s*tap to pick champion\s*•\s*long press for team info`", "phase3PLContinentLabel(team)", s)
s = re.sub(r"`Seed\s*\$\{[^`]+?\}`", "phase3PLContinentLabel(team)", s)

for text in [
    "Discover hobbies and share predictions with fans. • Visit Hobbee.FUN",
    "Discover hobbies and share predictions with fans.",
    "predictions with fans. • Visit Hobbee.FUN",
    "and share predictions with fans. • Visit Hobbee.FUN",
    "share predictions with fans. • Visit Hobbee.FUN",
]:
    s = s.replace(text, "Visit Hobbee.FUN")

for old in [
    "Build: Phase 3P-K direct visible cleanup",
    "Build: Phase 3P-I groups sponsor cleanup",
    "Build: Phase 3P-H menu restructure header cleanup",
]:
    s = s.replace(old, "Build: Phase 3P-L direct UI structure cleanup")

s = re.sub(r"<Text[^>]*>\s*</Text>", "", s, flags=re.S)
for tag in ["TouchableOpacity", "Pressable"]:
    s = re.sub(rf"<{tag}([^>]*)>\s*</{tag}>", "", s, flags=re.S)
s = re.sub(r"\n\s*\n\s*\n", "\n\n", s)

APP.write_text(s)
print("Phase 3P-L direct UI structure cleanup applied.")
print("Next: npx expo export --platform android --clear")

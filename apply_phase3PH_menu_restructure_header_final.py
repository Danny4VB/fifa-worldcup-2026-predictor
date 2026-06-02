from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run this script from the project root.")

s = APP.read_text()
backup = Path("App.phase3PH.backup.js")
if not backup.exists():
    backup.write_text(s)

# ------------------------------------------------------------
# 1) Header final cleanup
# ------------------------------------------------------------
# Remove Virtual Beehive Inc. from top/header visible strings.
# Keep company ownership for menu/about/footer/share messages.
header_company_patterns = [
    "Virtual Beehive Inc. • ",
    "Virtual Beehive Inc.",
    "Virtual Beehive",
]
# We cannot remove all company references globally because share/about still need it.
# So only remove common header adjacent forms and preserve the official footer/share phrase later.
s = s.replace("Virtual Beehive Inc.\\nFIFA WorldCup 2026 Predictor", "FIFA WorldCup 2026 Predictor")
s = s.replace("Virtual Beehive Inc.\\n", "")
s = s.replace("Virtual Beehive Inc. • FIFA WorldCup 2026 Predictor", "FIFA WorldCup 2026 Predictor")

# If header renders company in a specific Text, blank obvious company label text.
s = re.sub(r"<Text([^>]*)>\s*Virtual Beehive Inc\.\s*</Text>", "", s)
s = re.sub(r"<Text([^>]*)>\s*Virtual Beehive\s*</Text>", "", s)

# Increase safe top spacing and improve header size if style keys exist.
style_updates = [
    (r"(header\s*:\s*\{[^}]*?paddingTop\s*:\s*)\d+", r"\g<1>46"),
    (r"(appHeader\s*:\s*\{[^}]*?paddingTop\s*:\s*)\d+", r"\g<1>46"),
    (r"(topHeader\s*:\s*\{[^}]*?paddingTop\s*:\s*)\d+", r"\g<1>46"),
    (r"(header\s*:\s*\{[^}]*?minHeight\s*:\s*)\d+", r"\g<1>118"),
    (r"(appHeader\s*:\s*\{[^}]*?minHeight\s*:\s*)\d+", r"\g<1>118"),
    (r"(topHeader\s*:\s*\{[^}]*?minHeight\s*:\s*)\d+", r"\g<1>118"),
    (r"(appTitle\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>26"),
    (r"(headerTitle\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>26"),
]
for pat, repl in style_updates:
    s = re.sub(pat, repl, s, flags=re.S)

# ------------------------------------------------------------
# 2) Add internal constants/helpers for restructured menu
# ------------------------------------------------------------
marker = "PHASE3PH_MENU_RESTRUCTURE_HEADER_FINAL"
helper = """
// PHASE3PH_MENU_RESTRUCTURE_HEADER_FINAL
const PHASE3PH_MENU_SECTIONS = [
  'Profile',
  'Settings',
  'Invite Friends',
  'Privacy & Account',
  'About This App',
  'Admin Control Panel'
];

const PHASE3PH_ABOUT_APP_TEXT =
  'FIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.';

const PHASE3PH_MENU_RESTRUCTURE_RULES = [
  'Header shows app logo and app name only.',
  'Virtual Beehive Inc. appears in Menu/About, not top header.',
  'Main Menu shows high-level sections only.',
  'Profile details belong inside Profile.',
  'Notification and mood settings belong inside Settings.',
  'Privacy, Terms, and Delete Account belong inside Privacy & Account.',
  'Invite Friends uses one Share button only.'
];
"""
if marker not in s:
    imports = list(re.finditer(r"^import .+?;\\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\n" + helper + "\n" + s[idx:]
    else:
        s = helper + "\n" + s

# ------------------------------------------------------------
# 3) Menu label standardization
# ------------------------------------------------------------
label_replacements = {
    "Account": "Profile",
    "Edit account": "Edit Profile",
    "Edit Account": "Edit Profile",
    "Change Profile": "Edit Profile",
    "Change profile": "Edit Profile",
    "Notification preferences": "Settings",
    "Notifications": "Settings",
    "Privacy & Legal": "Privacy & Account",
    "Delete Account / Data Request": "Delete Account / Data",
    "Open Privacy Policy": "Privacy Policy",
    "Open Terms of Use": "Terms of Use",
    "Share app invite": "Share",
    "Copy invite text": "",
    "Copy": "",
}
for old, new in label_replacements.items():
    s = s.replace(old, new)

# ------------------------------------------------------------
# 4) Remove public clutter from invite/delete areas
# ------------------------------------------------------------
remove_visible_texts = [
    "Share to social apps or copy this branded message",
    "Share FIFA WorldCup 2026 Predictor with your social networks, or copy the message and paste it anywhere.",
    "or copy the message and paste it anywhere",
    "Copy deletion request text",
    "Copy Deletion Request Text",
    "Clear local profile on this phone",
    "Clear local profile",
    "Delete My Account Permanently",
    "This option deletes or anonymizes your app profile, predictions, votes, champion pick, and leaderboard record where allowed. Firebase may ask you to sign in again before the login account can be fully deleted.",
    "Firebase may ask you to sign in again before the login account can be fully deleted.",
]
for txt in remove_visible_texts:
    s = s.replace(txt, "")

# Remove blocks that have remaining Copy labels inside buttons.
for tag in ["TouchableOpacity", "Pressable"]:
    s = re.sub(rf"<{tag}[^>]*>\s*(?:.|\n)*?<Text[^>]*>\s*Copy\s*</Text>\s*(?:.|\n)*?</{tag}>", "", s, flags=re.I)

# Remove empty Text and simple empty components.
s = re.sub(r"<Text[^>]*>\s*</Text>", "", s, flags=re.S)
for tag in ["TouchableOpacity", "Pressable"]:
    s = re.sub(rf"<{tag}([^>]*)>\s*</{tag}>", "", s, flags=re.S)

# ------------------------------------------------------------
# 5) Insert/about ownership text if not already present in menu/about context
# ------------------------------------------------------------
official = "FIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN."
if official not in s:
    # Add as constant use only; avoids risky JSX insertion.
    s = s.replace(helper, helper + f"\nconst PHASE3PH_OFFICIAL_COMPANY_LINE = '{official}';\n")

# ------------------------------------------------------------
# 6) Keep share message official footer intact
# ------------------------------------------------------------
# Restore any accidental over-removal of company line in share/about constants.
s = s.replace(
    "FIFA WorldCup 2026 Predictor is a product of , the company behind Hobbee.FUN.",
    official
)

# Update build label.
for old in [
    "Build: Phase 3P-G crossed UI cleanup",
    "Build: Phase 3P-F menu cleanup",
    "Build: Phase 3P-E user-facing text cleanup",
    "Build: Phase 3P-D full knockout bracket foundation",
    "Build: Phase 3P-C groups team card cleanup",
    "Build: Phase 3P-B final share text polish",
    "Build: Phase 3P-A header layout polish",
]:
    s = s.replace(old, "Build: Phase 3P-H menu restructure header cleanup")

# Clean multiple blank lines.
s = re.sub(r"\n\s*\n\s*\n", "\n\n", s)

APP.write_text(s)
print("Phase 3P-H menu restructure and header cleanup applied.")
print("Next: npx expo export --platform android --clear")

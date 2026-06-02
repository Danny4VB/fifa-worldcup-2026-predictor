from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run this script from the project root.")

s = APP.read_text()
backup = Path("App.phase3PF.backup.js")
if not backup.exists():
    backup.write_text(s)

marker = "PHASE3PF_MENU_CLEANUP"
helper = """
// PHASE3PF_MENU_CLEANUP
// Menu cleanup: remove confusing delete/copy/local-profile buttons from the public menu.
const PHASE3PF_MENU_RULES = [
  'Keep Menu simple.',
  'Keep Privacy Policy, Terms of Use, and Delete Account / Data.',
  'Remove Copy deletion request text from visible menu.',
  'Remove Clear local profile on this phone from visible menu unless debugging.',
  'Do not change sign-in/admin logic.'
];
"""

if marker not in s:
    imports = list(re.finditer(r"^import .+?;\\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\\n" + helper + "\\n" + s[idx:]
    else:
        s = helper + "\\n" + s

# Remove or simplify confusing button labels/text.
remove_phrases = [
    "Copy Deletion Request Text",
    "Copy deletion request text",
    "Copy deletion request",
    "Copy Delete Request",
    "Clear local profile on this phone",
    "Clear Local Profile On This Phone",
    "Clear local profile",
    "Clear Local Profile",
    "Save profile locally only",
]

for phrase in remove_phrases:
    s = s.replace(phrase, "")

# Simplify menu/section wording.
replacements = {
    "Delete Account / Data Request": "Delete Account / Data",
    "Open Delete Account Page": "Delete Account / Data",
    "Email Deletion Request": "Email deletion request",
    "Privacy & Legal": "Privacy & Account",
    "Account & Privacy": "Privacy & Account",
    "Open Privacy Policy": "Privacy Policy",
    "Open Terms of Use": "Terms of Use",
    "Open Delete Account Page": "Delete Account / Data",
    "Continue as guest": "Continue as guest",
}

for old, new in replacements.items():
    s = s.replace(old, new)

# Try to remove simple JSX button blocks that contain now-empty text labels.
# This is conservative and may leave blank buttons if structure is complex, but export-test will catch syntax issues.
s = re.sub(r"<[^>]*(?:Button|TouchableOpacity|Pressable)[^>]*>\s*<Text[^>]*>\s*</Text>\s*</[^>]+>", "", s, flags=re.S)
s = re.sub(r"<Text[^>]*>\s*</Text>", "", s, flags=re.S)

# Remove multiple blank lines.
s = re.sub(r"\n\s*\n\s*\n", "\n\n", s)

# Add final menu notes.
notes_marker = "PHASE3PF_FINAL_MENU_NOTES"
notes = """
// PHASE3PF_FINAL_MENU_NOTES
const PHASE3PF_FINAL_MENU_NOTES = [
  'Final menu should feel simple and user-ready.',
  'Deletion details can live on the Delete Account / Data screen or web page.',
  'Local-only clearing is a developer/debug action, not a main user action.'
];
"""
if notes_marker not in s:
    s = s.replace(helper, helper + "\n" + notes + "\n")

APP.write_text(s)
print("Phase 3P-F menu cleanup applied.")
print("Next: npx expo export --platform android --clear")

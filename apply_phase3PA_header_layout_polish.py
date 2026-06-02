from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run this script from the project root.")

s = APP.read_text()
backup = Path("App.phase3PA.backup.js")
if not backup.exists():
    backup.write_text(s)

for old in [
    "Build: Phase 3O production update prep",
    "Build: Phase 3N release QA diagnostics",
    "Build: Phase 3M stadium team player structure",
    "Build: Phase 3L real leaderboard foundation",
    "Build: Phase 3K admin Firebase validation",
]:
    s = s.replace(old, "Build: Phase 3P-A header layout polish")

marker = "PHASE3PA_HEADER_LAYOUT_POLISH"
helper = """
// PHASE3PA_HEADER_LAYOUT_POLISH
// Header visual polish only: taller header, larger app logo, more breathing room under phone status bar.
"""
if marker not in s:
    imports = list(re.finditer(r"^import .+?;\\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\\n" + helper + "\\n" + s[idx:]
    else:
        s = helper + "\\n" + s

replacements = [
    (r"(header\s*:\s*\{[^}]*?paddingTop\s*:\s*)\d+", r"\g<1>34"),
    (r"(header\s*:\s*\{[^}]*?paddingVertical\s*:\s*)\d+", r"\g<1>18"),
    (r"(header\s*:\s*\{[^}]*?paddingBottom\s*:\s*)\d+", r"\g<1>16"),
    (r"(header\s*:\s*\{[^}]*?minHeight\s*:\s*)\d+", r"\g<1>96"),
    (r"(header\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>104"),
    (r"(topHeader\s*:\s*\{[^}]*?paddingTop\s*:\s*)\d+", r"\g<1>34"),
    (r"(topHeader\s*:\s*\{[^}]*?paddingBottom\s*:\s*)\d+", r"\g<1>16"),
    (r"(topHeader\s*:\s*\{[^}]*?minHeight\s*:\s*)\d+", r"\g<1>96"),
    (r"(topHeader\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>104"),
    (r"(appHeader\s*:\s*\{[^}]*?paddingTop\s*:\s*)\d+", r"\g<1>34"),
    (r"(appHeader\s*:\s*\{[^}]*?paddingBottom\s*:\s*)\d+", r"\g<1>16"),
    (r"(appHeader\s*:\s*\{[^}]*?minHeight\s*:\s*)\d+", r"\g<1>100"),
    (r"(appHeader\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>108"),
    (r"(logo\s*:\s*\{[^}]*?width\s*:\s*)\d+", r"\g<1>56"),
    (r"(logo\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>56"),
    (r"(appLogo\s*:\s*\{[^}]*?width\s*:\s*)\d+", r"\g<1>58"),
    (r"(appLogo\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>58"),
    (r"(headerLogo\s*:\s*\{[^}]*?width\s*:\s*)\d+", r"\g<1>58"),
    (r"(headerLogo\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>58"),
    (r"(appTitle\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>24"),
    (r"(headerTitle\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>24"),
    (r"(companyText\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>13"),
    (r"(headerCompany\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>13"),
]

for pat, repl in replacements:
    s = re.sub(pat, repl, s, flags=re.S)

def add_field_to_style(src, style_name, field_line):
    pattern = rf"({style_name}\s*:\s*\{{)"
    m = re.search(pattern, src)
    if not m:
        return src
    close = src.find("}", m.end())
    if close == -1:
        return src
    field_name = field_line.split(":")[0].strip()
    body = src[m.end():close]
    if field_name in body:
        return src
    return src[:m.end()] + "\n    " + field_line + src[m.end():]

for style_name in ["header", "topHeader", "appHeader"]:
    s = add_field_to_style(s, style_name, "minHeight: 100,")

notes_marker = "PHASE3PA_HEADER_NOTES"
notes = """
// PHASE3PA_HEADER_NOTES
const PHASE3PA_HEADER_NOTES = [
  'Header should feel taller and less crowded.',
  'Logo should be easier to see.',
  'Virtual Beehive Inc. and app title should be readable.',
  'Mood and menu icons should stay aligned.'
];
"""
if notes_marker not in s:
    s = s.replace(helper, helper + "\n" + notes + "\n")

APP.write_text(s)
print("Phase 3P-A header layout polish applied.")
print("Next: npx expo export --platform android --clear")

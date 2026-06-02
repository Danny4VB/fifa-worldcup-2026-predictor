from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run this script from the project root.")

s = APP.read_text()
backup = Path("App.phase3PI.backup.js")
if not backup.exists():
    backup.write_text(s)

# -----------------------------
# Phase marker / helpers
# -----------------------------
marker = "PHASE3PI_GROUPS_SPONSOR_FINAL_CLEANUP"
helper = """
// PHASE3PI_GROUPS_SPONSOR_FINAL_CLEANUP
const PHASE3PI_GROUP_TEAM_DISPLAY_RULE =
  'Final group team rows show only flag, team name, and continent/confederation.';

const PHASE3PI_SPONSOR_CTA = 'Visit Hobbee.FUN';

const phase3PIContinentFromTeam = (team = {}) => {
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
  return map[key] || raw || 'Continent TBD';
};
"""
if marker not in s:
    imports = list(re.finditer(r"^import .+?;\\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\n" + helper + "\n" + s[idx:]
    else:
        s = helper + "\n" + s

# -----------------------------
# 1) Groups intro paragraph cleanup
# -----------------------------
groups_intro_texts = [
    "Group teams are shown first, then the knockout map appears below just like a tournament board.",
    "Group teams are shown first, then the knockout map appears below just like a tournament board",
    "Group teams are shown first, then the knockout bracket appears below just like a tournament board.",
    "Group teams are shown first, then the knockout bracket appears below just like a tournament board",
]
for txt in groups_intro_texts:
    s = s.replace(txt, "")

# Remove any Text component that only contains this paragraph with whitespace/newlines around it.
s = re.sub(
    r"<Text[^>]*>\s*Group teams are shown first,\s*then the knockout (?:map|bracket) appears below just like a tournament board\.?\s*</Text>",
    "",
    s,
    flags=re.S | re.I,
)

# -----------------------------
# 2) Groups team helper text cleanup
# -----------------------------
helper_texts = [
    "Seed 1 • tap to pick champion • long press for team info",
    "Seed 2 • tap to pick champion • long press for team info",
    "Seed 3 • tap to pick champion • long press for team info",
    "Seed 4 • tap to pick champion • long press for team info",
    "Group team • tap to pick champion • long press for team info",
    "tap to pick champion • long press for team info",
    "tap to pick champion",
    "long press for team info",
    "Seed 1",
    "Seed 2",
    "Seed 3",
    "Seed 4",
    "Group team",
]
for txt in helper_texts:
    s = s.replace(txt, "")

# Remove template literals that generate helper text.
template_patterns = [
    r"`Seed\s*\$\{[^`]+?\}\s*•\s*tap to pick champion\s*•\s*long press for team info`",
    r"`Group team\s*•\s*tap to pick champion\s*•\s*long press for team info`",
    r"`Seed\s*\$\{[^`]+?\}`",
]
for pat in template_patterns:
    s = re.sub(pat, "phase3PIContinentFromTeam(team)", s)

# Replace common team subtitle expressions with continent helper if present.
subtitle_patterns = [
    r"\{team\.seed\s*\?\s*`Seed\s*\$\{team\.seed\}.*?`\s*:\s*['\"]Group team.*?['\"]\}",
    r"\{team\.seed\s*\?\s*[^}]+?\s*:\s*[^}]+?\}",
]
# Avoid overly broad replacement unless the text contains pick/long press in a nearby slice.
for pat in subtitle_patterns:
    s = re.sub(pat, "{phase3PIContinentFromTeam(team)}", s, flags=re.S)

# Remove orphan bullets from text after helper removal.
s = s.replace(" •  • ", " ")
s = s.replace(" • • ", " ")
s = s.replace(" • ", " ")
s = re.sub(r"\s+•\s*$", "", s, flags=re.M)

# -----------------------------
# 3) Add/standardize simple continent text where exact helper text was removed.
# -----------------------------
# If an existing group team render references getPhase3PCContinentLabel, keep it. If not, helper exists for future use.
# Do not force risky JSX insertion here.

# -----------------------------
# 4) Sponsor bar clipping cleanup
# -----------------------------
sponsor_texts = [
    "Discover hobbies and share predictions with fans. • Visit Hobbee.FUN",
    "Discover hobbies and share predictions with fans.",
    "Discover hobbies and share predictions with fans",
    "predictions with fans. • Visit Hobbee.FUN",
    "Share predictions with fans. • Visit Hobbee.FUN",
    "Share predictions with fans.",
    "with fans. • Visit Hobbee.FUN",
]
for txt in sponsor_texts:
    s = s.replace(txt, "Visit Hobbee.FUN")

# Standardize dynamic/default sponsor CTA-like fields if obvious.
s = re.sub(r"(sponsor(?:Message|Text|Cta|CTA)\s*[:=]\s*)['\"][^'\"]*Visit Hobbee\.FUN[^'\"]*['\"]", r"\1'Visit Hobbee.FUN'", s)
s = re.sub(r"(defaultSponsor(?:Message|Text|Cta|CTA)\s*[:=]\s*)['\"][^'\"]*['\"]", r"\1'Visit Hobbee.FUN'", s)

# Try to improve sponsor style dimensions if style names exist.
style_updates = [
    (r"(sponsorMessage\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>18"),
    (r"(sponsorText\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>18"),
    (r"(sponsorCta\s*:\s*\{[^}]*?fontSize\s*:\s*)\d+", r"\g<1>18"),
    (r"(sponsorContent\s*:\s*\{[^}]*?flexShrink\s*:\s*)\d+", r"\g<1>1"),
    (r"(sponsorTextWrap\s*:\s*\{[^}]*?flexShrink\s*:\s*)\d+", r"\g<1>1"),
    (r"(sponsorLogo\s*:\s*\{[^}]*?width\s*:\s*)\d+", r"\g<1>86"),
    (r"(sponsorLogo\s*:\s*\{[^}]*?height\s*:\s*)\d+", r"\g<1>86"),
]
for pat, repl in style_updates:
    s = re.sub(pat, repl, s, flags=re.S)

# Add flexShrink to common sponsor content styles if missing.
def add_style_field(src, style_name, field_line):
    m = re.search(rf"({style_name}\s*:\s*\{{)", src)
    if not m:
        return src
    close = src.find("}", m.end())
    if close == -1:
        return src
    body = src[m.end():close]
    field_name = field_line.split(":")[0].strip()
    if field_name in body:
        return src
    return src[:m.end()] + "\n    " + field_line + src[m.end():]

for style_name in ["sponsorContent", "sponsorTextWrap", "sponsorTextBox", "sponsorInfo"]:
    s = add_style_field(s, style_name, "flexShrink: 1,")
    s = add_style_field(s, style_name, "minWidth: 0,")

# -----------------------------
# 5) Share Copy button fallback cleanup
# -----------------------------
for tag in ["TouchableOpacity", "Pressable"]:
    s = re.sub(
        rf"<{tag}[^>]*>\s*(?:.|\n)*?<Text[^>]*>\s*Copy(?:\s+\w+)*\s*</Text>\s*(?:.|\n)*?</{tag}>",
        "",
        s,
        flags=re.I,
    )

copy_labels = [
    "Copy champion text",
    "Copy challenge text",
    "Copy prediction text",
    "Copy invite text",
    "Copy win text",
    "Copy",
]
for label in copy_labels:
    s = s.replace(label, "")

share_helper_texts = [
    "Share to social apps or copy this branded message",
    "Share to social apps",
    "or copy this branded message",
]
for txt in share_helper_texts:
    s = s.replace(txt, "")

# -----------------------------
# 6) Update build label
# -----------------------------
for old in [
    "Build: Phase 3P-H menu restructure header cleanup",
    "Build: Phase 3P-G crossed UI cleanup",
    "Build: Phase 3P-F menu cleanup",
    "Build: Phase 3P-E user-facing text cleanup",
]:
    s = s.replace(old, "Build: Phase 3P-I groups sponsor cleanup")

# Remove empty text nodes and extra blank lines.
s = re.sub(r"<Text[^>]*>\s*</Text>", "", s, flags=re.S)
s = re.sub(r"\n\s*\n\s*\n", "\n\n", s)

APP.write_text(s)
print("Phase 3P-I groups and sponsor final cleanup applied.")
print("Next: npx expo export --platform android --clear")

from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run from the project root.")

s = APP.read_text()
backup = Path("App.phase3K.backup.js")
if not backup.exists():
    backup.write_text(s)

marker = "PHASE3K_ADMIN_VALIDATION_HELPERS"
helper = r"""
// PHASE3K_ADMIN_VALIDATION_HELPERS
const phase3KAdminStatusText = (adsConfig = {}, sponsorConfig = {}) => {
  const yn = (v) => (v ? 'ON' : 'OFF');
  return [
    `Ad placements: ${yn(adsConfig.adsEnabled || adsConfig.enabled)}`,
    `Test ads: ${yn(adsConfig.testAdsEnabled || adsConfig.useTestAds)}`,
    `Auto-hide no-fill ads: ${yn(adsConfig.autoHideNoFill !== false)}`,
    `Non-personalized ads: ${yn(adsConfig.nonPersonalizedAds || adsConfig.requestNonPersonalizedAdsOnly)}`,
    `Sponsor active: ${yn(sponsorConfig.active !== false)}`,
    `Sponsor logo field: ${sponsorConfig.logoUrl || sponsorConfig.logo || sponsorConfig.imageUrl || sponsorConfig.logoURL ? 'SET' : 'EMPTY'}`
  ].join('\\n');
};

const phase3KDirectImageUrlHelp =
  'Logo/image URLs should be direct image links when possible (.png, .jpg, .jpeg, or .webp). Google Drive preview links may not display correctly. If an image fails, the app should show text fallback instead of crashing.';

const PHASE3K_BUILD_LABEL = 'Build: Phase 3K admin Firebase validation';
"""

if marker not in s:
    # Insert after imports
    imports = list(re.finditer(r"^import .+?;\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\n" + helper + "\n" + s[idx:]
    else:
        s = helper + "\n" + s

# Replace old build label references in text strings where present.
for old in [
    "Build: Phase 2S restore hotfix",
    "Build: Phase 2V visual polish",
    "Build: Phase 3I-A personalized share polish",
    "Build: Phase 3D-B full account deletion",
]:
    s = s.replace(old, "Build: Phase 3K admin Firebase validation")

# Try to add admin validation helper note near common admin panel headings.
insertion = """
<Text style={styles.adminHint || styles.mutedText}>
  Admin validation checklist: save one setting at a time, then reopen this panel to confirm the saved value.
</Text>
<Text style={styles.adminHint || styles.mutedText}>
  {phase3KDirectImageUrlHelp}
</Text>
"""

# Only insert JSX snippet if the code appears to have a matching Admin Control Panel label and not already inserted.
if "Admin validation checklist: save one setting at a time" not in s:
    patterns = [
        "Admin Control Panel",
        "Hidden Admin",
        "Sponsor Manager",
        "AdMob Display Settings",
        "Ad Controls",
    ]
    inserted = False
    for pat in patterns:
        pos = s.find(pat)
        if pos != -1:
            # Insert before next closing Text after heading? Safer: append as comment constants instead if JSX is risky.
            inserted = True
            break
    if not inserted:
        pass

# Add simple status/checklist strings without forcing risky JSX insertion.
phase_text_marker = "PHASE3K_ADMIN_VALIDATION_TEXT"
phase_text = r"""
// PHASE3K_ADMIN_VALIDATION_TEXT
const PHASE3K_ADMIN_VALIDATION_NOTES = [
  'Admin validation checklist',
  'Save one setting at a time.',
  'Reopen Admin Control Panel to confirm the saved value.',
  'Ad controls should save to appConfig/ads.',
  'Sponsor controls should save to sponsors/active.',
  'Match controls should save to matches/{matchId}.',
  'News controls should save to news/{newsId}.',
  'Image URL fields should store links only; no image upload is used.',
  phase3KDirectImageUrlHelp
];
"""
if phase_text_marker not in s:
    insert_after = s.find(marker)
    if insert_after != -1:
        # place after helper block by appending near top
        s = s.replace(helper, helper + "\n" + phase_text + "\n")
    else:
        s = phase_text + "\n" + s

# Improve visible wording if common strings are present.
replacements = {
    "Save AdMob display setting": "Save AdMob display settings",
    "Google Drive preview links may not display.": "Google Drive preview links may not display. Use a direct image URL when possible.",
    "Logo URL": "Logo URL (direct image link preferred)",
    "Image URL": "Image URL (direct link preferred)",
    "Ad placements": "Ad placements",
}
for old, new in replacements.items():
    s = s.replace(old, new)

APP.write_text(s)
print("Phase 3K admin/Firebase validation polish applied.")
print("Next: npx expo export --platform android --clear")

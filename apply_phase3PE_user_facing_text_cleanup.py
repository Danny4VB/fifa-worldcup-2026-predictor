from pathlib import Path
import re

APP = Path("App.js")
if not APP.exists():
    raise SystemExit("App.js not found. Run this script from the project root.")

s = APP.read_text()
backup = Path("App.phase3PE.backup.js")
if not backup.exists():
    backup.write_text(s)

marker = "PHASE3PE_USER_FACING_TEXT_CLEANUP"
helper = """
// PHASE3PE_USER_FACING_TEXT_CLEANUP
// Final user-facing screens should not show developer/testing/internal cost-control notes.
"""

if marker not in s:
    imports = list(re.finditer(r"^import .+?;\\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\\n" + helper + "\\n" + s[idx:]
    else:
        s = helper + "\\n" + s

# Remove visible build labels from user-facing text strings.
build_label_patterns = [
    r"Build:\s*Phase [^'\"`\\n]+",
    r"Build: Phase 3P-D full knockout bracket foundation",
    r"Build: Phase 3P-C groups team card cleanup",
    r"Build: Phase 3P-B final share text polish",
    r"Build: Phase 3P-A header layout polish",
    r"Build: Phase 3O production update prep",
    r"Build: Phase 3N release QA diagnostics",
    r"Build: Phase 3K admin Firebase validation",
    r"Build: Phase 2S restore hotfix",
]
for pat in build_label_patterns:
    s = re.sub(pat, "", s)

# Remove/replace internal user-facing helper text.
text_replacements = {
    "Cost-controlled leaderboard view. The app loads a limited page first, then users can load more.": "",
    "Cost-controlled leaderboard view.": "",
    "The app loads a limited page first, then users can load more.": "",
    "Leaderboard loads top 25 first to control Firebase reads. Use Load more for additional predictors.": "",
    "Firebase cost control": "",
    "Firebase Cost Control": "",
    "Admin validation checklist: save one setting at a time, then reopen this panel to confirm the saved value.": "",
    "Admin validation checklist": "",
    "Save one setting at a time.": "",
    "Reopen Admin Control Panel to confirm the saved value.": "",
    "Ad controls should save to appConfig/ads.": "",
    "Sponsor controls should save to sponsors/active.": "",
    "Match controls should save to matches/{matchId}.": "",
    "News controls should save to news/{newsId}.": "",
    "Image URL fields should store links only; no image upload is used.": "",
    "Image URL manager stores links only. It does not upload files, so there is no Firebase Storage cost.": "",
    "Exact score = 50 points": "",
    "Correct draw = 15 points": "",
    "Correct winner = 10 points": "",
    "Only show users with at least one scored result": "",
    "Load leaderboard in pages of 25 to control Firebase cost": "",
    "Admin match final score should trigger recalculation or manual scoring refresh": "",
    "Final team/player rosters may change before WorldCup 2026.": "",
    "Full bracket foundation added. Final winners advance from admin/Firebase results.": "",
    "A later visual pass can make the bracket closer to the full tournament diagram.": "",
    "Use a direct image URL when possible (.png, .jpg, .jpeg, or .webp). Google Drive preview links and regular webpage links may not display correctly.": "",
    "Google Drive preview links may not display. Use a direct image URL when possible.": "",
}

for old, new in text_replacements.items():
    s = s.replace(old, new)

# Clean common awkward blank text elements if exact JSX remnants exist.
s = re.sub(r"<Text[^>]*>\s*</Text>", "", s)
s = re.sub(r"\n\s*\n\s*\n", "\n\n", s)

# Replace overly technical labels with final-friendly labels.
label_replacements = {
    "Load more predictors": "Load more",
    "No scored predictors yet": "No predictors yet",
    "Image URL (direct image link preferred)": "Image URL",
    "Logo URL (direct image link preferred)": "Logo URL",
    "Save AdMob display settings": "Save ad settings",
    "Ad placements": "Ads",
    "Auto-hide no-fill ads": "Auto-hide empty ads",
    "Non-personalized ads": "Privacy-friendly ads",
}

for old, new in label_replacements.items():
    s = s.replace(old, new)

# Add final cleanup notes as internal constants only.
notes_marker = "PHASE3PE_FINAL_CLEANUP_NOTES"
notes = """
// PHASE3PE_FINAL_CLEANUP_NOTES
const PHASE3PE_FINAL_CLEANUP_NOTES = [
  'Remove developer/test-only notes from user-facing screens.',
  'Keep technical Firebase/cost-control notes in README/admin documentation only.',
  'Final Top tab should look like a public leaderboard, not a developer diagnostic screen.'
];
"""
if notes_marker not in s:
    s = s.replace(helper, helper + "\n" + notes + "\n")

APP.write_text(s)
print("Phase 3P-E user-facing text cleanup applied.")
print("Next: npx expo export --platform android --clear")

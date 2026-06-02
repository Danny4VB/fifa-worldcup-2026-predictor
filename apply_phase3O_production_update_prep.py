from pathlib import Path
import json
import re

APP = Path("App.js")
APP_JSON = Path("app.json")

if not APP.exists():
    raise SystemExit("App.js not found. Run from project root.")

s = APP.read_text()
backup = Path("App.phase3O.backup.js")
if not backup.exists():
    backup.write_text(s)

GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.virtualbeehive.fifaworldcup2026predictor"
s = s.replace("https://hobbee.fun/worldcup-predictor", GOOGLE_PLAY)
s = s.replace("Download or learn more:", "Download the app:")

for old in [
    "Build: Phase 3N release QA diagnostics",
    "Build: Phase 3M stadium team player structure",
    "Build: Phase 3L real leaderboard foundation",
    "Build: Phase 3K admin Firebase validation",
    "Build: Phase 3I-A personalized share polish",
]:
    s = s.replace(old, "Build: Phase 3O production update prep")

marker = "PHASE3O_PRODUCTION_UPDATE_PREP"
helper = f"""
// {marker}
const PHASE3O_VERSION_NAME = '1.0.1';
const PHASE3O_RELEASE_NOTES =
  'Improved match predictions, groups/bracket, sharing, sponsor controls, avatars, account tools, and leaderboard foundations.';
const PHASE3O_GOOGLE_PLAY_LINK = '{GOOGLE_PLAY}';
const PHASE3O_IOS_LINK_TODO = 'Add Apple App Store link after iOS app is built and published.';
"""

if marker not in s:
    imports = list(re.finditer(r"^import .+?;\s*$", s, flags=re.M))
    if imports:
        idx = imports[-1].end()
        s = s[:idx] + "\n" + helper + "\n" + s[idx:]
    else:
        s = helper + "\n" + s

APP.write_text(s)

if APP_JSON.exists():
    try:
        data = json.loads(APP_JSON.read_text())
        expo = data.get("expo", data)
        expo["version"] = "1.0.1"
        APP_JSON.write_text(json.dumps(data, indent=2) + "\n")
        print("Updated app.json version to 1.0.1.")
    except Exception as e:
        print(f"Could not update app.json automatically: {e}")
        print("Please manually set expo.version to 1.0.1.")

print("Phase 3O production update preparation applied.")
print("Next: npx expo export --platform android --clear")

# Phase 4H — Firebase Data Import System

## Purpose

This phase prepares the FIFA WorldCup 2026 Predictor app for verified football data without requiring frequent app rebuilds.

The importer uploads structured JSON data into Firebase collections:

- `teams_2026`
- `players_2026`
- `coaches_2026`
- `stadiums_2026`
- `jerseys_2026`
- `head_to_head_2026`

## Workflow

1. Update the JSON data files inside `/data`.
2. Validate data:

```bash
node scripts/validate_phase4H_data.js
node scripts/import_phase4H_data.js

---

## Step 3 — Validate syntax only

Run:

```bash
node -c scripts/import_phase4H_data.js
node scripts/validate_phase4H_data.js
git add scripts/import_phase4H_data.js PHASE4H_FIREBASE_DATA_IMPORT_README.md
git commit -m "Add Phase 4H Firebase data importer"
git push
git status
node -c scripts/import_phase4H_data.js
node -c scripts/import_phase4H_data.js

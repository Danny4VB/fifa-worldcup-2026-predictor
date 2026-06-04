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


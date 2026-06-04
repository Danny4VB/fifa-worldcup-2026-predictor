#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const checks = [
  { file: 'data/teams_2026_template.json', required: ['teamId', 'name', 'group', 'confederation'] },
  { file: 'data/players_2026_template.json', required: ['teamId', 'playerId', 'name', 'number', 'position'] },
  { file: 'data/coaches_2026_template.json', required: ['teamId', 'coachName'] },
  { file: 'data/stadiums_2026_seed.json', required: ['stadiumId', 'name', 'city', 'country'] },
  { file: 'data/jerseys_2026_template.json', required: ['teamId', 'home', 'away'] },
  { file: 'data/head_to_head_2026_template.json', required: ['matchKey', 'teamA', 'teamB', 'meetings'] },
];

let ok = true;

for (const check of checks) {
  const full = path.join(process.cwd(), check.file);
  if (!fs.existsSync(full)) {
    console.error(`[missing] ${check.file}`);
    ok = false;
    continue;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (e) {
    console.error(`[invalid json] ${check.file}: ${e.message}`);
    ok = false;
    continue;
  }

  if (!Array.isArray(data)) {
    console.error(`[invalid shape] ${check.file}: expected array`);
    ok = false;
    continue;
  }

  data.forEach((row, index) => {
    for (const key of check.required) {
      if (!(key in row)) {
        console.error(`[missing key] ${check.file}[${index}].${key}`);
        ok = false;
      }
    }
  });

  console.log(`[ok] ${check.file}: ${data.length} records`);
}

if (!ok) {
  process.exit(1);
}

console.log('Phase 4H data validation passed.');

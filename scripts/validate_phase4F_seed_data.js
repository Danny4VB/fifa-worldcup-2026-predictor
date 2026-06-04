#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const files = [
  'data/stadiums_2026_seed.json',
  'data/teams_2026_template.json',
  'data/players_2026_template.json',
  'data/jerseys_2026_template.json'
];

let ok = true;

for (const file of files) {
  const full = path.join(process.cwd(), file);
  if (!fs.existsSync(full)) {
    console.log(`[missing] ${file}`);
    ok = false;
    continue;
  }
  try {
    const data = JSON.parse(fs.readFileSync(full, 'utf8'));
    if (!Array.isArray(data)) {
      console.log(`[invalid] ${file}: expected array`);
      ok = false;
    } else {
      console.log(`[ok] ${file}: ${data.length} records`);
    }
  } catch (e) {
    console.log(`[invalid] ${file}: ${e.message}`);
    ok = false;
  }
}

if (!ok) process.exit(1);
console.log('Phase 4F seed data validation passed.');

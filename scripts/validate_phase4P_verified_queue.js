#!/usr/bin/env node

const fs = require('fs');

const file = 'data/verified/phase4P_verified_data_queue.json';

if (!fs.existsSync(file)) {
  console.error(`[missing] ${file}`);
  process.exit(1);
}

let rows;
try {
  rows = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (error) {
  console.error(`[invalid json] ${file}: ${error.message}`);
  process.exit(1);
}

if (!Array.isArray(rows)) {
  console.error(`[invalid shape] ${file}: expected array`);
  process.exit(1);
}

const required = ['type', 'priority', 'status', 'neededFields', 'notes'];
let ok = true;

rows.forEach((row, index) => {
  for (const key of required) {
    if (!(key in row)) {
      console.error(`[missing key] row ${index}.${key}`);
      ok = false;
    }
  }

  if (!Array.isArray(row.neededFields)) {
    console.error(`[invalid neededFields] row ${index}: expected array`);
    ok = false;
  }
});

if (!ok) {
  process.exit(1);
}

console.log(`[ok] ${file}: ${rows.length} verification tasks`);
console.log('Phase 4P verified data queue validation passed.');

#!/usr/bin/env node

const fs = require('fs');

const file = 'data/verified/head_to_head_mexico_usa.json';

if (!fs.existsSync(file)) {
  console.error(`[missing] ${file}`);
  process.exit(1);
}

const row = JSON.parse(fs.readFileSync(file, 'utf8'));

const required = [
  'type',
  'matchKey',
  'teamA',
  'teamB',
  'teamAWins',
  'teamBWins',
  'draws',
  'totalMeetings',
  'historySummary',
  'previousMeetings',
  'sourceUrl',
  'status',
  'lastVerified'
];

let ok = true;

for (const key of required) {
  if (!(key in row)) {
    console.error(`[missing] ${key}`);
    ok = false;
  }
}

if (!Array.isArray(row.previousMeetings)) {
  console.error('[invalid] previousMeetings must be an array');
  ok = false;
}

if (row.teamAWins + row.teamBWins + row.draws !== row.totalMeetings) {
  console.error('[invalid] wins + draws must equal totalMeetings');
  ok = false;
}

if (!ok) {
  process.exit(1);
}

console.log(`[ok] ${file}`);
console.log('Phase 4P-B Mexico vs USA head-to-head sample validation passed.');

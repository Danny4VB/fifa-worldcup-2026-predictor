#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function readJson(relativePath) {
  const full = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(full)) {
    console.log(`[skip] Missing ${relativePath}`);
    return [];
  }
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

function nowIso() {
  return new Date().toISOString();
}

function cleanId(value, fallback) {
  return String(value || fallback || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

async function batchSet(collectionName, items, idField) {
  if (!items.length) {
    console.log(`[skip] No records for ${collectionName}`);
    return;
  }

  const db = admin.firestore();
  let batch = db.batch();
  let count = 0;
  let batchCount = 0;

  for (const item of items) {
    const id = cleanId(item[idField], item.name || item.teamName || item.playerId);
    if (!id) continue;

    const ref = db.collection(collectionName).doc(id);
    batch.set(ref, { ...item, updatedAt: item.updatedAt || nowIso() }, { merge: true });
    count++;
    batchCount++;

    if (batchCount >= 400) {
      await batch.commit();
      console.log(`[write] ${collectionName}: committed ${count} records so far`);
      batch = db.batch();
      batchCount = 0;
    }
  }

  if (batchCount > 0) await batch.commit();
  console.log(`[done] ${collectionName}: ${count} records imported/merged`);
}

async function main() {
  if (!admin.apps.length) {
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || undefined });
  }

  await batchSet('stadiums_2026', readJson('data/stadiums_2026_seed.json'), 'stadiumId');
  await batchSet('teams_2026', readJson('data/teams_2026_template.json'), 'teamId');
  await batchSet('players_2026', readJson('data/players_2026_template.json'), 'playerId');
  await batchSet('jerseys_2026', readJson('data/jerseys_2026_template.json'), 'teamId');

  console.log('Phase 4F data import complete.');
}

main().catch((error) => {
  console.error('Phase 4F import failed:', error);
  process.exit(1);
});

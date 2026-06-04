#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function readJson(filePath) {
  const full = path.join(process.cwd(), filePath);
  if (!fs.existsSync(full)) {
    console.log(`[skip] ${filePath} not found`);
    return [];
  }

  const data = JSON.parse(fs.readFileSync(full, 'utf8'));
  if (!Array.isArray(data)) {
    throw new Error(`${filePath} must contain a JSON array`);
  }

  return data;
}

function cleanId(value, fallback = 'unknown') {
  return String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120) || fallback;
}

async function writeCollection(db, collectionName, rows, idGetter) {
  if (!rows.length) {
    console.log(`[skip] ${collectionName}: no records`);
    return;
  }

  let batch = db.batch();
  let count = 0;
  let batchCount = 0;

  for (const row of rows) {
    const id = cleanId(idGetter(row));
    const ref = db.collection(collectionName).doc(id);

    batch.set(ref, {
      ...row,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    count++;
    batchCount++;

    if (batchCount >= 400) {
      await batch.commit();
      batch = db.batch();
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`[ok] ${collectionName}: imported ${count} records`);
}

async function main() {
  const serviceAccountPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.FIREBASE_SERVICE_ACCOUNT ||
    '';

  if (serviceAccountPath) {
    const serviceAccount = require(path.resolve(serviceAccountPath));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    admin.initializeApp();
  }

  const db = admin.firestore();

  const teams = readJson('data/teams_2026_template.json');
  const players = readJson('data/players_2026_template.json');
  const coaches = readJson('data/coaches_2026_template.json');
  const stadiums = readJson('data/stadiums_2026_seed.json');
  const jerseys = readJson('data/jerseys_2026_template.json');
  const headToHead = readJson('data/head_to_head_2026_template.json');

  await writeCollection(db, 'teams_2026', teams, (r) => r.teamId || r.name);
  await writeCollection(db, 'players_2026', players, (r) => r.playerId || `${r.teamId}_${r.name}`);
  await writeCollection(db, 'coaches_2026', coaches, (r) => r.teamId || r.coachName);
  await writeCollection(db, 'stadiums_2026', stadiums, (r) => r.stadiumId || r.name);
  await writeCollection(db, 'jerseys_2026', jerseys, (r) => r.teamId);
  await writeCollection(db, 'head_to_head_2026', headToHead, (r) => r.matchKey || `${r.teamA}_vs_${r.teamB}`);

  console.log('Phase 4H Firebase import complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

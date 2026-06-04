#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const sourceFile = path.join('data', 'verified', 'head_to_head_mexico_usa.json');

if (!fs.existsSync(sourceFile)) {
  console.error(`[missing] ${sourceFile}`);
  process.exit(1);
}

const sample = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

const required = [
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

for (const key of required) {
  if (!(key in sample)) {
    console.error(`[missing] ${key}`);
    process.exit(1);
  }
}

async function main() {
  const firebase = require('firebase/app');
  const firestore = require('firebase/firestore');

  const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
  };

  if (!firebaseConfig.projectId) {
    console.error('[missing env] EXPO_PUBLIC_FIREBASE_PROJECT_ID');
    console.error('Firebase env variables are required before importing.');
    process.exit(1);
  }

  const app = firebase.initializeApp(firebaseConfig);
  const db = firestore.getFirestore(app);

  const payload = {
    ...sample,
    importedAt: new Date().toISOString(),
    importSource: sourceFile
  };

  await firestore.setDoc(
    firestore.doc(db, 'head_to_head_2026', sample.matchKey),
    payload,
    { merge: true }
  );

  console.log(`[ok] Imported ${sample.matchKey} into head_to_head_2026/${sample.matchKey}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

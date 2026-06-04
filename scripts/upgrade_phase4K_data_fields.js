#!/usr/bin/env node

const fs = require('fs');

function readJson(file) {
  if (!fs.existsSync(file)) {
    console.log(`[skip] Missing ${file}`);
    return [];
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`[ok] Updated ${file}`);
}

function upgradePlayers() {
  const file = 'data/players_2026_template.json';
  const rows = readJson(file);
  if (!rows.length) return;

  const upgraded = rows.map((p) => ({
    playerId: p.playerId || '',
    teamId: p.teamId || '',
    teamName: p.teamName || '',
    name: p.name || '',
    number: p.number ?? '',
    position: p.position || '',
    age: p.age ?? '',
    dateOfBirth: p.dateOfBirth || '',
    height: p.height || '',
    club: p.club || '',
    nationality: p.nationality || p.teamName || '',
    sourceUrl: p.sourceUrl || p.source || '',
    lastVerified: p.lastVerified || '',
    notes: p.notes || 'No player photo stored in this phase.'
  }));

  writeJson(file, upgraded);
}

function upgradeTeams() {
  const file = 'data/teams_2026_template.json';
  const rows = readJson(file);
  if (!rows.length) return;

  const upgraded = rows.map((t) => ({
    teamId: t.teamId || '',
    name: t.name || '',
    flag: t.flag || '',
    group: t.group || 'TBD',
    continent: t.continent || '',
    confederation: t.confederation || '',
    fifaCode: t.fifaCode || '',
    coachId: t.coachId || t.teamId || '',
    coachName: t.coachName || '',
    stadiumId: t.stadiumId || '',
    jerseyId: t.jerseyId || t.teamId || '',
    rosterStatus: t.rosterStatus || 'Pending verification',
    sourceUrl: t.sourceUrl || t.source || '',
    lastVerified: t.lastVerified || ''
  }));

  writeJson(file, upgraded);
}

function upgradeCoaches() {
  const file = 'data/coaches_2026_template.json';
  const rows = readJson(file);
  if (!rows.length) return;

  const upgraded = rows.map((c) => ({
    coachId: c.coachId || c.teamId || '',
    teamId: c.teamId || '',
    teamName: c.teamName || '',
    coachName: c.coachName || '',
    nationality: c.nationality || '',
    age: c.age ?? '',
    dateOfBirth: c.dateOfBirth || '',
    sourceUrl: c.sourceUrl || c.source || '',
    lastVerified: c.lastVerified || '',
    notes: c.notes || ''
  }));

  writeJson(file, upgraded);
}

function upgradeStadiums() {
  const file = 'data/stadiums_2026_seed.json';
  const rows = readJson(file);
  if (!rows.length) return;

  const upgraded = rows.map((s) => ({
    stadiumId: s.stadiumId || '',
    name: s.name || '',
    city: s.city || '',
    stateProvince: s.stateProvince || '',
    country: s.country || '',
    capacity: s.capacity || '',
    imageUrl: s.imageUrl || '',
    imageCredit: s.imageCredit || '',
    imageLicense: s.imageLicense || '',
    sourceUrl: s.sourceUrl || '',
    lastVerified: s.lastVerified || '',
    notes: s.notes || 'Use licensed/direct image URL only. No Firebase Storage upload in this phase.'
  }));

  writeJson(file, upgraded);
}

function upgradeJerseys() {
  const file = 'data/jerseys_2026_template.json';
  const rows = readJson(file);
  if (!rows.length) return;

  const upgraded = rows.map((j) => ({
    jerseyId: j.jerseyId || j.teamId || '',
    teamId: j.teamId || '',
    teamName: j.teamName || '',
    home: {
      primaryColor: j.home?.primaryColor || '',
      secondaryColor: j.home?.secondaryColor || '',
      accentColor: j.home?.accentColor || '',
      description: j.home?.description || '',
      imageUrl: j.home?.imageUrl || '',
      sourceUrl: j.home?.sourceUrl || '',
      imageCredit: j.home?.imageCredit || '',
      imageLicense: j.home?.imageLicense || ''
    },
    away: {
      primaryColor: j.away?.primaryColor || '',
      secondaryColor: j.away?.secondaryColor || '',
      accentColor: j.away?.accentColor || '',
      description: j.away?.description || '',
      imageUrl: j.away?.imageUrl || '',
      sourceUrl: j.away?.sourceUrl || '',
      imageCredit: j.away?.imageCredit || '',
      imageLicense: j.away?.imageLicense || ''
    },
    sourceUrl: j.sourceUrl || j.source || '',
    lastVerified: j.lastVerified || '',
    notes: j.notes || 'Use descriptive jersey data unless licensed image URLs are available.'
  }));

  writeJson(file, upgraded);
}

function upgradeHeadToHead() {
  const file = 'data/head_to_head_2026_template.json';
  const rows = readJson(file);
  if (!rows.length) return;

  const upgraded = rows.map((h) => ({
    matchKey: h.matchKey || '',
    teamA: h.teamA || '',
    teamB: h.teamB || '',
    meetings: Array.isArray(h.meetings) ? h.meetings : [],
    summary: h.summary || '',
    teamAWins: h.teamAWins ?? '',
    teamBWins: h.teamBWins ?? '',
    draws: h.draws ?? '',
    lastMeetingDate: h.lastMeetingDate || '',
    sourceUrl: h.sourceUrl || h.source || '',
    lastVerified: h.lastVerified || '',
    notes: h.notes || 'Use verified historical match source before publishing.'
  }));

  writeJson(file, upgraded);
}

upgradePlayers();
upgradeTeams();
upgradeCoaches();
upgradeStadiums();
upgradeJerseys();
upgradeHeadToHead();

console.log('Phase 4K-A data fields upgraded.');

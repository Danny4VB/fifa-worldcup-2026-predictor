
// PHASE4GA_MATCH_DETAILS_HISTORY_POLL
const PHASE4GA_MATCH_DETAILS_COLLECTION = 'matchDetails_2026';

const buildPhase4GADefaultMatchDetails = (match = {}) => ({
  matchId: String(match.id || match.matchId || match.matchNumber || ''),
  historySummary: 'Head-to-head history will update when verified match data is available.',
  previousMeetings: [],
  teamAPlayers: [],
  teamBPlayers: [],
  teamACoach: '',
  teamBCoach: '',
  fanPoll: {
    teamATopPlayerName: '',
    teamATopPlayerPercent: 0,
    teamBTopPlayerName: '',
    teamBTopPlayerPercent: 0,
    overallTopPlayerName: '',
    overallTopPlayerTeam: '',
  },
  updatedAt: new Date().toISOString(),
});

const getPhase4GAPlayerLabel = (player = {}) => {
  const number = player.number || player.jerseyNumber || '';
  const name = player.name || 'Player';
  const position = player.position || '';
  return `${number ? '#' + number + ' ' : ''}${name}${position ? ' — ' + position : ''}`;
};

const getPhase4GATopPlayerText = (details = {}) => {
  const poll = details.fanPoll || {};
  if (poll.overallTopPlayerName) {
    return `Fan top player: ${poll.overallTopPlayerName}${poll.overallTopPlayerTeam ? ' — ' + poll.overallTopPlayerTeam : ''}`;
  }
  return 'Fan top player voting will appear when player data is available.';
};

const PHASE4GA_HISTORY_EMPTY_TEXT =
  'Previous meetings will appear here when verified head-to-head data is available.';

const PHASE4GA_ROSTER_EMPTY_TEXT =
  'Player names, numbers, positions, and coaches will update when roster data is imported.';

const PHASE4GA_POLL_EMPTY_TEXT =
  'Fan best-player poll opens when match/player data is ready.';

const PHASE4GA_MATCH_DETAILS_NOTES = [
  'History and player poll data should come from Firebase cache, not direct sports API calls from user phones.',
  'Sports API/import scripts can populate matchDetails_2026 later.',
  'No player photos are used in this phase.',
  'No Firebase Storage is used in this phase.'
];

// PHASE4GA_MATCH_DETAILS_RENDER_HELPER
const buildPhase4GAMatchDetailsSections = (match = {}, details = null) => {
  const safeDetails = details || buildPhase4GADefaultMatchDetails(match);
  const previousMeetings = Array.isArray(safeDetails.previousMeetings) ? safeDetails.previousMeetings : [];
  const teamAPlayers = Array.isArray(safeDetails.teamAPlayers) ? safeDetails.teamAPlayers : [];
  const teamBPlayers = Array.isArray(safeDetails.teamBPlayers) ? safeDetails.teamBPlayers : [];
  return {
    historyTitle: 'History',
    historySummary: safeDetails.historySummary || PHASE4GA_HISTORY_EMPTY_TEXT,
    previousMeetings,
    lineupsTitle: 'Players & Coaches',
    teamACoach: safeDetails.teamACoach || 'Coach coming soon',
    teamBCoach: safeDetails.teamBCoach || 'Coach coming soon',
    teamAPlayers: teamAPlayers.map(getPhase4GAPlayerLabel),
    teamBPlayers: teamBPlayers.map(getPhase4GAPlayerLabel),
    rosterEmptyText: PHASE4GA_ROSTER_EMPTY_TEXT,
    pollTitle: 'Fan Player Poll',
    topSelectedPlayerText: getPhase4GATopPlayerText(safeDetails),
    pollEmptyText: PHASE4GA_POLL_EMPTY_TEXT,
  };
};

// PHASE4GA_VISIBLE_PLACEHOLDER can be manually placed in match detail JSX when ready.


// PHASE3PN_VISUAL_MEDIA_UPGRADE
const PHASE3PN_WORLD_CUP_START_ISO = '2026-06-11T13:00:00-06:00';

const phase3PNFormatCountdown = (targetIso = PHASE3PN_WORLD_CUP_START_ISO) => {
  const now = Date.now();
  const target = new Date(targetIso).getTime();
  const diff = Math.max(0, target - now);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    label: `${days}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M ${String(seconds).padStart(2, '0')}S`,
  };
};

const PHASE3PN_DEFAULT_MEDIA = {
  matchesHero: '',
  groupsHero: '',
  stadiumFallback: '',
  teamFallback: '',
  playerFallback: '',
  sponsorBanner: '',
};

const phase3PNResolveImageUrl = (...urls) =>
  urls.find((url) => typeof url === 'string' && url.trim().startsWith('http')) || '';

const PHASE3PN_MEDIA_RULES = [
  'Use large image holders to make the app feel more exciting.',
  'Keep media URL-only for now to avoid upload/storage cost.',
  'Admin can paste exact image URLs for stadiums, teams, players, coaches, and sponsor banners.',
  'Use fallback holders when an image URL is missing.',
];

// PHASE3PN_MEDIA_STYLE_HINTS
const PHASE3PN_MEDIA_STYLE_HINTS = {
  phase3PNMediaHero: {
    minHeight: 190,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 18,
  },
  phase3PNCountdownBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  phase3PNCountdownText: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
};

// PHASE3PN_VISIBLE_MEDIA_LABELS
const PHASE3PN_VISIBLE_MEDIA_LABELS = {
  countdownTitle: 'WorldCup starts in',
  matchesHeroTitle: 'WorldCup 2026 Countdown',
  groupsHeroTitle: 'Teams, groups, and road to the final',
  stadiumImageTitle: 'Stadium spotlight',
  teamImagesTitle: 'Team spotlight',
  adminMediaHint: 'Paste exact image URLs so stadium, team, player, and coach pictures do not get mixed.',
};

// PHASE3PM_ADMIN_MEDIA_MANAGER_URL_ONLY
// URL-only media foundation. No Firebase Storage upload is used in this phase.
const PHASE3PM_MEDIA_PATHS = {
  stadiums: 'media/stadiums',
  teams: 'media/teams',
  players: 'media/players',
  coaches: 'media/coaches',
};

const phase3PMNormalizeId = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const phase3PMIsLikelyImageUrl = (url = '') => {
  const clean = String(url || '').trim();
  if (!clean) return false;
  return /^https?:\/\//i.test(clean);
};

const phase3PMDirectImageHint =
  'Use a direct image URL for this exact stadium, team, coach, or player. Do not use the same image URL for unrelated records.';

const phase3PMBuildStadiumMediaId = (stadiumName = '', city = '') =>
  `stadium_${phase3PMNormalizeId(stadiumName || city || 'unknown')}`;

const phase3PMBuildTeamMediaId = (teamName = '') =>
  `team_${phase3PMNormalizeId(teamName || 'unknown')}`;

const phase3PMBuildPlayerMediaId = (teamName = '', jerseyNumber = '', playerName = '') =>
  `player_${phase3PMNormalizeId(teamName || 'team')}_${phase3PMNormalizeId(jerseyNumber || playerName || 'unknown')}`;

const phase3PMBuildCoachMediaId = (teamName = '', coachName = '') =>
  `coach_${phase3PMNormalizeId(teamName || coachName || 'unknown')}`;

const phase3PMMediaRecordExample = {
  stadium: {
    id: 'stadium_dallas',
    name: 'Dallas Stadium',
    imageUrl: '',
    credit: '',
    source: '',
  },
  player: {
    id: 'player_usa_10',
    teamId: 'team_usa',
    jerseyNumber: '10',
    name: '',
    photoUrl: '',
  },
};

const PHASE3PM_ADMIN_MEDIA_RULES = [
  'Use unique IDs for each stadium/team/player/coach.',
  'Paste only image URLs that belong to the exact record.',
  'Do not reuse Mexico City Stadium image for Texas/Dallas stadium.',
  'Do not reuse a USA player image for England or another team.',
  'Firebase Storage upload is intentionally not included in this phase to avoid storage cost.'
];

// PHASE3PM_ADMIN_MEDIA_LABELS
const PHASE3PM_ADMIN_MEDIA_LABELS = {
  stadiumImageUrl: 'Exact stadium image URL',
  teamImageUrl: 'Exact team image URL',
  playerPhotoUrl: 'Exact player photo URL',
  coachImageUrl: 'Exact coach image URL',
  flagImageUrl: 'Exact flag image URL',
};

// PHASE3PL_DIRECT_UI_STRUCTURE_CLEANUP
const PHASE3PL_MENU_SECTIONS = [
  'Account',
  'Settings',
  'Invite Friends',
  'Privacy & Account',
  'About This App',
  'Admin Control Panel'
];

const PHASE3PL_COMPANY_LINE =
  'FIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.';

const phase3PLFlagFallback = (team = {}) => {
  const name = String(team.name || team.team || team.teamName || '').toLowerCase();
  if (name.includes('england')) return '🏴 ENG';
  if (name.includes('scotland')) return '🏴 SCO';
  return team.flag || '';
};

const phase3PLContinentLabel = (team = {}) => {
  const raw = team.continent || team.confederation || team.region || team.zone || '';
  const key = String(raw).trim().toUpperCase();
  const map = {
    UEFA: 'Europe',
    CAF: 'Africa',
    AFC: 'Asia',
    CONCACAF: 'North America',
    CONMEBOL: 'South America',
    OFC: 'Oceania',
  };
  return map[key] || raw || '';
};

// PHASE3PI_GROUPS_SPONSOR_FINAL_CLEANUP
const PHASE3PI_GROUP_TEAM_DISPLAY_RULE =
  'Final group team rows show only flag, team name, and continent/confederation.';

const PHASE3PI_SPONSOR_CTA = 'Visit Hobbee.FUN';

const phase3PIContinentFromTeam = (team = {}) => {
  const raw = team.continent || team.confederation || team.region || team.zone || '';
  const key = String(raw).trim().toUpperCase();
  const map = {
    UEFA: 'Europe',
    CAF: 'Africa',
    AFC: 'Asia',
    CONCACAF: 'North America',
    CONMEBOL: 'South America',
    OFC: 'Oceania',
  };
  return map[key] || raw || '';
};

// PHASE3PH_MENU_RESTRUCTURE_HEADER_FINAL
const PHASE3PH_MENU_SECTIONS = [
  'Account',
  'Settings',
  'Invite Friends',
  'Privacy & Account',
  'About This App',
  'Admin Control Panel'
];

const PHASE3PH_ABOUT_APP_TEXT =
  'FIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.';

const PHASE3PH_MENU_RESTRUCTURE_RULES = [
  'Header shows app logo and app name only.',
  'Virtual Beehive Inc. appears in Menu/About, not top header.',
  'Main Menu shows high-level sections only.',
  'Account details belong inside Account.',
  'Notification and mood settings belong inside Settings.',
  'Privacy, Terms, and Delete Account belong inside Privacy & Account.',
  'Invite Friends uses one Share button only.'
];

// PHASE3PF_MENU_CLEANUP
// Menu cleanup: remove confusing delete/copy/local-profile buttons from the public menu.
const PHASE3PF_MENU_RULES = [
  'Keep Menu simple.',
  'Keep Privacy Policy, Terms of Use, and Delete Account / Data.',
  'Remove  from visible menu.',
  'Remove  from visible menu unless debugging.',
  'Do not change sign-in/admin logic.'
];
// PHASE3PE_USER_FACING_TEXT_CLEANUP
// Final user-facing screens should not show developer/testing/internal cost-control notes.

// PHASE3PE_FINAL_CLEANUP_NOTES
const PHASE3PE_FINAL_CLEANUP_NOTES = [
  'Remove developer/test-only notes from user-facing screens.',
  'Keep technical Firebase/cost-control notes in README/admin documentation only.',
  'Final Top tab should look like a public leaderboard, not a developer diagnostic screen.'
];

// PHASE3PD_FULL_KNOCKOUT_BRACKET
const PHASE3PD_BRACKET_ROUNDS = [
  'Round of 32',
  'Round of 16',
  'Quarter-finals',
  'Semi-finals',
  'Final'
];

const PHASE3PD_BRACKET_NOTE =
  'Bracket should scroll horizontally in portrait mode and advance winners from Firebase/admin match results.';

const getPhase3PDMatchWinner = (match = {}) => {
  const status = String(match.status || '').toLowerCase();
  if (status !== 'final' && status !== 'finished') return '';

  const a = Number(match.teamAScore ?? match.homeScore ?? match.scoreA);
  const b = Number(match.teamBScore ?? match.awayScore ?? match.scoreB);
  if (Number.isNaN(a) || Number.isNaN(b) || a === b) return '';

  return a > b
    ? (match.teamA || match.homeTeam || match.teamAName || 'Winner A')
    : (match.teamB || match.awayTeam || match.teamBName || 'Winner B');
};

const buildPhase3PDBracketSlot = ({ id, label, teamA, teamB, winner, matchId, source = 'manual/admin' } = {}) => ({
  id,
  label,
  teamA: teamA || 'TBD',
  teamB: teamB || 'TBD',
  winner: winner || '',
  matchId: matchId || '',
  source,
});

const buildPhase3PDBracketFoundation = (matches = []) => {
  const roundOf32 = matches
    .filter((m) => String(m.round || m.stage || '').toLowerCase().includes('32') || Number(m.matchNumber || m.id || 0) >= 73)
    .slice(0, 16)
    .map((m, index) =>
      buildPhase3PDBracketSlot({
        id: `r32-${index + 1}`,
        label: m.label || `M${m.matchNumber || index + 73}`,
        teamA: m.teamA || m.homeTeam || m.teamAName,
        teamB: m.teamB || m.awayTeam || m.teamBName,
        winner: getPhase3PDMatchWinner(m),
        matchId: m.id || m.matchId || String(m.matchNumber || ''),
      })
    );

  return {
    roundOf32,
    roundOf16: Array.from({ length: 8 }, (_, i) => buildPhase3PDBracketSlot({ id: `r16-${i + 1}`, label: `Winner R32-${i * 2 + 1} vs Winner R32-${i * 2 + 2}` })),
    quarterFinals: Array.from({ length: 4 }, (_, i) => buildPhase3PDBracketSlot({ id: `qf-${i + 1}`, label: `Winner R16-${i * 2 + 1} vs Winner R16-${i * 2 + 2}` })),
    semiFinals: Array.from({ length: 2 }, (_, i) => buildPhase3PDBracketSlot({ id: `sf-${i + 1}`, label: `Winner QF-${i * 2 + 1} vs Winner QF-${i * 2 + 2}` })),
    final: [buildPhase3PDBracketSlot({ id: 'final', label: 'Winner SF Left vs Winner SF Right' })],
  };
};

const PHASE3PD_BRACKET_DISPLAY_RULES = [
  'Use a dedicated bracket section/screen.',
  'Keep phone portrait mode.',
  'Bracket area can scroll horizontally.',
  'Round labels: Round of 32, Round of 16, Quarter-finals, Semi-finals, Final.',
  'Advance winners from admin/Firebase match results first.',
  'Live-score API can be added later after cost review.'
];

// PHASE3PD_BRACKET_STYLE_HINTS
const PHASE3PD_BRACKET_STYLE_HINTS = {
  bracketMinWidth: 1400,
  bracketCardWidth: 150,
  bracketCardHeight: 58,
  bracketRoundGap: 24,
  bracketCardGap: 10,
};

// PHASE3PC_GROUPS_TEAM_CLEANUP
const PHASE3PC_CONFEDERATION_LABELS = {
  UEFA: 'Europe',
  CAF: 'Africa',
  AFC: 'Asia',
  CONCACAF: 'North America',
  CONMEBOL: 'South America',
  OFC: 'Oceania',
};

const getPhase3PCContinentLabel = (team = {}) => {
  const raw =
    team.continent ||
    team.confederation ||
    team.region ||
    team.zone ||
    '';
  const key = String(raw).trim().toUpperCase();
  return PHASE3PC_CONFEDERATION_LABELS[key] || raw || 'Continent TBD';
};

const buildPhase3PCGroupTeamLine = (team = {}) => ({
  flag: team.flag || '',
  name: team.name || team.team || 'Team TBD',
  continent: getPhase3PCContinentLabel(team),
});

const PHASE3PC_GROUPS_DISPLAY_RULE =
  'Groups tab team cards should show only flag, team name, and continent/confederation.';

// PHASE3PC_BRACKET_NEXT_STEP_NOTES
const PHASE3PC_BRACKET_NEXT_STEP_NOTES = [
  'Full bracket redesign should be handled separately.',
  'Recommended next phase: Phase 3P-D full knockout bracket diagram.',
  'Bracket may need a dedicated landscape-style screen or horizontal scroll.',
  'Round of 32/16/quarter/semi/final should be generated from match results/admin data later.'
];

// PHASE3PB_FINAL_SHARE_TEXT
const PHASE3PB_SHARE_LINK = 'https://play.google.com/store/apps/details?id=com.virtualbeehive.fifaworldcup2026predictor';
const PHASE3PB_HASHTAGS = '#WorldCup2026 #Soccer #HobbeeFUN #DiscoverFUN';

const getPhase3PBShareAvatar = (profile) =>
  profile?.avatar || profile?.avatarEmoji || profile?.selectedAvatar || '⚽';

const getPhase3PBShareName = (profile, user) =>
  profile?.nickname ||
  profile?.name ||
  user?.displayName ||
  user?.email?.split?.('@')?.[0] ||
  'A WorldCup fan';

const buildPhase3PBMatchPredictionText = ({ profile, user, teamA, teamB, flagA = '', flagB = '', scoreA = '', scoreB = '' } = {}) => {
  const avatar = getPhase3PBShareAvatar(profile);
  const name = getPhase3PBShareName(profile, user);
  const left = `${flagA ? flagA + ' ' : ''}${teamA || 'Team A'}`.trim();
  const right = `${flagB ? flagB + ' ' : ''}${teamB || 'Team B'}`.trim();
  return `${avatar} ${name} predicted:\n\n${left} ${scoreA} - ${scoreB} ${right}\n\nDo you agree, or do you think the result will be different?\n\nDownload the app and predict all WorldCup 2026 matches:\n${PHASE3PB_SHARE_LINK}\n\nFIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.\n\n${PHASE3PB_HASHTAGS}`;
};

const buildPhase3PBGenericChallengeText = ({ profile, user, subject = 'WorldCup 2026' } = {}) => {
  const avatar = getPhase3PBShareAvatar(profile);
  const name = getPhase3PBShareName(profile, user);
  return `${avatar} ${name} is challenging you on FIFA WorldCup 2026 Predictor.\n\nDo you agree with their picks, or do you think the results will be different?\n\nDownload the app and predict all WorldCup 2026 matches:\n${PHASE3PB_SHARE_LINK}\n\nFIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.\n\n${PHASE3PB_HASHTAGS}`;
};

const buildPhase3PBChampionChallengeText = ({ profile, user, champion = 'their champion pick' } = {}) => {
  const avatar = getPhase3PBShareAvatar(profile);
  const name = getPhase3PBShareName(profile, user);
  return `${avatar} ${name} predicted ${champion} will win WorldCup 2026.\n\nDo you agree, or do you think another team will win?\n\nDownload the app and predict all WorldCup 2026 matches:\n${PHASE3PB_SHARE_LINK}\n\nFIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.\n\n${PHASE3PB_HASHTAGS}`;
};
// PHASE3PA_HEADER_LAYOUT_POLISH
// Header visual polish only: taller header, larger app logo, more breathing room under phone status bar.

// PHASE3PA_HEADER_NOTES
const PHASE3PA_HEADER_NOTES = [
  'Header should feel taller and less crowded.',
  'Logo should be easier to see.',
  'Virtual Beehive Inc. and app title should be readable.',
  'Mood and menu icons should stay aligned.'
];

import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, BackHandler, Image, Linking, Modal, SafeAreaView, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, deleteUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, deleteDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import * as Clipboard from 'expo-clipboard';



// PHASE3PS_STADIUM_IMAGE_HELPERS
const phase3PSSlug = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const getPhase3PSStadiumDocIds = (team = '', details = {}) => {
  const candidates = [
    details.stadiumId,
    details.stadiumDocId,
    details.stadiumSlug,
    phase3PSSlug(details.stadium || ''),
    phase3PSSlug(team || ''),
    team,
  ].filter(Boolean);

  return [...new Set(candidates)];
};

const getPhase3PSImageFromDoc = (doc = {}) =>
  normalizeImageUrl(
    doc.stadiumImageUrl ||
    doc.imageUrl ||
    doc.url ||
    doc.photoUrl ||
    ''
  );


// PHASE4GB_FAN_POLL_HELPERS
const getPhase4GBFanPollTopText = (poll = {}, localSelected = '') => {
  if (poll && poll.overallTopPlayerName) {
    return `Highest fan-selected player: ${poll.overallTopPlayerName}${poll.overallTopPlayerTeam ? ' — ' + poll.overallTopPlayerTeam : ''}`;
  }
  if (localSelected) {
    return `Your selected fan best player: ${localSelected}`;
  }
  return 'Fan voting summary will appear when match player data is available.';
};


// PHASE3O_PRODUCTION_UPDATE_PREP
const PHASE3O_VERSION_NAME = '1.0.1';
const PHASE3O_RELEASE_NOTES =
  'Improved match predictions, groups/bracket, sharing, sponsor controls, avatars, account tools, and leaderboard foundations.';
const PHASE3O_GOOGLE_PLAY_LINK = 'https://fifa-worldcup-2026-predictor.web.app/app';
const PHASE3O_IOS_LINK_TODO = 'Add Apple App Store link after iOS app is built and published.';

// PHASE3N_RELEASE_QA_DIAGNOSTICS
const PHASE3N_APP_BUILD_LABEL = 'nockout bracket foundation';

const PHASE3N_QA_CHECKLIST = [
  'App opens without crash',
  'Menu opens without crash',
  'Sign-in wording is clean',
  'Admin panel opens for authorized admin',
  'Sponsor bar is readable and logo fallback works',
  'Ad controls save and apply from Firebase',
  'Share messages use the Google Play link',
  'Personalized share text includes avatar and nickname',
  'Avatar picker appears and saves',
  'Matches filters work',
  'Smart scroll / smart match order works',
  'Groups and knockout bracket show correctly',
  'Leaderboard opens and pagination foundation is ready',
  'News detail opens',
  'Privacy, Terms, and Delete Account links open',
  'Full delete helper opens but is not tested on admin account',
  'Settings appear',
  'Celebration/share win appears when prediction earns points',
  'No Google AdMob placeholder visible when ads are off',
];

const PHASE3N_RELEASE_NOTES_DRAFT =
  'Updated FIFA WorldCup 2026 Predictor with improved match browsing, groups and knockout bracket, admin sponsor controls, personalized sharing, avatar selection, account deletion support, and leaderboard/scoring foundations.';

const PHASE3N_GOOGLE_PLAY_LINK =
  'https://play.google.com/store/apps/details?id=com.virtualbeehive.fifaworldcup2026predictor';

const PHASE3N_IOS_LINK_TODO =
  'TODO: Add Apple App Store link after iOS app is built and published.';

const getPhase3NQaSummary = () => PHASE3N_QA_CHECKLIST.map((item, index) => `${index + 1}. ${item}`).join('\\n');

// PHASE3M_DATA_STRUCTURE_HELPERS
const PHASE3M_DIRECT_IMAGE_HELP =
  '';

const normalizePhase3MImageUrl = (value) => {
  if (!value || typeof value !== 'string') return '';
  const url = value.trim();

  // Basic Google Drive file link conversion attempt.
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
  }

  return url;
};

const getPhase3MImageUrl = (...values) => {
  const found = values.find((v) => typeof v === 'string' && v.trim().length > 0);
  return normalizePhase3MImageUrl(found || '');
};

const buildPhase3MStadiumRecord = ({
  name = '',
  city = '',
  state = '',
  country = '',
  capacity = '',
  ticketRange = '',
  imageUrl = '',
  sourceUrl = ''
} = {}) => ({
  name,
  city,
  state,
  country,
  capacity,
  ticketRange,
  imageUrl: normalizePhase3MImageUrl(imageUrl),
  sourceUrl,
  updatedAt: new Date().toISOString(),
});

const buildPhase3MTeamRecord = ({
  name = '',
  flag = '',
  group = '',
  description = '',
  homeJerseyUrl = '',
  awayJerseyUrl = '',
  coachName = '',
  coachImageUrl = '',
  sourceUrl = ''
} = {}) => ({
  name,
  flag,
  group,
  description,
  homeJerseyUrl: normalizePhase3MImageUrl(homeJerseyUrl),
  awayJerseyUrl: normalizePhase3MImageUrl(awayJerseyUrl),
  coachName,
  coachImageUrl: normalizePhase3MImageUrl(coachImageUrl),
  sourceUrl,
  updatedAt: new Date().toISOString(),
});

const buildPhase3MPlayerRecord = ({
  teamId = '',
  name = '',
  jerseyNumber = '',
  position = '',
  height = '',
  weight = '',
  languages = '',
  education = '',
  achievements = '',
  photoUrl = '',
  fullBodyImageUrl = '',
  sourceUrl = ''
} = {}) => ({
  teamId,
  name,
  jerseyNumber,
  position,
  height,
  weight,
  languages,
  education,
  achievements,
  photoUrl: normalizePhase3MImageUrl(photoUrl),
  fullBodyImageUrl: normalizePhase3MImageUrl(fullBodyImageUrl),
  sourceUrl,
  updatedAt: new Date().toISOString(),
});

const PHASE3M_ADMIN_IMAGE_FIELDS = [
  'stadium.imageUrl',
  'team.homeJerseyUrl',
  'team.awayJerseyUrl',
  'team.coachImageUrl',
  'player.photoUrl',
  'player.fullBodyImageUrl'
];

const PHASE3M_ADMIN_HELP_TEXT =
  '';

// PHASE3M_DATA_VALIDATION_NOTES
const PHASE3M_DATA_VALIDATION_NOTES = [
  'Exact stadium image URL should point to a direct image file.',
  'Coach and player images should only use reliable/permitted sources.',
  'No image upload is used in this phase.',
  'If an image fails, show text fallback instead of crashing.',
  ''
];

// PHASE3L_REAL_LEADERBOARD_HELPERS
const PHASE3L_LEADERBOARD_PAGE_SIZE = 25;

const PHASE3L_SCORE_RULES = {
  exactScore: 50,
  correctDraw: 15,
  correctWinner: 10,
};

const calculatePhase3LPrediction = (prediction, match) => {
  if (!prediction || !match) return 0;

  const status = String(match.status || '').toLowerCase();
  if (status !== 'final' && status !== 'finished') return 0;

  const predA = Number(prediction.teamAScore ?? prediction.homeScore ?? prediction.scoreA);
  const predB = Number(prediction.teamBScore ?? prediction.awayScore ?? prediction.scoreB);
  const actualA = Number(match.teamAScore ?? match.homeScore ?? match.scoreA);
  const actualB = Number(match.teamBScore ?? match.awayScore ?? match.scoreB);

  if ([predA, predB, actualA, actualB].some((n) => Number.isNaN(n))) return 0;

  if (predA === actualA && predB === actualB) {
    return PHASE3L_SCORE_RULES.exactScore;
  }

  const predDiff = predA - predB;
  const actualDiff = actualA - actualB;

  if (predDiff === 0 && actualDiff === 0) {
    return PHASE3L_SCORE_RULES.correctDraw;
  }

  if ((predDiff > 0 && actualDiff > 0) || (predDiff < 0 && actualDiff < 0)) {
    return PHASE3L_SCORE_RULES.correctWinner;
  }

  return 0;
};

const getPhase3LScoreType = (prediction, match) => {
  if (!prediction || !match) return 'none';

  const predA = Number(prediction.teamAScore ?? prediction.homeScore ?? prediction.scoreA);
  const predB = Number(prediction.teamBScore ?? prediction.awayScore ?? prediction.scoreB);
  const actualA = Number(match.teamAScore ?? match.homeScore ?? match.scoreA);
  const actualB = Number(match.teamBScore ?? match.awayScore ?? match.scoreB);

  if ([predA, predB, actualA, actualB].some((n) => Number.isNaN(n))) return 'none';

  if (predA === actualA && predB === actualB) return 'exactScore';

  const predDiff = predA - predB;
  const actualDiff = actualA - actualB;

  if (predDiff === 0 && actualDiff === 0) return 'correctDraw';
  if ((predDiff > 0 && actualDiff > 0) || (predDiff < 0 && actualDiff < 0)) return 'correctWinner';

  return 'none';
};

const buildPhase3LLeaderboardRecord = ({ userId, profile = {}, totals = {} }) => ({
  userId,
  nickname: profile.nickname || profile.name || 'WorldCup fan',
  avatar: profile.avatar || profile.avatarEmoji || profile.selectedAvatar || '⚽',
  country: profile.country || '',
  points: Number(totals.points || 0),
  exactScores: Number(totals.exactScores || 0),
  correctWinners: Number(totals.correctWinners || 0),
  correctDraws: Number(totals.correctDraws || 0),
  matchesScored: Number(totals.matchesScored || 0),
  updatedAt: new Date().toISOString(),
});

const PHASE3L_LEADERBOARD_HELP_TEXT =
  'Leaderboard loads top 25 first to control Firebase reads. Use Load more for additional predictors.';

// PHASE3K_ADMIN_VALIDATION_HELPERS
const phase3KAdminStatusText = (adsConfig = {}, sponsorConfig = {}) => {
  const yn = (v) => (v ? 'ON' : 'OFF');
  return [
    `Ads: ${yn(adsConfig.adsEnabled || adsConfig.enabled)}`,
    `Test ads: ${yn(adsConfig.testAdsEnabled || adsConfig.useTestAds)}`,
    `Auto-hide empty ads: ${yn(adsConfig.autoHideNoFill !== false)}`,
    `Privacy-friendly ads: ${yn(adsConfig.nonPersonalizedAds || adsConfig.requestNonPersonalizedAdsOnly)}`,
    `Sponsor active: ${yn(sponsorConfig.active !== false)}`,
    `Sponsor logo field: ${sponsorConfig.logoUrl || sponsorConfig.logo || sponsorConfig.imageUrl || sponsorConfig.logoURL ? 'SET' : 'EMPTY'}`
  ].join('\\n');
};

const phase3KDirectImageUrlHelp =
  'Logo/image URLs should be direct image links when possible (.png, .jpg, .jpeg, or .webp). Google Drive preview links may not display correctly. If an image fails, the app should show text fallback instead of crashing.';

const PHASE3K_BUILD_LABEL = 'nockout bracket foundation';

// PHASE3K_ADMIN_VALIDATION_TEXT
const PHASE3K_ADMIN_VALIDATION_NOTES = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'Image URL fields should store links only; no image upload is used.',
  phase3KDirectImageUrlHelp
];

// PHASE3IA_PERSONALIZED_SHARE_HELPERS

const getPhase3IAShareAvatar = (profile) => {
  return profile?.avatar || profile?.avatarEmoji || profile?.selectedAvatar || '⚽';
};

const getPhase3IAShareName = (profile, user) => {
  return (
    profile?.nickname ||
    profile?.name ||
    user?.displayName ||
    user?.email?.split?.('@')?.[0] ||
    'A WorldCup fan'
  );
};

const getPhase3IAFooter = () =>
  `Download the app and predict all WorldCup 2026 matches:\n${APP_SHARE_URL}\n\nFIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.`;

const buildPhase3IAMatchShareText = (profile, user, matchText, predictionText) => {
  const avatar = getPhase3IAShareAvatar(profile);
  const name = getPhase3IAShareName(profile, user);
  return `${avatar} ${name} thinks this match will end:\n\n${predictionText || matchText}\n\nDo you agree, or do you think the result will be different?\n\n${getPhase3IAFooter()}`;
};

const buildPhase3IAChampionShareText = (profile, user, championText) => {
  const avatar = getPhase3IAShareAvatar(profile);
  const name = getPhase3IAShareName(profile, user);
  return `${avatar} ${name} thinks ${championText} will win WorldCup 2026.\n\nDo you agree? Choose your champion, predict every match, and share your picks with the world on FIFA WorldCup 2026 Predictor.\n\n${getPhase3IAFooter()}`;
};

const buildPhase3IALeaderboardShareText = (profile, user) => {
  const avatar = getPhase3IAShareAvatar(profile);
  const name = getPhase3IAShareName(profile, user);
  return `${avatar} ${name} is competing on the FIFA WorldCup 2026 Predictor leaderboard.\n\nPredict all WorldCup 2026 matches, challenge your friends, and share your predictions with the world.\n\n${getPhase3IAFooter()}`;
};

const buildPhase3IAInviteShareText = (profile, user) => {
  const avatar = getPhase3IAShareAvatar(profile);
  const name = getPhase3IAShareName(profile, user);
  return `${avatar} ${name} invited you to join FIFA WorldCup 2026 Predictor.\n\nDownload the app and predict all WorldCup 2026 matches:\n\n${getPhase3IAFooter()}`;
};

// Phase 3D-B: Full Automatic Account Deletion helper
// This is intentionally defensive: it anonymizes profile data first, then attempts to delete
// user-owned records and Firebase Auth. Firebase may require recent login for auth deletion.
async function phase3DBDeleteAccount({ auth, db, user, clearLocalAccount, afterDeleted }) {
  if (!user || !user.uid) {
    Alert.alert('Sign in required', 'Please sign in before requesting in-app account deletion.');
    return;
  }

  Alert.alert(
    'Delete account?',
    'This will delete or anonymize your FIFA WorldCup 2026 Predictor account data connected to this device. This action cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const uid = user.uid;
            const deletedAt = new Date();

            // Keep an anonymized deletion record for compliance/security without personal profile data.
            try {
              await setDoc(doc(db, 'deletedUsers', uid), {
                uid,
                deletedAt: serverTimestamp ? serverTimestamp() : deletedAt.toISOString(),
                reason: 'user_requested_in_app_deletion',
                app: 'FIFA WorldCup 2026 Predictor'
              }, { merge: true });
            } catch (e) {}

            // Remove/anonymize user profile.
            try {
              await setDoc(doc(db, 'users', uid), {
                email: null,
                name: 'Deleted User',
                nickname: 'Deleted User',
                age: null,
                sex: null,
                country: null,
                avatar: null,
                photoUrl: null,
                isDeleted: true,
                deletedAt: serverTimestamp ? serverTimestamp() : deletedAt.toISOString(),
                updatedAt: serverTimestamp ? serverTimestamp() : deletedAt.toISOString()
              }, { merge: true });
            } catch (e) {}

            // Delete user-owned records where security rules allow it.
            const collectionsToClean = ['predictions', 'bestPlayerVotes'];
            for (const colName of collectionsToClean) {
              try {
                const q = query(collection(db, colName), where('userId', '==', uid));
                const snap = await getDocs(q);
                const batch = writeBatch(db);
                snap.forEach((d) => batch.delete(d.ref));
                if (!snap.empty) await batch.commit();
              } catch (e) {}
            }

            // Delete champion pick if document id is uid.
            try { await deleteDoc(doc(db, 'championPicks', uid)); } catch (e) {}
            try { await deleteDoc(doc(db, 'leaderboard', uid)); } catch (e) {}

            if (clearLocalAccount) {
              try { await clearLocalAccount(); } catch (e) {}
            }

            // Delete Firebase Auth account last. This can fail if login is not recent.
            try {
              await deleteUser(user);
              Alert.alert('Account deleted', 'Your account deletion request was completed on this device.');
              if (afterDeleted) afterDeleted();
            } catch (authError) {
              Alert.alert(
                'Sign in again required',
                'Your app data was deleted or anonymized where possible, but Firebase requires a recent sign-in before the login account can be fully deleted. Please sign out, sign in again, and tap Delete Account again.'
              );
            }
          } catch (error) {
            Alert.alert('Deletion failed', error?.message || 'Something went wrong. Please try again or use the delete account webpage.');
          }
        }
      }
    ]
  );
}

const COLORS = {
  darkBg: '#070b12',
  darkCard: '#111827',
  lightBg: '#f8fafc',
  lightCard: '#ffffff',
  amber: '#fbbf24',
  green: '#22c55e',
  blue: '#38bdf8',
  red: '#ef4444',
  slate: '#334155',
  soft: '#1e293b',
};

class ScreenErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Screen failed to load.' };
  }
  componentDidCatch(error) {
    console.log('ScreenErrorBoundary caught:', error);
  }
  render() {
    if (this.state.hasError) {
      const dark = this.props.dark;
      const fg = dark ? '#ffffff' : '#0f172a';
      return (
        <SafeAreaView style={[styles.root, { backgroundColor: dark ? COLORS.darkBg : COLORS.lightBg }]}>
          <BackHeader title="Screen recovery" onBack={this.props.onBack || (() => {})} dark={dark} />
          <View style={{ padding: 16 }}>
            <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.red }]}>
              <Text style={[styles.sectionTitle, { color: fg }]}>Temporary screen issue</Text>
              <Text style={{ color: fg }}>This screen was protected from crashing the app.</Text>
              <Text style={{ color: fg, marginTop: 8 }}>notification preferences</Text>
            </View>
          </View>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

const ADMOB_ANDROID_APP_ID = 'ca-app-pub-7388735966130444~1056081892';
const ADMOB_AD_UNITS = {
  matches: 'ca-app-pub-7388735966130444/1111922210',
  top: 'ca-app-pub-7388735966130444/7839158260',
  news: 'ca-app-pub-7388735966130444/3844072939',
  groups: 'ca-app-pub-7388735966130444/6526076590',
};

// For public builds, keep test ads off. Ad slots will automatically hide if AdMob has no fill.
const USE_ADMOB_TEST_ADS = false;
const DEFAULT_AD_SETTINGS = {
  adsEnabled: true,
  useTestAds: USE_ADMOB_TEST_ADS,
  nonPersonalized: true,
  autoHideOnNoFill: true,
};

const AVATAR_OPTIONS = [
  '🐝','⚽','🏆','🦁','🦅','🦊','🐯','🐬','🐺','🐻','🐼','🦉',
  '🐵','🦄','🐢','🦈','🦋','🔥','⭐','🥅','👟','🎯','🥇','🎉'
];

function getAvatar(profile = {}, fallback = '⚽') {
  const avatar = profile?.avatar || profile?.avatarEmoji || profile?.photo || '';
  return typeof avatar === 'string' && avatar.trim() ? avatar : fallback;
}

// Phase 2G Firebase cost-control defaults.
// Keep high-traffic reads small and cache low-change documents on device.
const COST_CONTROL = {
  sponsorCacheMs: 1000 * 60 * 60 * 6,
  adConfigCacheMs: 1000 * 60 * 60 * 6,
  shortCacheMs: 1000 * 60 * 5,
  leaderboardPageSize: 25,
  maxNewsItems: 20,
  maxAdminLogPreview: 25,
};

function cacheKeyForDoc(path, id) {
  return `cache:v2g:${path}:${id}`;
}

function safeJsonParse(value, fallback = null) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

// Phase 2R safety helper: never render raw objects inside <Text>.
// Some Firebase/profile fields can accidentally be objects, which can crash React Native when Menu opens.
function safeText(value, fallback = 'Not set') {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value?.seconds) return new Date(value.seconds * 1000).toLocaleString();
  try { return JSON.stringify(value); } catch { return fallback; }
}

function getAdUnitId(placement = 'matches', settings = DEFAULT_AD_SETTINGS) {
  if (settings?.useTestAds === true) return TestIds.BANNER;
  return ADMOB_AD_UNITS[placement] || ADMOB_AD_UNITS.matches;
}

const APP_SHARE_NAME = 'FIFA WorldCup 2026 Predictor';
const APP_SHARE_URL = 'https://fifa-worldcup-2026-predictor.web.app/app';
const APP_BRAND_LINE = 'FIFA WorldCup 2026 Predictor is a product of Virtual Beehive Inc., the company behind Hobbee.FUN.';
const APP_SHARE_HASHTAGS = '#WorldCup2026 #Soccer #HobbeeFUN #DiscoverFUN';
const PRIVACY_POLICY_URL = 'https://play.google.com/store/apps/details?id=com.virtualbeehive.fifaworldcup2026predictor-privacy-policy';
const TERMS_URL = 'https://play.google.com/store/apps/details?id=com.virtualbeehive.fifaworldcup2026predictor-terms';
const DELETE_ACCOUNT_URL = 'https://play.google.com/store/apps/details?id=com.virtualbeehive.fifaworldcup2026predictor-delete-account';
const SUPPORT_EMAIL = 'danny@virtualbeehiveinc.com';

// PHASE3G_NOTIFICATION_PREFS
// Lightweight notification preference center. This does not send push notifications yet.
// It prepares user controls before Expo/Firebase push notification wiring is added later.
const NOTIFICATION_PREFS_KEY = 'worldcupPredictorNotificationPrefs:v1';
const DEFAULT_NOTIFICATION_PREFS = {
  matchReminders: true,
  predictionReminders: true,
  resultAlerts: true,
  leaderboardAlerts: true,
  sponsorUpdates: false,
};

async function loadNotificationPrefs() {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATION_PREFS_KEY);
    return raw ? { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(raw) } : DEFAULT_NOTIFICATION_PREFS;
  } catch {
    return DEFAULT_NOTIFICATION_PREFS;
  }
}

async function saveNotificationPrefs(nextPrefs) {
  const safePrefs = { ...DEFAULT_NOTIFICATION_PREFS, ...(nextPrefs || {}) };
  await AsyncStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(safePrefs));
  return safePrefs;
}

async function openExternalUrl(url) {
  try {
    const can = await Linking.canOpenURL(url);
    if (can) await Linking.openURL(url);
    else Alert.alert('Unable to open link', url);
  } catch (e) {
    Alert.alert('Unable to open link', e?.message || 'Please try again later.');
  }
}

function deleteAccountRequestMessage(profile = {}) {
  const email = safeText(profile?.email, 'the email used for my app account');
  const nickname = safeText(profile?.nickname || profile?.name, 'my account');
  return `Please delete my FIFA WorldCup 2026 Predictor account and associated app data.

Account email: ${email}
Name or nickname: ${nickname}

I understand this request may delete or anonymize my email, name, nickname, profile details, predictions, champion pick, best-player votes, and leaderboard records connected to my account.`;
}

async function emailDeleteRequest(profile = {}) {
  const subject = encodeURIComponent('Delete My FIFA WorldCup 2026 Predictor Account');
  const body = encodeURIComponent(deleteAccountRequestMessage(profile));
  await openExternalUrl(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
}

function brandedShareFooter() {
  return `Download the app and predict all WorldCup 2026 matches:
${APP_SHARE_URL}

${APP_SHARE_NAME}
${APP_BRAND_LINE}
${APP_SHARE_HASHTAGS}`;
}

async function shareAppMessage(message, title = APP_SHARE_NAME) {
  try {
    await Share.share({ title, message });
  } catch (e) {
    Alert.alert('Share unavailable', e?.message || 'Unable to open sharing options right now.');
  }
}

async function copyShareMessage(message) {
  try {
    await Clipboard.setStringAsync(message);
    Alert.alert('Copied', 'Share message copied. You can paste it into any social app.');
  } catch (e) {
    Alert.alert(' unavailable', e?.message || 'Unable to copy this message right now.');
  }
}

function displayNick(profile = {}) {
  return safeText(profile?.nickname || profile?.name, 'A WorldCup fan');
}

function matchShareMessage(match, scoreA, scoreB, profile = {}) {
  return `${displayNick(profile)} predicted:
${FLAGS[match.teamA] || ''} ${match.teamA} ${scoreA} - ${scoreB} ${match.teamB} ${FLAGS[match.teamB] || ''}

Download the app and predict all WorldCup 2026 matches:

${brandedShareFooter()}`;
}

function championShareMessage(team, profile = {}) {
  return `${displayNick(profile)} picked ${FLAGS[team] || ''} ${team} as the WorldCup 2026 champion in ${APP_SHARE_NAME}.

Who is your champion pick?

${brandedShareFooter()}`;
}

function leaderboardShareMessage(profile = {}) {
  return `${displayNick(profile)} is competing on the Top Predictors leaderboard in ${APP_SHARE_NAME}.

Make your own WorldCup 2026 predictions and challenge friends on the leaderboard.

${brandedShareFooter()}`;
}

function newsShareMessage(item) {
  return `${item.title}

Follow WorldCup 2026 predictions, matches, groups, news, and leaderboard competition in ${APP_SHARE_NAME}.

${brandedShareFooter()}`;
}

function appInviteShareMessage(profile = {}) {
  return `${displayNick(profile)} invited you to join ${APP_SHARE_NAME}.

Download the app and predict all WorldCup 2026 matches:

${brandedShareFooter()}`;
}

const firebaseConfig = {
  apiKey: 'AIzaSyCTAXgkM7zUdB3jajE3SRfcdvML0kgW5_w',
  authDomain: 'fifa-worldcup-2026-predictor.firebaseapp.com',
  projectId: 'fifa-worldcup-2026-predictor',
  storageBucket: 'fifa-worldcup-2026-predictor.firebasestorage.app',
  messagingSenderId: '560795586407',
  appId: '1:560795586407:web:f9cacd1bcb66b2c8c9a9c2',
  measurementId: 'G-ZEFX4R6LTZ',
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

async function readDoc(path, id) {
  const snap = await getDoc(doc(db, path, id));
  return snap.exists() ? snap.data() : null;
}

async function readDocCached(path, id, ttlMs = COST_CONTROL.shortCacheMs) {
  const key = cacheKeyForDoc(path, id);
  const cached = safeJsonParse(await AsyncStorage.getItem(key));
  const now = Date.now();

  if (cached?.savedAt && now - cached.savedAt < ttlMs) {
    return cached.data || null;
  }

  try {
    const fresh = await readDoc(path, id);
    if (fresh) {
      await AsyncStorage.setItem(key, JSON.stringify({ savedAt: now, data: fresh }));
      return fresh;
    }
  } catch (e) {
    console.log(`Cached read fallback for ${path}/${id}`, e?.message || e);
  }

  return cached?.data || null;
}

async function writeDoc(path, id, data, merge = true) {
  await setDoc(doc(db, path, id), data, { merge });
  // Invalidate local cache for admin-controlled docs so the next app open reads fresh values.
  try { await AsyncStorage.removeItem(cacheKeyForDoc(path, id)); } catch {}
}

const GROUPS = {
  A: ['Mexico', 'South Africa', 'Korea Republic', 'Czechia'],
  B: ['Canada', 'Bosnia & Herzegovina', 'Qatar', 'Switzerland'],
  C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
  D: ['USA', 'Paraguay', 'Australia', 'Turkiye'],
  E: ['Germany', 'Curacao', 'Cote d Ivoire', 'Ecuador'],
  F: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
  G: ['Belgium', 'Egypt', 'IR Iran', 'New Zealand'],
  H: ['Spain', 'Cabo Verde', 'Saudi Arabia', 'Uruguay'],
  I: ['France', 'Senegal', 'Iraq', 'Norway'],
  J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
  K: ['Portugal', 'Congo DR', 'Uzbekistan', 'Colombia'],
  L: ['England', 'Croatia', 'Ghana', 'Panama'],
};

const FLAGS = {
  Mexico: '🇲🇽', 'South Africa': '🇿🇦', 'Korea Republic': '🇰🇷', Czechia: '🇨🇿',
  Canada: '🇨🇦', 'Bosnia & Herzegovina': '🇧🇦', Qatar: '🇶🇦', Switzerland: '🇨🇭',
  Brazil: '🇧🇷', Morocco: '🇲🇦', Haiti: '🇭🇹', Scotland: '🏴',
  USA: '🇺🇸', Paraguay: '🇵🇾', Australia: '🇦🇺', Turkiye: '🇹🇷',
  Germany: '🇩🇪', Curacao: '🇨🇼', 'Cote d Ivoire': '🇨🇮', Ecuador: '🇪🇨',
  Netherlands: '🇳🇱', Japan: '🇯🇵', Sweden: '🇸🇪', Tunisia: '🇹🇳',
  Belgium: '🇧🇪', Egypt: '🇪🇬', 'IR Iran': '🇮🇷', 'New Zealand': '🇳🇿',
  Spain: '🇪🇸', 'Cabo Verde': '🇨🇻', 'Saudi Arabia': '🇸🇦', Uruguay: '🇺🇾',
  France: '🇫🇷', Senegal: '🇸🇳', Iraq: '🇮🇶', Norway: '🇳🇴',
  Argentina: '🇦🇷', Algeria: '🇩🇿', Austria: '🇦🇹', Jordan: '🇯🇴',
  Portugal: '🇵🇹', 'Congo DR': '🇨🇩', Uzbekistan: '🇺🇿', Colombia: '🇨🇴',
  England: '🏴', Croatia: '🇭🇷', Ghana: '🇬🇭', Panama: '🇵🇦',
};

const STADIUMS = [
  { stadium: 'Mexico City Stadium', city: 'Mexico City', state: 'CDMX', country: 'Mexico', capacity: '87,523', ticketRange: '$60 - $950' },
  { stadium: 'New York New Jersey Stadium', city: 'East Rutherford', state: 'New Jersey', country: 'USA', capacity: '82,500', ticketRange: '$200 - $2,500' },
  { stadium: 'Dallas Stadium', city: 'Arlington', state: 'Texas', country: 'USA', capacity: '80,000', ticketRange: '$120 - $1,500' },
  { stadium: 'Los Angeles Stadium', city: 'Inglewood', state: 'California', country: 'USA', capacity: '70,240', ticketRange: '$120 - $1,200' },
  { stadium: 'Toronto Stadium', city: 'Toronto', state: 'Ontario', country: 'Canada', capacity: '45,500', ticketRange: '$80 - $800' },
  { stadium: 'Vancouver Stadium', city: 'Vancouver', state: 'British Columbia', country: 'Canada', capacity: '54,500', ticketRange: '$80 - $900' },
  { stadium: 'Miami Stadium', city: 'Miami Gardens', state: 'Florida', country: 'USA', capacity: '65,326', ticketRange: '$120 - $1,500' },
  { stadium: 'Atlanta Stadium', city: 'Atlanta', state: 'Georgia', country: 'USA', capacity: '71,000', ticketRange: '$100 - $1,200' },
  { stadium: 'Seattle Stadium', city: 'Seattle', state: 'Washington', country: 'USA', capacity: '68,740', ticketRange: '$100 - $1,000' },
  { stadium: 'Boston Stadium', city: 'Foxborough', state: 'Massachusetts', country: 'USA', capacity: '65,878', ticketRange: '$100 - $1,200' },
  { stadium: 'Guadalajara Stadium', city: 'Zapopan', state: 'Jalisco', country: 'Mexico', capacity: '49,850', ticketRange: '$60 - $700' },
  { stadium: 'Monterrey Stadium', city: 'Monterrey', state: 'Nuevo Leon', country: 'Mexico', capacity: '53,500', ticketRange: '$60 - $800' },
];

const TEAM_DETAILS = Object.fromEntries(
  Object.values(GROUPS).flat().map((team, index) => [
    team,
    {
      coach: `${team} Coach`,
      description: `${team} enters the 2026 tournament with national pride, tactical identity, and a chance to create a memorable World Cup story. This section can later be edited from the admin dashboard or backend.`,
      achievements: ['World Cup participation', 'International tournament experience', 'National team development'],
      homeJersey: index % 2 === 0 ? '#ffffff' : '#0f172a',
      awayJersey: index % 3 === 0 ? COLORS.amber : COLORS.blue,
      players: Array.from({ length: 11 }, (_, i) => ({
        number: i + 1,
        name: `${team} Player ${i + 1}`,
        position: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'][i % 4],
        height: `${170 + ((i + index) % 22)} cm`,
        weight: `${65 + ((i + index) % 25)} kg`,
        education: 'Professional football academy',
        languages: 'Native language, English',
        achievements: 'National team selection',
        photo: i % 4 === 0 ? '🧍‍♂️' : i % 4 === 1 ? '🏃‍♂️' : i % 4 === 2 ? '⚽' : '🧤',
      })),
    },
  ])
);

TEAM_DETAILS.Argentina.players[9] = {
  number: 10,
  name: 'Messi',
  position: 'Forward',
  height: '170 cm',
  weight: '72 kg',
  education: 'Professional football academy',
  languages: 'Spanish, English',
  achievements: 'World champion, Ballon d Or winner',
  photo: '🧍‍♂️',
};
TEAM_DETAILS.USA.players[9] = {
  number: 10,
  name: 'USA #10 Player',
  position: 'Forward / Midfielder',
  height: '178 cm',
  weight: '73 kg',
  education: 'Professional football academy',
  languages: 'English',
  achievements: 'National team player',
  photo: '🏃‍♂️',
};

function buildFixtures() {
  const games = [];
  const pairings = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];
  let id = 1;
  let day = 0;
  Object.entries(GROUPS).forEach(([group, teams]) => {
    pairings.forEach(([a, b], pIndex) => {
      const venue = STADIUMS[(id - 1) % STADIUMS.length];
      const hour = [12, 15, 18, 21][(id - 1) % 4];
      const dt = new Date(Date.UTC(2026, 5, 11 + day, hour, 0, 0));
      games.push({
        id,
        group,
        stage: '',
        matchNo: id,
        teamA: teams[a],
        teamB: teams[b],
        dateTime: dt.toISOString(),
        liveScore: [0, 0],
        previous: `${teams[a]} and ${teams[b]} previous meetings, goals, wins and draws will appear here when the free source or admin data is connected.`,
        ...venue,
      });
      id += 1;
      if (pIndex % 2 === 1) day += 1;
    });
  });
  const knockoutStages = [['Round of 32', 16], ['Round of 16', 8], ['Quarterfinal', 4], ['Semifinal', 2], ['Third Place', 1], ['Final', 1]];
  knockoutStages.forEach(([stage, count]) => {
    for (let i = 0; i < count; i += 1) {
      const venue = STADIUMS[(id - 1) % STADIUMS.length];
      const dt = new Date(Date.UTC(2026, 6, 1 + Math.floor((id - 73) / 2), 18, 0, 0));
      games.push({
        id,
        group: '',
        stage,
        matchNo: id,
        teamA: `${stage} Team A`,
        teamB: `${stage} Team B`,
        dateTime: dt.toISOString(),
        liveScore: [0, 0],
        previous: 'Knockout head-to-head will appear once teams are confirmed.',
        ...venue,
      });
      id += 1;
    }
  });
  return games.slice(0, 104);
}

const FIXTURES = buildFixtures();

const NEWS = [
  { id: 1, title: 'World Cup 2026 tournament schedule is set', source: 'FIFA', date: '2026', body: 'The 2026 tournament features 48 teams, 12 groups, and 104 matches. This Phase 2A app shows a local fixture and prediction experience. Full live data can be connected in Phase 2B.' },
  { id: 2, title: 'Fans can start preparing predictions', source: 'Virtual Beehive Inc.', date: '2026', body: 'Users can select matches, make score predictions, choose a champion once, and select a fan best player of the game. In this local preview, predictions are saved on the phone.' },
  { id: 3, title: 'Sponsor banner ready for Hobbee.FUN', source: 'Virtual Beehive Inc.', date: '2026', body: 'The sponsor banner is built as a moving banner and can later be controlled from the hidden admin tools or backend sponsor manager.' },
];

function fmtDate(iso) {
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function matchStatus(match) {
  const status = String(match?.statusOverride || match?.status || '').toLowerCase();
  if (status === 'final' || status === 'finished') return { label: 'Finished', color: '#94a3b8', locked: true, left: 0, prompt: 'Match finished. Prediction closed.' };
  if (status === 'live') return { label: 'Live', color: COLORS.green, locked: false, left: 0, prompt: 'Prediction remains open until halftime.' };
  if (status === 'halftime' || status === 'second_half') return { label: status === 'halftime' ? 'Halftime' : 'Second Half', color: '#f97316', locked: true, left: 0, prompt: 'Prediction locked after halftime.' };
  if (match?.predictionLocked === true) return { label: 'Locked', color: '#64748b', locked: true, left: 0, prompt: 'Prediction locked by match status.' };
  const now = new Date();
  const start = new Date(match.dateTime);
  const lock = new Date(start.getTime() + 45 * 60 * 1000);
  const finish = new Date(start.getTime() + 120 * 60 * 1000);
  if (now < start) return { label: 'Upcoming', color: COLORS.amber, locked: false, left: start - now, prompt: 'Prediction open until kickoff and first half.' };
  if (now >= start && now < lock) return { label: 'Live 1st Half', color: COLORS.green, locked: false, left: lock - now, prompt: 'Prediction closes at halftime.' };
  if (now >= lock && now < finish) return { label: 'Locked', color: '#64748b', locked: true, left: 0, prompt: 'Prediction locked after halftime.' };
  return { label: 'Finished', color: '#94a3b8', locked: true, left: 0, prompt: 'Match finished. Prediction closed.' };
}

function fmtLeft(ms) {
  if (ms <= 0) return '00:00:00';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function fakeAverage(matchId, side) {
  return Math.round((matchId * side + side * 2) % 5);
}

function matchWithOverride(match, data = null) {
  if (!data) return match;
  const a = data.teamAScore ?? data.scoreA ?? data.homeScore ?? match.liveScore?.[0] ?? 0;
  const b = data.teamBScore ?? data.scoreB ?? data.awayScore ?? match.liveScore?.[1] ?? 0;
  return {
    ...match,
    ...data,
    id: match.id,
    matchNo: match.matchNo,
    teamA: match.teamA,
    teamB: match.teamB,
    liveScore: [Number(a || 0), Number(b || 0)],
    statusOverride: data.status || data.matchStatus || match.statusOverride || '',
    predictionLocked: data.predictionLocked === true || match.predictionLocked === true,
  };
}

function scorePredictionForMatch(match, prediction) {
  if (!match || !prediction) return null;
  const status = String(match.statusOverride || match.status || '').toLowerCase();
  const isFinal = status === 'final' || status === 'finished' || matchStatus(match).label === 'Finished';
  if (!isFinal) return null;
  const actualA = Number(match.liveScore?.[0] ?? 0);
  const actualB = Number(match.liveScore?.[1] ?? 0);
  const predA = Number(prediction.a ?? prediction.teamAScore ?? 0);
  const predB = Number(prediction.b ?? prediction.teamBScore ?? 0);
  const exact = predA === actualA && predB === actualB;
  const predDiff = Math.sign(predA - predB);
  const actualDiff = Math.sign(actualA - actualB);
  const correctOutcome = predDiff === actualDiff;
  if (exact) return { type: 'exact', points: 50, title: 'Perfect prediction!', emoji: '🏆', message: `You predicted the exact score: ${match.teamA} ${actualA} - ${actualB} ${match.teamB}.` };
  if (correctOutcome && actualDiff === 0) return { type: 'draw', points: 15, title: 'Correct draw prediction!', emoji: '🤝', message: `You predicted the match would end in a draw.` };
  if (correctOutcome) return { type: 'winner', points: 10, title: 'Correct winner!', emoji: '🎉', message: `You predicted the correct match outcome.` };
  return { type: 'miss', points: 0, title: 'Prediction result available', emoji: '⚽', message: `Final score: ${match.teamA} ${actualA} - ${actualB} ${match.teamB}.` };
}

function celebrationShareMessage(match, result, profile = {}) {
  const score = `${match.teamA} ${match.liveScore?.[0] ?? 0} - ${match.liveScore?.[1] ?? 0} ${match.teamB}`;
  return `${result.emoji} ${displayNick(profile)} scored ${result.points} points on ${APP_SHARE_NAME}!

${result.title}
Final: ${score}

Make your own WorldCup 2026 predictions and compete on the leaderboard.

${brandedShareFooter()}`;
}

function CelebrationCard({ match, prediction, profile, dark }) {
  const fg = dark ? '#ffffff' : '#0f172a';
  const result = scorePredictionForMatch(match, prediction);
  if (!result || result.points <= 0) return null;
  const message = celebrationShareMessage(match, result, profile);
  return (
    <View style={styles.celebrationCard}>
      <Text style={styles.celebrationEmoji}>{result.emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.celebrationTitle}>{result.title}</Text>
        <Text style={{ color: fg }}>{result.message}</Text>
        <Text style={styles.celebration}>+{result.points} points</Text>
        <ShareRow message={message} shareLabel="Share" title="Share" />
      </View>
    </View>
  );
}

function ButtonPill({ label, onPress, disabled, color }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.btn, disabled && styles.disabled, color ? { backgroundColor: color } : null]}>
      <Text style={styles.btnText}>{label}</Text>
    </TouchableOpacity>
  );
}

function ShareRow({ message, shareLabel = 'Share', title = APP_SHARE_NAME }) {
  const safeMessage = safeText(message, `${APP_SHARE_NAME}\n${APP_SHARE_URL}`);
  return (
    <View style={styles.shareBox}>
      
      <View style={styles.shareRow}>
        <ButtonPill label={shareLabel} onPress={() => shareAppMessage(safeMessage, title)} color={COLORS.blue} />
      </View>
    </View>
  );
}

function BackHeader({ title, onBack, dark }) {
  const fg = dark ? '#ffffff' : '#0f172a';
  return (
    <View style={[styles.backHeader, dark ? { backgroundColor: '#0f172a' } : { backgroundColor: '#ffffff' }]}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={{ color: '#000000', fontWeight: '900' }}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: fg }]} numberOfLines={1}>{title}</Text>
    </View>
  );
}

function normalizeImageUrl(url = '') {
  const raw = String(url || '').trim();
  if (!raw) return '';
  const driveMatch = raw.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch?.[1]) return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  const driveOpenMatch = raw.match(/[?&]id=([^&]+)/);
  if (raw.includes('drive.google.com') && driveOpenMatch?.[1]) return `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;
  return raw;
}

function sponsorLogoFrom(sponsor = {}) {
  return normalizeImageUrl(sponsor.logoUrl || sponsor.logo || sponsor.imageUrl || sponsor.logoURL || '');
}

function SponsorLogo({ sponsor, dark }) {
  const [failed, setFailed] = useState(false);
  const logoUri = sponsorLogoFrom(sponsor);
  if (!logoUri || failed) {
    return (
      <View style={[styles.sponsorLogoFallback, dark ? { backgroundColor: '#0f172a' } : { backgroundColor: '#fef3c7' }]}>
        <Text style={{ color: COLORS.amber, fontWeight: '900', fontSize: 18 }}>★</Text>
      </View>
    );
  }
  return (
    <Image
      source={{ uri: logoUri }}
      style={styles.sponsorLogo}
      resizeMode="contain"
      onError={() => setFailed(true)}
    />
  );
}

function SponsorBanner({ dark, sponsor }) {
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(x, { toValue: -360, duration: 12000, useNativeDriver: true }),
        Animated.timing(x, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [x]);

  if (sponsor?.active === false) return null;
  const name = safeText(sponsor?.name, 'Hobbee.FUN');
  const message = safeText(sponsor?.message, 'Visit Hobbee.FUN');
  const callToAction = safeText(sponsor?.callToAction, 'Visit sponsor');
  const linkUrl = safeText(sponsor?.linkUrl || sponsor?.url, '');

  const openSponsor = () => {
    if (linkUrl && linkUrl !== 'Not set') openExternalUrl(linkUrl);
  };

  return (
    <TouchableOpacity onPress={openSponsor} activeOpacity={0.85} style={[styles.sponsor, dark ? styles.cardDark : styles.cardLight]}>
      <SponsorLogo sponsor={sponsor || {}} dark={dark} />
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <Text style={[styles.sponsorLabel, { color: dark ? '#94a3b8' : '#64748b' }]}>Sponsored by</Text>
        <Text style={[styles.sponsorName, { color: dark ? '#ffffff' : '#0f172a' }]} numberOfLines={1}>{name}</Text>
        <Animated.Text style={[styles.sponsorText, { transform: [{ translateX: x }] }]} numberOfLines={1}>
          {message}     {callToAction}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
}

function AdBox({ dark, tone = 0, placement = 'matches', adSettings = DEFAULT_AD_SETTINGS }) {
  const settings = { ...DEFAULT_AD_SETTINGS, ...(adSettings || {}) };
  const backgrounds = dark ? ['#0b1220', '#111827', '#172033'] : ['#f1f5f9', '#fff7ed', '#ecfeff'];
  const borders = dark ? ['#334155', '#475569', '#14532d'] : ['#cbd5e1', '#fed7aa', '#a5f3fc'];
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorText, setErrorText] = useState('');

  if (!settings.adsEnabled) return null;
  if (failed && settings.autoHideOnNoFill) return null;

  return (
    <View style={[styles.adBox, { backgroundColor: backgrounds[tone % backgrounds.length], borderColor: borders[tone % borders.length] }]}> 
      <Text style={{ color: dark ? '#e2e8f0' : '#334155', fontWeight: '900', marginBottom: 6 }}>
        {loaded ? 'Advertisement' : failed ? 'Advertisement unavailable' : 'Ad loading...'}
      </Text>
      <BannerAd
        key={`${placement}-${settings.useTestAds ? 'test' : 'real'}-${settings.nonPersonalized !== false ? 'npa' : 'pa'}`}
        unitId={getAdUnitId(placement, settings)}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: settings.nonPersonalized !== false }}
        onAdLoaded={() => {
          setLoaded(true);
          setFailed(false);
          setErrorText('');
        }}
        onAdFailedToLoad={(error) => {
          setFailed(true);
          setLoaded(false);
          setErrorText(error?.message || error?.code || 'Unknown AdMob error');
        }}
      />
      {settings.useTestAds ? <Text style={{ color: dark ? '#64748b' : '#94a3b8', fontSize: 10, marginTop: 4 }}>Test ads enabled</Text> : null}
      {failed ? <Text style={{ color: '#ef4444', fontSize: 10, marginTop: 4 }}>{errorText}</Text> : null}
    </View>
  );
}

function Header({ dark, fg, setDark, setMenu }) {
  return (
    <View style={[styles.header, dark ? { backgroundColor: '#0f172a' } : { backgroundColor: '#ffffff' }] }>
      <Image source={require('./assets/app-logo.png')} style={styles.logo} />
      <View style={{ flex: 1 }}>
        
        <Text style={[styles.title, { color: fg }]}>FIFA WorldCup 2026 Predictor</Text>
      </View>
      <TouchableOpacity onPress={() => setDark(!dark)} style={styles.iconBtn}>
        <Text style={{ fontSize: 22 }}>{dark ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setMenu(true)} style={styles.iconBtn}>
        <Text style={{ fontSize: 28, color: fg }}>☰</Text>
      </TouchableOpacity>
    </View>
  );
}

function BouncingBall() {
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -7, duration: 520, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 520, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bounce]);

  return (
    <Animated.Text style={[styles.bouncingBall, { transform: [{ translateY: bounce }] }]}>⚽</Animated.Text>
  );
}

function Matches({ dark, fg, predictions, setSelected, adSettings }) {
  return (
    <ScrollView style={{ padding: 12 }}>
      <View style={styles.matchesTitleRow}>
        <Text style={[styles.matchesTitle, { color: fg }]}>Matches</Text>
        <BouncingBall />
      </View>
      <Text style={[styles.matchesHelp, { color: fg }]}>Tap any match to predict before halftime.</Text>
      <AdBox dark={dark} tone={0} placement="matches" adSettings={adSettings} />
      {FIXTURES.map((match, index) => {
        const st = matchStatus(match);
        const key = String(match.id);
        const pred = predictions[key];
        return (
          <View key={match.id}>
            <TouchableOpacity onPress={() => setSelected(match)} style={[styles.matchCard, dark ? styles.cardDark : styles.cardLight]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                <Text style={{ color: st.color, fontWeight: '900' }}>#{match.matchNo} {st.label}</Text>
                <Text style={{ color: fg }}>{fmtDate(match.dateTime)}</Text>
              </View>
              <Text style={[styles.matchTeams, { color: fg }]}>{FLAGS[match.teamA] || '🏳️'} {match.teamA}  vs  {FLAGS[match.teamB] || '🏳️'} {match.teamB}</Text>
              <Text style={{ color: fg }}>{match.stage} {match.group ? `• Group ${match.group}` : ''}</Text>
              <Text style={{ color: fg }}>{match.stadium} {match.city}</Text>
              {pred ? <Text style={{ color: COLORS.green, fontWeight: '900' }}>Your prediction: {pred.a} - {pred.b}</Text> : <Text style={{ color: COLORS.amber }}>No prediction yet</Text>}
            </TouchableOpacity>
            {(index + 1) % 4 === 0 && <AdBox dark={dark} tone={index} placement="matches" adSettings={adSettings} />}
          </View>
        );
      })}
    </ScrollView>
  );
}

function ScoreStepper({ label, value, setValue, disabled }) {
  return (
    <View style={styles.stepper}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperRow}>
        <ButtonPill label="−" disabled={disabled} onPress={() => setValue(Math.max(0, value - 1))} />
        <Text style={styles.scoreText}>{value}</Text>
        <ButtonPill label="+" disabled={disabled} onPress={() => setValue(value + 1)} color={COLORS.green} />
      </View>
    </View>
  );
}

function StadiumCard({ match, dark, fg }) {
  return (
    <View style={[styles.stadiumHero, dark ? { backgroundColor: '#111827' } : { backgroundColor: '#e2e8f0' }]}>
      <Text style={styles.stadiumEmoji}>🏟️</Text>
      <View style={styles.stadiumOverlay}>
        <Text style={styles.stadiumTitle}>{match.stadium}</Text>
        <Text style={styles.stadiumText}>{match.city}, {match.state} {match.country}</Text>
        <Text style={styles.stadiumText}>Capacity: {match.capacity}</Text>
        <Text style={styles.stadiumText}>Ticket range: {match.ticketRange}</Text>
      </View>
    </View>
  );
}

function MatchDetail({ match, onClose, dark, predictions, savePrediction, setTeamOpen, bestPlayers, bestPlayerPollSummaries = {}, saveBestPlayer, adSettings, profile }) {
  const fg = dark ? '#ffffff' : '#0f172a';
  const [tab, setTab] = useState('summary');
  const [activeMatch, setActiveMatch] = useState(match);
  useEffect(() => {
    let alive = true;
    async function loadMatchOverride() {
      try {
        const remote = await readDoc('matches', String(match.id));
        if (alive && remote) setActiveMatch(matchWithOverride(match, remote));
        else if (alive) setActiveMatch(match);
      } catch (e) {
        console.log('Match override load failed', e?.message || e);
        if (alive) setActiveMatch(match);
      }
    }
    loadMatchOverride();
    return () => { alive = false; };
  }, [match.id]);
  const saved = predictions[String(match.id)] || { a: 0, b: 0 };
  const [a, setA] = useState(saved.a);
  const [b, setB] = useState(saved.b);
  const selectedBest = bestPlayers[String(match.id)];
  const globalBestSummary = bestPlayerPollSummaries[String(match.id)] || {};
  const globalTopPlayerName = globalBestSummary.topPlayerName || '';
  const globalTopPlayerPercent = Number(globalBestSummary.topPlayerPercent || 0);
  const globalTopPlayerVotes = Number(globalBestSummary.topPlayerVoteCount || 0);
  const status = matchStatus(activeMatch);
  const shareMessage = matchShareMessage(activeMatch, a, b, profile);
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: dark ? COLORS.darkBg : COLORS.lightBg }] }>
      <BackHeader title={`${activeMatch.teamA} vs ${activeMatch.teamB}`} onBack={onClose} dark={dark} />
      <ScrollView style={{ padding: 16 }}>
        <StadiumCard match={activeMatch} dark={dark} fg={fg} />
        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: status.color }] }>
          <Text style={{ color: status.color, fontWeight: '900' }}>{status.label}</Text>
          <Text style={[styles.big, { color: fg }]}>{activeMatch.teamA} vs {activeMatch.teamB}</Text>
          <Text style={{ color: fg }}>Prediction time left: {fmtLeft(status.left)}</Text>
          <Text style={{ color: fg }}>{status.prompt}</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <ScoreStepper label={activeMatch.teamA} value={a} setValue={setA} disabled={status.locked} />
            <ScoreStepper label={activeMatch.teamB} value={b} setValue={setB} disabled={status.locked} />
          </View>
          <ButtonPill label="Confirm / Save Prediction" disabled={status.locked} onPress={() => savePrediction(match.id, a, b)} color={COLORS.green} />
          <ShareRow message={shareMessage} shareLabel="Share" title="Share" />
          <View style={styles.blackBox}>
            <Text style={styles.blackTitle}>Our Users Prediction</Text>
            <Text style={styles.blackScore}>{activeMatch.teamA} {fakeAverage(activeMatch.id, 1)} - {fakeAverage(activeMatch.id, 2)} {activeMatch.teamB}</Text>
            <Text style={styles.blackSmall}>Placeholder until backend global averages are connected.</Text>
          </View>
          <View style={styles.blackBox}>
            <Text style={styles.blackTitle}>Live Score</Text>
            <Text style={styles.blackScore}>{activeMatch.teamA} {activeMatch.liveScore[0]} - {activeMatch.liveScore[1]} {activeMatch.teamB}</Text>
          </View>
          <CelebrationCard match={activeMatch} prediction={saved} profile={profile} dark={dark} />
        </View>
        <AdBox dark={dark} tone={1} placement="matches" adSettings={adSettings} />
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          {['summary', 'compare', 'head'].map((t) => (
            <ButtonPill key={t} label={t === 'summary' ? 'Summary' : t === 'compare' ? 'Teams' : 'History'} onPress={() => setTab(t)} color={tab === t ? COLORS.amber : COLORS.slate} />
          ))}
        </View>
        {tab === 'summary' && (
          <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.sectionTitle, { color: fg }]}>Fan Player Poll of the game</Text>
            <Text style={{ color: fg }}>Choose anytime before or after the match.</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {[...((TEAM_DETAILS[activeMatch.teamA] || {}).players || []), ...((TEAM_DETAILS[activeMatch.teamB] || {}).players || [])].slice(0, 10).map((p) => (
                <TouchableOpacity key={`${p.name}-${p.number}`} onPress={() => saveBestPlayer(match.id, p.name)} style={[styles.bestPlayerPill, selectedBest === p.name && { backgroundColor: COLORS.green }]}>
                  <Text style={{ fontWeight: '900', color: selectedBest === p.name ? '#000' : fg }}>#{p.number} {p.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {tab === 'head' && (
        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.sectionTitle, { color: fg }]}>Global Fan Pick</Text>
          <Text style={{ color: fg, fontWeight: '900', fontSize: 18 }}>
            {globalTopPlayerName
              ? `Highest fan-selected player: ${globalTopPlayerName}`
              : 'Highest fan-selected player will appear after fans vote.'}
          </Text>
          {!!globalTopPlayerName && (
            <Text style={{ color: muted, marginTop: 6 }}>
              {globalTopPlayerVotes} vote{globalTopPlayerVotes === 1 ? '' : 's'}{globalTopPlayerPercent ? ` • ${globalTopPlayerPercent}% of votes` : ''}
            </Text>
          )}
          {selectedBest ? (
            <Text style={{ color: COLORS.green, marginTop: 8, fontWeight: '800' }}>
              Your pick: {selectedBest}
            </Text>
          ) : (
            <Text style={{ color: muted, marginTop: 8 }}>
              Select your fan best player below.
            </Text>
          )}
        </View>
      )}

      {tab === 'compare' && <TeamCompare a={activeMatch.teamA} b={activeMatch.teamB} dark={dark} setTeamOpen={setTeamOpen} />}
        {tab === 'head' && (
          <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.sectionTitle, { color: fg }]}>History</Text>
            <Text style={{ color: fg }}>{activeMatch.previous || 'Head-to-head history will appear here when verified past match data is available.'}</Text>
            <AdBox dark={dark} tone={2} placement="matches" adSettings={adSettings} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Jersey({ color, label }) {
  return (
    <View style={styles.jerseyWrap}>
      <View style={[styles.jersey, { backgroundColor: color }]}>
        <Text style={{ fontSize: 22 }}>👕</Text>
      </View>
      <Text style={styles.jerseyLabel}>{label}</Text>
    </View>
  );
}

function CoachCard({ team, dark, fg }) {
  const d = TEAM_DETAILS[team] || {};
  return (
    <View style={[styles.coachCard, dark ? { backgroundColor: '#020617' } : { backgroundColor: '#f1f5f9' }]}>
      <Text style={{ fontSize: 34 }}>🧑‍💼</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color: fg, fontWeight: '900' }}>{d.coach || `${team} Coach`}</Text>
        <Text style={{ color: fg, fontSize: 12 }}>Head coach passport photo placeholder</Text>
      </View>
    </View>
  );
}

function TeamCompare({ a, b, dark, setTeamOpen }) {
  const fg = dark ? '#ffffff' : '#0f172a';
  return (
    <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[a, b].map((team) => {
          const d = TEAM_DETAILS[team] || { players: [], achievements: [] };
          return (
            <TouchableOpacity key={team} onPress={() => setTeamOpen(team)} style={{ flex: 1 }}>
              <Text style={{ fontSize: 28, textAlign: 'center' }}>{FLAGS[team]}</Text>
              <Text style={[styles.sectionTitle, { color: fg, textAlign: 'center' }]}>{team}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
                <Jersey color={d.homeJersey || '#fff'} label="Home" />
                <Jersey color={d.awayJersey || COLORS.blue} label="Away" />
              </View>
              <CoachCard team={team} dark={dark} fg={fg} />
              <Text style={{ color: fg, fontSize: 12 }}>{d.description}</Text>
              <Text style={{ color: COLORS.amber, fontWeight: '900', marginTop: 8 }}>Achievements</Text>
              {d.achievements.map((x) => <Text key={x} style={{ color: fg, fontSize: 12 }}>• {x}</Text>)}
              {d.players.slice(0, 4).map((p) => (
                <View key={p.number} style={styles.playerMini}>
                  <Text style={{ fontSize: 32, textAlign: 'center' }}>{p.photo}</Text>
                  <Text style={{ color: fg, fontWeight: '900' }}>#{p.number} {p.name}</Text>
                  <Text style={{ color: fg, fontSize: 11 }}>{p.position} {p.height} {p.weight}</Text>
                </View>
              ))}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const ROUND_32_LEFT = [
  { slot: '1E', helper: 'vs 3rd place', flags: ['Germany', 'Curacao', 'Cote d Ivoire', 'Ecuador'] },
  { slot: '1I', helper: 'vs 3rd place', flags: ['France', 'Senegal', 'Iraq', 'Norway'] },
  { slot: '2A vs 2B', helper: 'runner-up path', flags: ['Mexico', 'South Africa', 'Canada', 'Switzerland'] },
  { slot: '1F vs 2C', helper: 'group winner path', flags: ['Netherlands', 'Brazil', 'Morocco'] },
  { slot: '2K vs 2L', helper: 'runner-up path', flags: ['Portugal', 'Colombia', 'England', 'Croatia'] },
  { slot: '1H vs 2J', helper: 'group winner path', flags: ['Spain', 'Uruguay', 'Argentina'] },
  { slot: '1D', helper: 'vs 3rd place', flags: ['USA', 'Paraguay', 'Australia', 'Turkiye'] },
  { slot: '1G', helper: 'vs 3rd place', flags: ['Belgium', 'Egypt', 'IR Iran', 'New Zealand'] },
];

const ROUND_32_RIGHT = [
  { slot: '1C vs 2F', helper: 'group winner path', flags: ['Brazil', 'Morocco', 'Netherlands', 'Japan'] },
  { slot: '2E vs 2I', helper: 'runner-up path', flags: ['Germany', 'Ecuador', 'France', 'Senegal'] },
  { slot: '1A', helper: 'vs 3rd place', flags: ['Mexico', 'South Africa', 'Korea Republic', 'Czechia'] },
  { slot: '1L', helper: 'vs 3rd place', flags: ['England', 'Croatia', 'Ghana', 'Panama'] },
  { slot: '1J vs 2H', helper: 'group winner path', flags: ['Argentina', 'Algeria', 'Spain', 'Uruguay'] },
  { slot: '2D vs 2G', helper: 'runner-up path', flags: ['USA', 'Australia', 'Belgium', 'Egypt'] },
  { slot: '1B', helper: 'vs 3rd place', flags: ['Canada', 'Qatar', 'Switzerland'] },
  { slot: '1K', helper: 'vs 3rd place', flags: ['Portugal', 'Uzbekistan', 'Colombia'] },
];

function BracketSlot({ item, fg }) {
  return (
    <View style={styles.bracketSlotCard}>
      <Text style={styles.bracketSlotTitle}>{item.slot}</Text>
      <View style={styles.bracketFlagRow}>
        {item.flags.slice(0, 4).map((team) => (
          <Text key={team} style={styles.bracketFlag}>{FLAGS[team] || '🏳️'}</Text>
        ))}
      </View>
      <Text style={[styles.bracketHelper, { color: fg }]}>{item.helper}</Text>
    </View>
  );
}

function MiniRoundColumn({ title, items, fg }) {
  return (
    <View style={styles.bracketColumn}>
      <Text style={styles.bracketColumnTitle}>{title}</Text>
      {items.map((item, index) => <BracketSlot key={`${item.slot}-${index}`} item={item} fg={fg} />)}
    </View>
  );
}

function KnockoutBracket({ dark, fg }) {
  const quarterLeft = ['W49', 'W50', 'W51', 'W52'];
  const quarterRight = ['W53', 'W54', 'W55', 'W56'];
  const semiLeft = ['QF 1', 'QF 2'];
  const semiRight = ['QF 3', 'QF 4'];
  return (
    <View style={[styles.bracketBox, dark ? styles.cardDark : styles.cardLight]}>
      <Text style={[styles.sectionTitle, { color: fg }]}>Knockout map</Text>
      <Text style={{ color: fg, marginBottom: 10 }}>
        Phase 2J makes the knockout map visible now. Flags stay colorful for active teams; future backend/admin results can gray out eliminated teams and advance winners automatically.
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bracketLandscape}>
        <MiniRoundColumn title="Round of 32" items={ROUND_32_LEFT} fg={fg} />
        <View style={styles.bracketConnectorColumn}>{quarterLeft.map((x) => <Text key={x} style={styles.bracketAdvance}>{x}</Text>)}</View>
        <View style={styles.bracketConnectorColumn}>{semiLeft.map((x) => <Text key={x} style={[styles.bracketAdvance, styles.bracketAdvanceTall]}>{x}</Text>)}</View>
        <View style={styles.trophyCenterLarge}>
          <Text style={{ fontSize: 78 }}>🏆</Text>
          <Text style={styles.trophyText}>WorldCup 2026</Text>
          <Text style={styles.trophySub}>Final</Text>
          <View style={styles.finalCupLine} />
          <Text style={styles.trophySub}>Champion</Text>
        </View>
        <View style={styles.bracketConnectorColumn}>{semiRight.map((x) => <Text key={x} style={[styles.bracketAdvance, styles.bracketAdvanceTall]}>{x}</Text>)}</View>
        <View style={styles.bracketConnectorColumn}>{quarterRight.map((x) => <Text key={x} style={styles.bracketAdvance}>{x}</Text>)}</View>
        <MiniRoundColumn title="Round of 32" items={ROUND_32_RIGHT} fg={fg} />
      </ScrollView>
    </View>
  );
}

function GroupTableCard({ group, teams, fg, dark, champion, chooseChampion, setTeamOpen }) {
  return (
    <View style={[styles.groupBox, dark ? styles.cardDark : styles.cardLight]}>
      <Text style={styles.groupHeader}>Group {group}</Text>
      {teams.map((team, index) => {
        const isChampion = champion === team;
        const seedLabel = phase3PIContinentFromTeam(team);
        return (
          <TouchableOpacity
            key={team}
            onPress={() => chooseChampion(team)}
            onLongPress={() => setTeamOpen(team)}
            style={[styles.groupTeamRow, isChampion && styles.groupTeamSelected]}
          >
            <Text style={{ fontSize: 22 }}>{FLAGS[team]}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '900', color: fg }}>{team}</Text>
              <Text style={{ color: dark ? '#94a3b8' : '#64748b', fontSize: 11 }}>{seedLabel} </Text>
            </View>
            {isChampion && <Text style={styles.championBadge}>★</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function Groups({ dark, fg, champion, chooseChampion, setTeamOpen, adSettings, profile }) {
  const groupEntries = Object.entries(GROUPS);
  return (
    <ScrollView style={{ padding: 12 }}>
      <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.amber }] }>
        <Text style={[styles.big, { color: fg }]}>Pick Your Champion</Text>
        <Text style={{ color: fg }}>Choose once. After confirmation, it is locked.</Text>
        <Text style={{ color: COLORS.green, fontWeight: '900', fontSize: 18, marginTop: 8 }}>{champion ? `Confirmed: ${FLAGS[champion]} ${champion}` : 'No champion selected yet'}</Text>
        {champion ? <ShareRow message={championShareMessage(champion, profile)} shareLabel="Share" title="Share" /> : null}
      </View>

      <Text style={[styles.sectionTitle, { color: fg }]}>Groups</Text>
      
      <View style={styles.groupGrid}>
        {groupEntries.map(([group, arr]) => (
          <GroupTableCard
            key={group}
            group={group}
            teams={arr}
            fg={fg}
            dark={dark}
            champion={champion}
            chooseChampion={chooseChampion}
            setTeamOpen={setTeamOpen}
          />
        ))}
      </View>

      <AdBox dark={dark} tone={2} placement="groups" adSettings={adSettings} />
      <KnockoutBracket dark={dark} fg={fg} />
    </ScrollView>
  );
}

function News({ dark, fg, setNewsOpen, adSettings }) {
  return (
    <ScrollView style={{ padding: 12 }}>
      {NEWS.map((n, index) => (
        <View key={n.id}>
          <TouchableOpacity onPress={() => setNewsOpen(n)} style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.sectionTitle, { color: fg }]}>{n.title}</Text>
            <Text style={{ color: COLORS.amber }}>{n.source} {n.date}</Text>
            <Text style={{ color: fg }}>Tap to read full news</Text>
          </TouchableOpacity>
          {index === 0 && <AdBox dark={dark} tone={1} placement="news" adSettings={adSettings} />}
        </View>
      ))}
    </ScrollView>
  );
}

function NewsDetail({ item, onClose, dark }) {
  const fg = dark ? '#ffffff' : '#0f172a';
  if (!item) return null;
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: dark ? COLORS.darkBg : COLORS.lightBg }] }>
      <BackHeader title="News" onBack={onClose} dark={dark} />
      <ScrollView style={{ padding: 16 }}>
        <Text style={[styles.big, { color: fg }]}>{item.title}</Text>
        <Text style={{ color: COLORS.amber, fontWeight: '900' }}>Source: {item.source} {item.date}</Text>
        <Text style={{ color: fg, fontSize: 16, marginTop: 16, lineHeight: 24 }}>{item.body}</Text>
        <ShareRow message={newsShareMessage(item)} shareLabel="Share app with this news" title="Share" />
      </ScrollView>
    </SafeAreaView>
  );
}

function TeamDetail({ team, onClose, dark }) {
  const fg = dark ? '#ffffff' : '#0f172a';
  const d = TEAM_DETAILS[team] || { players: [], achievements: [] };
  const [phase3PSStadiumImageUrl, setPhase3PSStadiumImageUrl] = useState('');

  useEffect(() => {
    let active = true;

    async function loadStadiumImage() {
      const localUrl = getPhase3PSImageFromDoc(d);
      if (localUrl && active) {
        setPhase3PSStadiumImageUrl(localUrl);
      }

      const ids = getPhase3PSStadiumDocIds(team, d);
      const collections = ['stadiums_2026', 'stadiums'];

      for (const collectionName of collections) {
        for (const id of ids) {
          try {
            const remote = await readDocCached(collectionName, id, COST_CONTROL.longCacheMs || COST_CONTROL.shortCacheMs);
            const remoteUrl = getPhase3PSImageFromDoc(remote);
            if (remoteUrl && active) {
              setPhase3PSStadiumImageUrl(remoteUrl);
              return;
            }
          } catch (e) {}
        }
      }
    }

    setPhase3PSStadiumImageUrl('');
    loadStadiumImage();

    return () => {
      active = false;
    };
  }, [team]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: dark ? COLORS.darkBg : COLORS.lightBg }] }>
      <BackHeader title={team} onBack={onClose} dark={dark} />
      <ScrollView style={{ padding: 16 }}>
        <Text style={{ fontSize: 48 }}>{FLAGS[team]}</Text>
        <Text style={[styles.big, { color: fg }]}>{team}</Text>
        <CoachCard team={team} dark={dark} fg={fg} />
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
          <Jersey color={d.homeJersey || '#ffffff'} label="Home jersey" />
          <Jersey color={d.awayJersey || COLORS.blue} label="Away jersey" />
        </View>
        <Text style={{ color: muted, marginBottom: 4 }}>Home: {d.homeJerseyDescription || 'Home jersey design pending verification.'}</Text>
        <Text style={{ color: muted, marginBottom: 10 }}>Away: {d.awayJerseyDescription || 'Away jersey design pending verification.'}</Text>
        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { marginBottom: 12 }]}>
          <Text style={[styles.sectionTitle, { color: fg }]}>Stadium</Text>
          <Text style={{ color: fg, fontWeight: '900' }}>{d.stadium || 'Stadium TBD'}</Text>
          <Text style={{ color: muted }}>{[d.stadiumCity, d.stadiumCountry].filter(Boolean).join(', ') || 'Location pending'}</Text>
          <Text style={{ color: muted }}>Capacity: {d.stadiumCapacity || 'TBD'}</Text>
          {phase3PSStadiumImageUrl ? (
            <Image
              source={{ uri: phase3PSStadiumImageUrl }}
              resizeMode="cover"
              style={{
                width: '100%',
                height: 170,
                borderRadius: 16,
                marginTop: 10,
                backgroundColor: dark ? '#020617' : '#e5e7eb',
              }}
              onError={() => setPhase3PSStadiumImageUrl('')}
            />
          ) : (
            <Text style={{ color: muted, marginTop: 6 }}>Stadium image will appear after admin adds a verified image URL.</Text>
          )}
        </View>
        <Text style={{ color: fg, lineHeight: 22 }}>{d.description}</Text>
        <Text style={{ color: muted, marginTop: 8 }}>{d.rosterStatus || d.sourceStatus || 'Roster pending verified import.'}</Text>
        <Text style={[styles.sectionTitle, { color: fg, marginTop: 16 }]}>Big achievements</Text>
        {d.achievements.map((x) => <Text key={x} style={{ color: fg }}>• {x}</Text>)}
        <Text style={[styles.sectionTitle, { color: fg, marginTop: 16 }]}>Players</Text>
        {d.players.map((p) => (
          <View key={`${team}-${p.number}`} style={[styles.playerCard, dark ? styles.cardDark : styles.cardLight]}>
            <View style={styles.fullPlayerPhoto}><Text style={{ fontSize: 58 }}>{p.photo}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.amber, fontWeight: '900' }}>#{p.number}</Text>
              <Text style={[styles.sectionTitle, { color: fg }]}>{p.name}</Text>
              <Text style={{ color: fg }}>Position: {p.position}</Text>
              <Text style={{ color: fg }}>Height / Weight: {p.height} / {p.weight}</Text>
              <Text style={{ color: fg }}>Education: {p.education}</Text>
              <Text style={{ color: fg }}>Languages: {p.languages}</Text>
              <Text style={{ color: fg }}>Achievements: {p.achievements}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function TopPredictors({ dark, fg, adSettings, profile }) {
  const [visibleCount, setVisibleCount] = useState(COST_CONTROL.leaderboardPageSize);
  const list = Array.from({ length: 50 }, (_, i) => ({ nick: `Predictor${i + 1}`, points: 120 - i * 2, correct: Math.max(1, 12 - (i % 7)), photo: AVATAR_OPTIONS[i % AVATAR_OPTIONS.length] }));
  const visibleList = list.slice(0, visibleCount);
  return (
    <ScrollView style={{ padding: 12 }}>
      <Text style={[styles.sectionTitle, { color: fg }]}>Top predictors</Text>
      
      <ShareRow message={leaderboardShareMessage(profile)} shareLabel="Share" title="Share leaderboard" />
      <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { flexDirection: 'row', alignItems: 'center', gap: 12, borderColor: COLORS.amber }]}>
        <Text style={{ fontSize: 34 }}>{getAvatar(profile)}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: fg, fontWeight: '900' }}>Your public leaderboard look</Text>
          <Text style={{ color: fg }}>{displayNick(profile)} avatar can be changed in Menu</Text>
        </View>
      </View>
      {visibleList.map((u, i) => (
        <React.Fragment key={u.nick}>
          <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}> 
            <Text style={{ color: COLORS.amber, fontWeight: '900' }}>#{i + 1}</Text>
            <Text style={{ fontSize: 28 }}>{u.photo}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: fg, fontWeight: '900' }}>{u.nick}</Text>
              <Text style={{ color: fg }}>{u.correct} correct {u.points} pts</Text>
            </View>
          </View>
          {(i + 1) % 3 === 0 && i !== visibleList.length - 1 && <AdBox dark={dark} tone={i} placement="top" adSettings={adSettings} />}
        </React.Fragment>
      ))}
      {visibleCount < list.length ? (
        <ButtonPill
          label={`Load ${Math.min(COST_CONTROL.leaderboardPageSize, list.length - visibleCount)} more predictors`}
          onPress={() => setVisibleCount(Math.min(list.length, visibleCount + COST_CONTROL.leaderboardPageSize))}
          color={COLORS.blue}
        />
      ) : null}
    </ScrollView>
  );
}

function SignInScreen({ dark, onBack, onSave, onEmailAuth, currentAccount }) {
  const fg = dark ? '#ffffff' : '#0f172a';
  const [p, setP] = useState({ email: currentAccount?.email || '', password: '', name: currentAccount?.name || '', nickname: currentAccount?.nickname || '', age: currentAccount?.age || '', sex: currentAccount?.sex || '', location: currentAccount?.country || currentAccount?.location || 'Auto-detected country only', avatar: getAvatar(currentAccount) });
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: dark ? COLORS.darkBg : COLORS.lightBg }] }>
      <BackHeader title="Sign in" onBack={onBack} dark={dark} />
      <ScrollView style={{ padding: 16 }}>
        <Text style={[styles.big, { color: fg }]}>Account</Text>
        <Text style={{ color: fg, marginBottom: 12 }}>Create an account or sign in to save your predictions, profile, and leaderboard progress. You can also continue as a guest.</Text>
        <Text style={[styles.sectionTitle, { color: fg, marginTop: 10 }]}>Email / Password</Text>
        {['email', 'password', 'name', 'nickname', 'age', 'sex'].map((key) => (
          <TextInput key={key} placeholder={key} placeholderTextColor="#94a3b8" secureTextEntry={key === 'password'} value={p[key] || ''} onChangeText={(v) => setP({ ...p, [key]: v })} style={[styles.input, dark ? styles.inputDark : styles.inputLight]} autoCapitalize={key === 'email' ? 'none' : 'sentences'} />
        ))}
        <ButtonPill label="Detect my country" onPress={() => setP({ ...p, location: 'United States' })} color={COLORS.amber} />
        <Text style={{ color: fg, marginTop: 8 }}>Country shown publicly: {p.location}</Text>
        <ButtonPill label="Create account" onPress={() => onEmailAuth(p, 'signup')} color={COLORS.green} />
        <ButtonPill label="Sign in" onPress={() => onEmailAuth(p, 'signin')} color={COLORS.blue} />
        <ButtonPill label="Continue as guest" onPress={() => onSave(p)} color="#64748b" />
      </ScrollView>
    </SafeAreaView>
  );
}

function AdminScreen({ dark, onClose, firebaseUser, admin, onAdSettingsSaved, onSponsorSaved }) {
  const fg = dark ? '#ffffff' : '#0f172a';
  const muted = dark ? '#cbd5e1' : '#475569';
  const inputStyle = [styles.input, dark ? styles.inputDark : styles.inputLight];

  const [sponsorForm, setSponsorForm] = useState({
    name: 'Hobbee.FUN',
    message: 'Visit Hobbee.FUN',
    callToAction: 'Visit Hobbee.FUN',
    linkUrl: 'https://hobbee.fun',
    logoUrl: '',
    logo: '',
    imageUrl: '',
    active: true,
    startDate: '',
    endDate: '',
    priority: '1',
  });

  const [matchForm, setMatchForm] = useState({
    matchId: '1',
    teamAScore: '0',
    teamBScore: '0',
    status: 'upcoming',
    minute: '',
    predictionLocked: false,
    notes: '',
  });

  const [newsForm, setNewsForm] = useState({
    newsId: '',
    title: '',
    source: 'Virtual Beehive Inc.',
    body: '',
    url: '',
    active: true,
    pinned: false,
  });

  const [imageForm, setImageForm] = useState({
    collection: 'stadiums',
    docId: '',
    imageUrl: '',
    stadiumImageUrl: '',
    coachImageUrl: '',
    playerImageUrl: '',
    jerseyHomeUrl: '',
    jerseyAwayUrl: '',
    notes: '',
  });

  const [adForm, setAdForm] = useState(DEFAULT_AD_SETTINGS);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    async function loadAdminSettings() {
      try {
        const remoteAds = await readDoc('appConfig', 'ads');
        if (remoteAds) setAdForm({ ...DEFAULT_AD_SETTINGS, ...remoteAds });
      } catch (e) {
        console.log('Admin ad settings load failed', e?.message || e);
      }

      try {
        const activeSponsor = await readDoc('sponsors', 'active');
        if (activeSponsor) {
          setSponsorForm((old) => ({
            ...old,
            ...activeSponsor,
            active: activeSponsor.active !== false,
            priority: String(activeSponsor.priority ?? old.priority ?? '1'),
          }));
        }
      } catch (e) {
        console.log('Admin sponsor load failed', e?.message || e);
      }
    }
    loadAdminSettings();
  }, []);

  async function requireAdmin() {
    if (!firebaseUser) {
      Alert.alert('Admin sign-in required', 'Please sign in with the approved admin account first.');
      return false;
    }

    if (admin === true) {
      return true;
    }

    try {
      const adminDoc = await readDoc('users', firebaseUser.uid);

      if (adminDoc?.isAdmin === true) {
        setAdmin(true);
        return true;
      }

      Alert.alert(
        'Admin access not found',
        `Signed in as: ${firebaseUser.email || 'unknown'}\nUID: ${firebaseUser.uid}\n\nIn Firebase Firestore, set users/${firebaseUser.uid}/isAdmin to Boolean true.`
      );
      return false;
    } catch (e) {
      console.log('Admin verification failed', e?.message || e);
      Alert.alert('Admin verification failed', String(e?.message || e));
      return false;
    }
  }

  async function logAdminAction(action, target, details = {}) {
    if (!firebaseUser) return;
    const id = `${Date.now()}_${String(firebaseUser.uid || 'admin').slice(0, 8)}`;
    try {
      await writeDoc('adminLogs', id, {
        id,
        action,
        target,
        details,
        note: adminNote || '',
        adminUid: firebaseUser.uid,
        adminEmail: firebaseUser.email || '',
        createdAt: serverTimestamp(),
      }, false);
    } catch (e) {
      console.log('Admin log failed', e?.message || e);
    }
  }

  async function saveSponsor() {
    if (!(await requireAdmin())) return;
    const payload = {
      name: sponsorForm.name || 'Sponsor',
      message: sponsorForm.message || '',
      callToAction: sponsorForm.callToAction || 'Learn More',
      linkUrl: sponsorForm.linkUrl || '',
      logoUrl: normalizeImageUrl(sponsorForm.logoUrl || sponsorForm.logo || sponsorForm.imageUrl || ''),
      logo: normalizeImageUrl(sponsorForm.logo || sponsorForm.logoUrl || sponsorForm.imageUrl || ''),
      imageUrl: normalizeImageUrl(sponsorForm.imageUrl || sponsorForm.logoUrl || sponsorForm.logo || ''),
      active: sponsorForm.active === true,
      startDate: sponsorForm.startDate || '',
      endDate: sponsorForm.endDate || '',
      priority: Number(sponsorForm.priority || 1),
      updatedBy: firebaseUser.uid,
      updatedAt: serverTimestamp(),
    };
    await writeDoc('sponsors', 'active', payload);
    if (onSponsorSaved) onSponsorSaved(payload);
    await logAdminAction('save_sponsor', 'sponsors/active', payload);
    Alert.alert('Sponsor saved', 'The active sponsor banner settings were saved to Firebase.');
  }

  async function saveMatchUpdate() {
    if (!(await requireAdmin())) return;
    const id = String(matchForm.matchId || '').trim();
    if (!id) { Alert.alert('Missing match ID', 'Enter a match number first.'); return; }
    const status = matchForm.status || 'upcoming';
    const predictionLocked = matchForm.predictionLocked === true || ['halftime', 'second_half', 'final'].includes(status);
    const payload = {
      matchId: id,
      teamAScore: Number(matchForm.teamAScore || 0),
      teamBScore: Number(matchForm.teamBScore || 0),
      status,
      minute: matchForm.minute || '',
      predictionLocked,
      notes: matchForm.notes || '',
      updatedBy: firebaseUser.uid,
      updatedAt: serverTimestamp(),
    };
    await writeDoc('matches', id, payload);
    await logAdminAction('save_match', `matches/${id}`, payload);
    Alert.alert('Match update saved', `Match #${id} was saved to Firebase.`);
  }

  async function saveNewsItem() {
    if (!(await requireAdmin())) return;
    if (!newsForm.title || !newsForm.body) { Alert.alert('Missing news info', 'Enter a title and full story.'); return; }
    const id = String(newsForm.newsId || '').trim() || `news_${Date.now()}`;
    const payload = {
      id,
      title: newsForm.title,
      source: newsForm.source || 'Virtual Beehive Inc.',
      body: newsForm.body,
      url: newsForm.url || '',
      active: newsForm.active === true,
      pinned: newsForm.pinned === true,
      updatedBy: firebaseUser.uid,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };
    await writeDoc('news', id, payload);
    await logAdminAction('save_news', `news/${id}`, payload);
    setNewsForm({ newsId: '', title: '', source: 'Virtual Beehive Inc.', body: '', url: '', active: true, pinned: false });
    Alert.alert('News saved', 'The news item was saved to Firebase.');
  }

  async function disableNewsItem() {
    if (!(await requireAdmin())) return;
    const id = String(newsForm.newsId || '').trim();
    if (!id) { Alert.alert('Missing news ID', 'Enter the News ID to disable an existing item.'); return; }
    const payload = { active: false, updatedBy: firebaseUser.uid, updatedAt: serverTimestamp() };
    await writeDoc('news', id, payload);
    await logAdminAction('disable_news', `news/${id}`, payload);
    Alert.alert('News disabled', `${id} is now inactive.`);
  }

  async function saveImageLinks() {
    if (!(await requireAdmin())) return;
    const collection = String(imageForm.collection || 'stadiums_2026').trim();
    const id = String(imageForm.docId || '').trim();
    if (!id) { Alert.alert('Missing document ID', 'Enter a stadium/team/player document ID.'); return; }
    const payload = {
      imageUrl: imageForm.imageUrl || imageForm.stadiumImageUrl || '',
      stadiumImageUrl: imageForm.stadiumImageUrl || imageForm.imageUrl || '',
      coachImageUrl: imageForm.coachImageUrl || '',
      playerImageUrl: imageForm.playerImageUrl || '',
      jerseyHomeUrl: imageForm.jerseyHomeUrl || '',
      jerseyAwayUrl: imageForm.jerseyAwayUrl || '',
      notes: imageForm.notes || '',
      updatedBy: firebaseUser.uid,
      updatedAt: serverTimestamp(),
    };
    await writeDoc(collection, id, payload);
    await logAdminAction('save_images', `${collection}/${id}`, payload);
    Alert.alert('Image links saved', `${collection}/${id} was saved to Firebase.`);
  }

  async function saveAdSettings() {
    if (!firebaseUser) {
      Alert.alert('Admin sign-in required', 'Please sign in with the approved admin account first.');
      return;
    }

    let freshAdmin = admin === true;

    try {
      const adminDoc = await readDoc('users', firebaseUser.uid);
      freshAdmin = freshAdmin || adminDoc?.isAdmin === true;

      if (!freshAdmin) {
        Alert.alert(
          'Admin access not found',
          `Signed in as: ${firebaseUser.email || 'unknown'}\nUID: ${firebaseUser.uid}\n\nIn Firebase Firestore, set users/${firebaseUser.uid}/isAdmin to Boolean true.`
        );
        return;
      }

      const payload = {
        adsEnabled: adForm.adsEnabled === true,
        useTestAds: adForm.useTestAds === true,
        nonPersonalized: adForm.nonPersonalized !== false,
        autoHideOnNoFill: adForm.autoHideOnNoFill !== false,
        updatedBy: firebaseUser.uid,
        updatedAt: serverTimestamp(),
      };

      await writeDoc('appConfig', 'ads', payload);
      if (onAdSettingsSaved) onAdSettingsSaved(payload);
      await logAdminAction('save_ad_settings', 'appConfig/ads', payload);
      Alert.alert('Ad settings saved', 'AdMob settings were saved and applied on this device.');
    } catch (e) {
      console.log('Ad settings save failed', e?.message || e);
      Alert.alert('Ad settings failed', String(e?.message || e));
    }
  }

  const StatusButton = ({ value, label }) => (
    <TouchableOpacity onPress={() => setMatchForm({ ...matchForm, status: value })} style={[styles.smallChip, matchForm.status === value ? styles.activeChip : null]}>
      <Text style={{ color: matchForm.status === value ? '#000' : fg, fontWeight: '900' }}>{label}</Text>
    </TouchableOpacity>
  );

  const ToggleButton = ({ label, active, onPress, color = COLORS.green }) => (
    <ButtonPill label={`${label}: ${active ? 'ON' : 'OFF'}`} onPress={onPress} color={active ? color : '#64748b'} />
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: dark ? COLORS.darkBg : COLORS.lightBg }] }>
      <BackHeader title="Admin Control Panel" onBack={onClose} dark={dark} />
      <ScrollView style={{ padding: 16 }} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={[styles.big, { color: fg }]}>Admin Control Panel</Text>
        <Text style={{ color: muted, marginBottom: 12 }}>Phase 2H adds stronger admin tools, active/inactive switches, manual match controls, content IDs, and admin activity logs.</Text>

        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.slate }] }>
          <Text style={[styles.sectionTitle, { color: fg }]}>Admin Note / Change Reason</Text>
          <Text style={{ color: muted, marginBottom: 8 }}>Optional note saved with admin logs. Example: sponsor updated before launch, corrected match status, added news.</Text>
          <TextInput placeholder="Admin note optional" placeholderTextColor="#94a3b8" value={adminNote} onChangeText={setAdminNote} style={inputStyle} />
        </View>

        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.amber }] }>
          <Text style={[styles.sectionTitle, { color: fg }]}>AdMob Display Control</Text>
          <Text style={{ color: muted, marginBottom: 8 }}>Controls Google ad placements without rebuilding. These switches now save to Firebase and apply immediately on this device after Save.</Text>
          <Text style={{ color: fg, fontWeight: '900', marginBottom: 8 }}>Current draft: Ads {adForm.adsEnabled ? 'ON' : 'OFF'} Test ads {adForm.useTestAds ? 'ON' : 'OFF'} Auto-hide {adForm.autoHideOnNoFill ? 'ON' : 'OFF'} Non-personalized {adForm.nonPersonalized ? 'ON' : 'OFF'}</Text>
          <ToggleButton label="Ads" active={adForm.adsEnabled} onPress={() => setAdForm({ ...adForm, adsEnabled: !adForm.adsEnabled })} />
          <ToggleButton label="Test ads" active={adForm.useTestAds} onPress={() => setAdForm({ ...adForm, useTestAds: !adForm.useTestAds })} color={COLORS.amber} />
          <ToggleButton label="Auto-hide empty ads" active={adForm.autoHideOnNoFill} onPress={() => setAdForm({ ...adForm, autoHideOnNoFill: !adForm.autoHideOnNoFill })} />
          <ToggleButton label="Non-personalized request" active={adForm.nonPersonalized} onPress={() => setAdForm({ ...adForm, nonPersonalized: !adForm.nonPersonalized })} color={COLORS.blue} />
          <ButtonPill label="Save ad settings" onPress={saveAdSettings} color={COLORS.green} />
        </View>

        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.green }] }>
          <Text style={[styles.sectionTitle, { color: fg }]}>Sponsor Manager Plus</Text>
          <ToggleButton label="Sponsor active" active={sponsorForm.active} onPress={() => setSponsorForm({ ...sponsorForm, active: !sponsorForm.active })} />
          <TextInput placeholder="Sponsor name" placeholderTextColor="#94a3b8" value={sponsorForm.name} onChangeText={(v)=>setSponsorForm({...sponsorForm,name:v})} style={inputStyle} />
          <TextInput placeholder="Sponsor message" placeholderTextColor="#94a3b8" value={sponsorForm.message} onChangeText={(v)=>setSponsorForm({...sponsorForm,message:v})} style={inputStyle} />
          <TextInput placeholder="Call to action" placeholderTextColor="#94a3b8" value={sponsorForm.callToAction} onChangeText={(v)=>setSponsorForm({...sponsorForm,callToAction:v})} style={inputStyle} />
          <TextInput placeholder="Link URL" placeholderTextColor="#94a3b8" value={sponsorForm.linkUrl} onChangeText={(v)=>setSponsorForm({...sponsorForm,linkUrl:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Logo URL optional" placeholderTextColor="#94a3b8" value={sponsorForm.logoUrl} onChangeText={(v)=>setSponsorForm({...sponsorForm,logoUrl:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Alternative logo field optional" placeholderTextColor="#94a3b8" value={sponsorForm.logo} onChangeText={(v)=>setSponsorForm({...sponsorForm,logo:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Image URL fallback optional" placeholderTextColor="#94a3b8" value={sponsorForm.imageUrl} onChangeText={(v)=>setSponsorForm({...sponsorForm,imageUrl:v})} style={inputStyle} autoCapitalize="none" />
          <Text style={{ color: muted, marginBottom: 8 }}>Logo tip: use a direct image URL ending in .png, .jpg, .jpeg, or .webp. Google Drive preview links may not display; this version tries to convert common Drive links automatically.</Text>
          <TextInput placeholder="Start date optional, example 2026-06-01" placeholderTextColor="#94a3b8" value={sponsorForm.startDate} onChangeText={(v)=>setSponsorForm({...sponsorForm,startDate:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="End date optional, example 2026-07-31" placeholderTextColor="#94a3b8" value={sponsorForm.endDate} onChangeText={(v)=>setSponsorForm({...sponsorForm,endDate:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Priority" placeholderTextColor="#94a3b8" value={sponsorForm.priority} onChangeText={(v)=>setSponsorForm({...sponsorForm,priority:v})} style={inputStyle} keyboardType="number-pad" />
          <ButtonPill label="Save active sponsor" onPress={saveSponsor} color={COLORS.green} />
        </View>

        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight] }>
          <Text style={[styles.sectionTitle, { color: fg }]}>Match Manager Plus</Text>
          <Text style={{ color: muted, marginBottom: 8 }}>Use for manual score/status override until live sports API is connected.</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            <StatusButton value="upcoming" label="Upcoming" />
            <StatusButton value="live" label="Live" />
            <StatusButton value="halftime" label="Halftime" />
            <StatusButton value="second_half" label="2nd Half" />
            <StatusButton value="final" label="Final" />
            <StatusButton value="postponed" label="Postponed" />
          </View>
          <ToggleButton label="Prediction locked" active={matchForm.predictionLocked} onPress={() => setMatchForm({ ...matchForm, predictionLocked: !matchForm.predictionLocked })} color={COLORS.red} />
          <TextInput placeholder="Match ID / number" placeholderTextColor="#94a3b8" value={matchForm.matchId} onChangeText={(v)=>setMatchForm({...matchForm,matchId:v})} style={inputStyle} keyboardType="number-pad" />
          <TextInput placeholder="Team A score" placeholderTextColor="#94a3b8" value={matchForm.teamAScore} onChangeText={(v)=>setMatchForm({...matchForm,teamAScore:v})} style={inputStyle} keyboardType="number-pad" />
          <TextInput placeholder="Team B score" placeholderTextColor="#94a3b8" value={matchForm.teamBScore} onChangeText={(v)=>setMatchForm({...matchForm,teamBScore:v})} style={inputStyle} keyboardType="number-pad" />
          <TextInput placeholder="Minute optional, example 32 or 90+4" placeholderTextColor="#94a3b8" value={matchForm.minute} onChangeText={(v)=>setMatchForm({...matchForm,minute:v})} style={inputStyle} />
          <TextInput placeholder="Admin match notes optional" placeholderTextColor="#94a3b8" value={matchForm.notes} onChangeText={(v)=>setMatchForm({...matchForm,notes:v})} style={inputStyle} />
          <ButtonPill label="Save match update" onPress={saveMatchUpdate} color={COLORS.blue} />
        </View>

        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight] }>
          <Text style={[styles.sectionTitle, { color: fg }]}>News Manager Plus</Text>
          <Text style={{ color: muted, marginBottom: 8 }}>Use News ID to update or disable an existing item. Leave blank to create a new item.</Text>
          <ToggleButton label="News active" active={newsForm.active} onPress={() => setNewsForm({ ...newsForm, active: !newsForm.active })} />
          <ToggleButton label="Pinned" active={newsForm.pinned} onPress={() => setNewsForm({ ...newsForm, pinned: !newsForm.pinned })} color={COLORS.amber} />
          <TextInput placeholder="News ID optional" placeholderTextColor="#94a3b8" value={newsForm.newsId} onChangeText={(v)=>setNewsForm({...newsForm,newsId:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="News title" placeholderTextColor="#94a3b8" value={newsForm.title} onChangeText={(v)=>setNewsForm({...newsForm,title:v})} style={inputStyle} />
          <TextInput placeholder="Source" placeholderTextColor="#94a3b8" value={newsForm.source} onChangeText={(v)=>setNewsForm({...newsForm,source:v})} style={inputStyle} />
          <TextInput placeholder="Full news story" placeholderTextColor="#94a3b8" value={newsForm.body} onChangeText={(v)=>setNewsForm({...newsForm,body:v})} style={[...inputStyle, { minHeight: 100, textAlignVertical: 'top' }]} multiline />
          <TextInput placeholder="Source URL optional" placeholderTextColor="#94a3b8" value={newsForm.url} onChangeText={(v)=>setNewsForm({...newsForm,url:v})} style={inputStyle} autoCapitalize="none" />
          <ButtonPill label="Save / update news item" onPress={saveNewsItem} color={COLORS.amber} />
          <ButtonPill label="Disable existing news ID" onPress={disableNewsItem} color={COLORS.red} />
        </View>

        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight] }>
          <Text style={[styles.sectionTitle, { color: fg }]}>Image URL Manager Plus</Text>
          <Text style={{ color: muted, marginBottom: 8 }}>Add direct image links for stadiums, teams, coaches, players, and jerseys without Firebase Storage. Use one document at a time, for example collection stadiums with doc ID metlife, or collection players with doc ID argentina_messi.</Text>
          <Text style={{ color: muted, marginBottom: 8 }}>Direct image URLs are best. Avoid Google Drive preview links unless converted to a direct view URL.</Text>
          <TextInput placeholder="Collection: stadiums_2026, teams_2026, players_2026, coaches_2026" placeholderTextColor="#94a3b8" value={imageForm.collection} onChangeText={(v)=>setImageForm({...imageForm,collection:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Document ID, example: metlife or argentina" placeholderTextColor="#94a3b8" value={imageForm.docId} onChangeText={(v)=>setImageForm({...imageForm,docId:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Main image URL" placeholderTextColor="#94a3b8" value={imageForm.imageUrl} onChangeText={(v)=>setImageForm({...imageForm,imageUrl:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Exact stadium image URL" placeholderTextColor="#94a3b8" value={imageForm.stadiumImageUrl} onChangeText={(v)=>setImageForm({...imageForm,stadiumImageUrl:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Exact coach image URL" placeholderTextColor="#94a3b8" value={imageForm.coachImageUrl} onChangeText={(v)=>setImageForm({...imageForm,coachImageUrl:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Exact player photo URL" placeholderTextColor="#94a3b8" value={imageForm.playerImageUrl} onChangeText={(v)=>setImageForm({...imageForm,playerImageUrl:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Home jersey URL" placeholderTextColor="#94a3b8" value={imageForm.jerseyHomeUrl} onChangeText={(v)=>setImageForm({...imageForm,jerseyHomeUrl:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Away jersey URL" placeholderTextColor="#94a3b8" value={imageForm.jerseyAwayUrl} onChangeText={(v)=>setImageForm({...imageForm,jerseyAwayUrl:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Image notes optional" placeholderTextColor="#94a3b8" value={imageForm.notes} onChangeText={(v)=>setImageForm({...imageForm,notes:v})} style={inputStyle} />
          <ButtonPill label="Save image links" onPress={saveImageLinks} color={COLORS.green} />
        </View>

        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
          
          <Text style={{ color: muted }}>Phase 2G keeps app-config and sponsor reads cached on the device, limits leaderboard loading, and avoids reading large prediction collections from the client.</Text>
          <Text style={{ color: muted, marginTop: 8 }}>Recommended Firebase budget alerts: $5, $10, $25, $50, $100.</Text>
          <Text style={{ color: muted, marginTop: 8 }}>Future real leaderboard should read only summary docs, not every prediction document.</Text>
        </View>

        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.blue }] }>
          <Text style={[styles.sectionTitle, { color: fg }]}>Admin Logs</Text>
          <Text style={{ color: muted }}>Every save action now writes to adminLogs with admin UID, email, action, target document, timestamp, and optional note. This helps track future changes without adding a separate admin website yet.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AvatarPicker({ dark, fg, profile = {}, onPick }) {
  const selectedAvatar = getAvatar(profile);
  return (
    <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.amber }]}>
      <Text style={[styles.sectionTitle, { color: fg }]}>Choose Your Avatar</Text>
      <Text style={{ color: fg, marginBottom: 10 }}>
        Pick a built-in avatar for your profile and leaderboard. No photo upload or phone media permission is needed.
      </Text>
      <View style={styles.avatarGrid}>
        {AVATAR_OPTIONS.map((avatar) => {
          const selected = avatar === selectedAvatar;
          return (
            <TouchableOpacity
              key={avatar}
              onPress={() => onPick(avatar)}
              style={[styles.avatarChoice, selected ? styles.avatarChoiceSelected : null]}
            >
              <Text style={{ fontSize: 30 }}>{avatar}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function NotificationSettingsCard({ dark, fg }) {
  const [prefs, setPrefs] = useState(DEFAULT_NOTIFICATION_PREFS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    loadNotificationPrefs().then((stored) => {
      if (!active) return;
      setPrefs(stored);
      setLoaded(true);
    });
    return () => { active = false; };
  }, []);

  const togglePref = async (key) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    await saveNotificationPrefs(next);
  };

  const rows = [
    ['matchReminders', 'Match reminders', 'Remind me before important WorldCup matches.'],
    ['predictionReminders', 'Prediction reminders', 'Remind me to make predictions before matches lock.'],
    ['resultAlerts', 'Prediction result alerts', 'Notify me when match results are available.'],
    ['leaderboardAlerts', 'Leaderboard updates', 'Notify me about leaderboard movement.'],
    ['sponsorUpdates', 'Sponsor and app updates', 'Optional updates from sponsors or Virtual Beehive Inc.'],
  ];

  return (
    <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.amber }]}>
      <Text style={[styles.sectionTitle, { color: fg }]}>Settings</Text>
      
      {rows.map(([key, label, help]) => (
        <TouchableOpacity
          key={key}
          onPress={() => togglePref(key)}
          style={{
            borderWidth: 1,
            borderColor: prefs[key] ? COLORS.green : '#475569',
            borderRadius: 14,
            padding: 10,
            marginTop: 8,
            backgroundColor: prefs[key] ? 'rgba(34,197,94,0.12)' : 'transparent',
          }}
        >
          <Text style={{ color: fg, fontWeight: '900' }}>{prefs[key] ? 'ON' : 'OFF'} {label}</Text>
          <Text style={{ color: fg, opacity: 0.85, marginTop: 3 }}>{help}</Text>
        </TouchableOpacity>
      ))}
      <Text style={{ color: COLORS.blue, fontWeight: '900', marginTop: 10 }}>
        notification preferences
      </Text>
    </View>
  );
}

function MenuScreen({ dark, fg, profile = {}, saveAccount, admin, onClose, firebaseUser, onOpenSignIn, onSignOut, onOpenAdmin }) {
  const safeAccount = profile && typeof profile === 'object' ? profile : {};
  const signedIn = !!firebaseUser || !!safeAccount?.email;
  const profileName = safeText(safeAccount?.name, signedIn ? 'Signed in user' : 'Not signed in');
  const profileNickname = safeText(safeAccount?.nickname, 'Not set');
  const profileAge = safeText(safeAccount?.age, 'Not set');
  const profileSex = safeText(safeAccount?.sex, 'Not set');
  const profileCountry = safeText(safeAccount?.country || safeAccount?.location, 'Not detected');
  const profileAvatar = getAvatar(safeAccount);
  const inviteMessage = appInviteShareMessage(safeAccount);
  const chooseAvatar = async (avatar) => {
    await saveAccount({ ...safeAccount, avatar, avatarEmoji: avatar });
    Alert.alert('Avatar saved', `${avatar} is now your profile avatar.`);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: dark ? COLORS.darkBg : COLORS.lightBg }]}>
      <BackHeader title="Menu" onBack={onClose} dark={dark} />
      <ScrollView style={{ padding: 16 }} contentContainerStyle={{ paddingBottom: 30 }}>
        {!signedIn ? (
          <ButtonPill label="Sign in" onPress={onOpenSignIn} color={COLORS.green} />
        ) : (
          <ButtonPill label="Sign out" onPress={onSignOut} color="#64748b" />
        )}
        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.big, { color: fg }]}>Account</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Text style={{ fontSize: 42 }}>{profileAvatar}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: fg, fontWeight: '900' }}>Public avatar</Text>
              <Text style={{ color: fg }}>Shown on profile and leaderboard.</Text>
            </View>
          </View>
          <Text style={{ color: fg }}>Name: {profileName}</Text>
          <Text style={{ color: fg }}>Nickname: {profileNickname}</Text>
          <Text style={{ color: fg }}>Age: {profileAge}</Text>
          <Text style={{ color: fg }}>Sex: {profileSex}</Text>
          <Text style={{ color: fg }}>Country: {profileCountry}</Text>
          <Text style={{ color: fg }}>Account status: {firebaseUser ? 'Signed in online' : 'Local/guest mode'}</Text>
          <Text style={{ color: COLORS.green, marginTop: 8, fontWeight: '900' }}>notification preferences</Text>
        </View>
        <AvatarPicker dark={dark} fg={fg} profile={safeAccount} onPick={chooseAvatar} />
        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.blue }]}>
          <Text style={[styles.sectionTitle, { color: fg }]}>Invite Friends</Text>
          
          <ShareRow message={inviteMessage} shareLabel="Share" title="Invite friends" />
        </View>
        <NotificationSettingsCard dark={dark} fg={fg} />
        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.sectionTitle, { color: fg }]}>Privacy & Account</Text>
          
          <ButtonPill label="Privacy Policy" onPress={() => openExternalUrl(PRIVACY_POLICY_URL)} color={COLORS.blue} />
          <ButtonPill label="Terms of Use" onPress={() => openExternalUrl(TERMS_URL)} color={COLORS.amber} />
        </View>

        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.red }] }>
          <Text style={[styles.sectionTitle, { color: fg }]}>Delete Account / Data</Text>
          
          <ButtonPill label="Delete Account / Data" onPress={() => openExternalUrl(DELETE_ACCOUNT_URL)} color={COLORS.red} />
          <ButtonPill label="Email deletion request" onPress={() => emailDeleteRequest(safeAccount)} color={COLORS.amber} />
          <ButtonPill label="

" onPress={() => copyShareMessage(deleteAccountRequestMessage(safeAccount))} color={COLORS.blue} />
        </View>
        {admin ? (
          <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.green }]}>
            <Text style={[styles.sectionTitle, { color: fg }]}>Hidden Admin</Text>
            <Text style={{ color: fg }}>Admin access is enabled for this account.</Text>
            <Text style={{ color: fg, marginBottom: 8 }}>Tap the button below to open the admin tools. A quick admin button also appears on the main screen while you are signed in as admin.</Text>
            <ButtonPill label="Open Admin Control Panel" onPress={onOpenAdmin} color={COLORS.green} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  const [phase3PNCountdown, setPhase3PNCountdown] = useState(phase3PNFormatCountdown());

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase3PNCountdown(phase3PNFormatCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState('matches');
  const [selected, setSelected] = useState(null);
  const [teamOpen, setTeamOpen] = useState(null);
  const [newsOpen, setNewsOpen] = useState(null);
  const [menu, setMenu] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [predictions, setPredictions] = useState({});
  const [bestPlayers, setBestPlayers] = useState({});
  const [bestPlayerPollSummaries, setBestPlayerPollSummaries] = useState({});
  const [champion, setChampion] = useState(null);
  const [profile, setAccount] = useState({ email: '', password: '', name: '', nickname: '', age: '', sex: '', location: '', country: '', avatar: '⚽', avatarEmoji: '⚽' });
  const [admin, setAdmin] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [sponsor, setSponsor] = useState(null);
  const [adSettings, setAdSettings] = useState(DEFAULT_AD_SETTINGS);
  const fg = dark ? '#ffffff' : '#0f172a';
  const bg = dark ? COLORS.darkBg : COLORS.lightBg;

  useEffect(() => {
    async function load() {
      const p = await AsyncStorage.getItem('predictions');
      const c = await AsyncStorage.getItem('champion');
      const pr = await AsyncStorage.getItem('profile');
      const bp = await AsyncStorage.getItem('bestPlayers');
      if (p) setPredictions(JSON.parse(p));
      if (c) setChampion(c);
      if (bp) setBestPlayers(JSON.parse(bp));
      if (pr) {
        const parsed = JSON.parse(pr);
        setAccount(parsed);
        setAdmin(parsed.isAdmin === true);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) return;
      try {
        const data = await readDoc('users', user.uid);
        if (data) {
          const merged = { ...data, email: user.email || data.email || '' };
          setAccount(merged);
          setAdmin(data.isAdmin === true);
          await AsyncStorage.setItem('profile', JSON.stringify(merged));
        }
      } catch (e) {
        console.log('Auth profile load failed', e?.message || e);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    async function loadSponsor() {
      try {
        const active = await readDocCached('sponsors', 'active', COST_CONTROL.sponsorCacheMs);
        if (active) setSponsor(active);
      } catch (e) {
        console.log('Sponsor load failed', e?.message || e);
      }
    }
    loadSponsor();
  }, []);

  useEffect(() => {
    async function loadAdSettings() {
      try {
        const remote = await readDocCached('appConfig', 'ads', COST_CONTROL.adConfigCacheMs);
        if (remote) setAdSettings({ ...DEFAULT_AD_SETTINGS, ...remote });
      } catch (e) {
        console.log('Ad settings load failed', e?.message || e);
      }
    }
    loadAdSettings();
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (adminOpen) { setAdminOpen(false); return true; }
      if (authOpen) { setAuthOpen(false); return true; }
      if (menu) { setMenu(false); return true; }
      if (newsOpen) { setNewsOpen(null); return true; }
      if (teamOpen) { setTeamOpen(null); return true; }
      if (selected) { setSelected(null); return true; }
      return false;
    });
    return () => sub.remove();
  }, [adminOpen, authOpen, menu, newsOpen, teamOpen, selected]);

  async function savePrediction(id, a, b) {
    const savedAt = new Date().toISOString();
    const next = { ...predictions, [String(id)]: { a, b, savedAt } };
    setPredictions(next);
    await AsyncStorage.setItem('predictions', JSON.stringify(next));
    if (firebaseUser) {
      await writeDoc('predictions', `${id}_${firebaseUser.uid}`, {
        matchId: String(id),
        userId: firebaseUser.uid,
        teamAScore: a,
        teamBScore: b,
        updatedAt: serverTimestamp(),
      });
      Alert.alert('Prediction saved online', `Your prediction ${a} - ${b} was saved online.`);
    } else {
      Alert.alert('Prediction saved locally', `Your prediction ${a} - ${b} was saved on this phone. Sign in to save online.`);
    }
  }

  async function saveBestPlayer(id, playerName) {
    const next = { ...bestPlayers, [String(id)]: playerName };
    setBestPlayers(next);
    await AsyncStorage.setItem('bestPlayers', JSON.stringify(next));
    if (firebaseUser) {
      await writeDoc('bestPlayerVotes', `${id}_${firebaseUser.uid}`, { matchId: String(id), userId: firebaseUser.uid, playerName, updatedAt: serverTimestamp() });
      setTimeout(async () => {
        try {
          const summary = await readDoc('bestPlayerPollSummary', String(id));
          if (summary) {
            setBestPlayerPollSummaries((prev) => ({ ...prev, [String(id)]: summary }));
          }
        } catch (e) {
          console.log('bestPlayerPollSummary refresh failed', e?.message || e);
        }
      }, 1800);
      Alert.alert('Fan Player Poll saved online', `${playerName} selected as your fan best player of the game.`);
    } else {
      Alert.alert('Fan Player Poll saved locally', `${playerName} selected. Sign in to save online.`);
    }
  }

  async function chooseChampion(team) {
    if (champion) {
      Alert.alert('Champion locked', `You already confirmed ${champion}.`);
      return;
    }
    Alert.alert('Confirm champion', `Choose ${team} as your champion? This can be selected only once.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: async () => { setChampion(team); await AsyncStorage.setItem('champion', team); if (firebaseUser) { await writeDoc('championPicks', firebaseUser.uid, { userId: firebaseUser.uid, team, createdAt: serverTimestamp() }, false); } } },
    ]);
  }

  async function saveAccount(p) {
    const clean = { ...p, country: p.country || p.location || 'United States' };
    setAccount(clean);
    await AsyncStorage.setItem('profile', JSON.stringify(clean));
    if (firebaseUser) {
      const profileDoc = {
        email: firebaseUser.email || clean.email || '',
        name: clean.name || '',
        nickname: clean.nickname || '',
        age: clean.age || '',
        sex: clean.sex || '',
        country: clean.country || 'United States',
        avatar: getAvatar(clean),
        avatarEmoji: getAvatar(clean),
        photoUrl: clean.photoUrl || '',
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };
      await writeDoc('users', firebaseUser.uid, profileDoc);
      const latest = await readDoc('users', firebaseUser.uid);
      if (latest?.isAdmin === true) setAdmin(true);
      Alert.alert('Account saved online', 'Your profile was saved online.');
    } else {
      Alert.alert('Account saved locally', 'Sign in to save this profile online.');
    }
  }

  async function handleEmailAuth(p, mode) {
    if (!p.email || !p.password) {
      Alert.alert('Missing info', 'Please enter email and password.');
      return false;
    }

    const cleanEmail = String(p.email).trim().toLowerCase();

    try {
      const cred = mode === 'signup'
        ? await createUserWithEmailAndPassword(auth, cleanEmail, p.password)
        : await signInWithEmailAndPassword(auth, cleanEmail, p.password);

      const user = cred.user;
      setFirebaseUser(user);

      let latest = null;
      try {
        const existing = await readDoc('users', user.uid);
        if (!existing) {
          await writeDoc('users', user.uid, {
            email: user.email || cleanEmail,
            name: p.name || '',
            nickname: p.nickname || '',
            age: p.age || '',
            sex: p.sex || '',
            country: p.location || 'United States',
            avatar: getAvatar(p),
            avatarEmoji: getAvatar(p),
            photoUrl: '',
            isAdmin: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          });
        } else {
          await writeDoc('users', user.uid, { lastLoginAt: serverTimestamp() });
        }
        latest = await readDoc('users', user.uid);
      } catch (profileError) {
        console.log('Firebase profile/admin check failed', profileError?.message || profileError);
        latest = { email: user.email || cleanEmail, name: p.name || '', nickname: p.nickname || '', country: p.location || 'United States', avatar: getAvatar(p), avatarEmoji: getAvatar(p), isAdmin: false };
      }

      const merged = {
        ...(latest || {}),
        email: user.email || cleanEmail,
        name: latest?.name || p.name || '',
        nickname: latest?.nickname || p.nickname || '',
        country: latest?.country || p.location || 'United States',
        avatar: getAvatar(latest || p),
        avatarEmoji: getAvatar(latest || p),
      };

      setAccount(merged);
      setAdmin(merged?.isAdmin === true);
      await AsyncStorage.setItem('profile', JSON.stringify(merged));

      Alert.alert(
        mode === 'signup' ? 'Account created' : 'Signed in',
        merged?.isAdmin ? 'Admin access enabled.' : 'Account is connected.'
      );
      return true;
    } catch (e) {
      console.log('Sign-in error', e?.code, e?.message || e);
      Alert.alert('Sign-in error', e?.message || 'Unable to sign in.');
      return false;
    }
  }

  async function handleSignOut() {
    try { await signOut(auth); } catch (e) { console.log(e?.message || e); }
    setFirebaseUser(null);
    setAdmin(false);
    setAccount({ email: '', password: '', name: '', nickname: '', age: '', sex: '', location: '', country: '' });
    await AsyncStorage.removeItem('profile');
    Alert.alert('Signed out', 'You are now signed out.');
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: bg }] }>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Header dark={dark} fg={fg} setDark={setDark} setMenu={setMenu} />
      <SponsorBanner dark={dark} sponsor={sponsor} />
      {admin ? (
        <TouchableOpacity onPress={() => setAdminOpen(true)} style={{ marginHorizontal: 14, marginTop: 8, marginBottom: 4, padding: 12, borderRadius: 14, backgroundColor: COLORS.green, alignItems: 'center' }}>
          <Text style={{ color: '#000000', fontWeight: '900' }}>Open Admin Control Panel</Text>
        </TouchableOpacity>
      ) : null}
      <View style={{ flex: 1 }}>
        {tab === 'matches' && <Matches dark={dark} fg={fg} predictions={predictions} setSelected={setSelected} adSettings={adSettings} />}
        {tab === 'groups' && <Groups dark={dark} fg={fg} champion={champion} chooseChampion={chooseChampion} setTeamOpen={setTeamOpen} adSettings={adSettings} profile={profile} />}
        {tab === 'news' && <News dark={dark} fg={fg} setNewsOpen={setNewsOpen} adSettings={adSettings} />}
        {tab === 'top' && <TopPredictors dark={dark} fg={fg} adSettings={adSettings} profile={profile} />}
      </View>
      <View style={[styles.nav, dark ? { backgroundColor: '#111827' } : { backgroundColor: '#ffffff' }] }>
        {[['matches', 'Matches'], ['groups', 'Groups'], ['news', 'News'], ['top', 'Top']].map(([key, label]) => (
          <TouchableOpacity key={key} onPress={() => setTab(key)} style={[styles.navBtn, tab === key && { backgroundColor: COLORS.amber }]}>
            <Text style={{ fontWeight: '900', color: tab === key ? '#000000' : fg }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        <MatchDetail match={selected} onClose={() => setSelected(null)} dark={dark} predictions={predictions} savePrediction={savePrediction} setTeamOpen={setTeamOpen} bestPlayers={bestPlayers} bestPlayerPollSummaries={bestPlayerPollSummaries} saveBestPlayer={saveBestPlayer} adSettings={adSettings} profile={profile} />
      </Modal>
      <Modal visible={!!teamOpen} animationType="slide" onRequestClose={() => setTeamOpen(null)}>
        <TeamDetail team={teamOpen} onClose={() => setTeamOpen(null)} dark={dark} />
      </Modal>
      <Modal visible={!!newsOpen} animationType="slide" onRequestClose={() => setNewsOpen(null)}>
        <NewsDetail item={newsOpen} onClose={() => setNewsOpen(null)} dark={dark} />
      </Modal>
      <Modal visible={menu} animationType="slide" onRequestClose={() => setMenu(false)}>
        <MenuScreen
          dark={dark}
          fg={fg}
          profile={profile || {}}
          saveAccount={saveAccount}
          admin={admin}
          firebaseUser={firebaseUser}
          onOpenSignIn={() => {
            setMenu(false);
            setTimeout(() => setAuthOpen(true), 250);
          }}
          onSignOut={handleSignOut}
          onOpenAdmin={() => { setMenu(false); setTimeout(() => setAdminOpen(true), 250); }}
          onClose={() => setMenu(false)}
        />
      </Modal>
      <Modal visible={adminOpen} animationType="slide" onRequestClose={() => setAdminOpen(false)}>
        <AdminScreen
          dark={dark}
          admin={admin}
          firebaseUser={firebaseUser}
          onClose={() => setAdminOpen(false)}
          onAdSettingsSaved={(settings) => setAdSettings({ ...DEFAULT_AD_SETTINGS, ...(settings || {}) })}
          onSponsorSaved={(nextSponsor) => setSponsor(nextSponsor)}
        />
      </Modal>
      <Modal visible={authOpen} animationType="slide" onRequestClose={() => setAuthOpen(false)}>
        <SignInScreen
          dark={dark}
          currentAccount={profile || {}}
          onEmailAuth={async (p, mode) => {
            const ok = await handleEmailAuth(p, mode);
            if (ok) {
              setAuthOpen(false);
              setTimeout(() => setMenu(true), 350);
            }
          }}
          onBack={() => setAuthOpen(false)}
          onSave={async (p) => {
            await saveAccount(p);
            setAuthOpen(false);
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { minHeight: 126, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  backHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  backButton: { backgroundColor: COLORS.amber, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  headerTitle: { flex: 1, fontSize: 27, fontWeight: '900' },
  logo: { width: 74, height: 74, borderRadius: 26 },
  iconBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  tiny: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  title: { fontSize: 17, fontWeight: '900', lineHeight: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 8 },
  big: { fontSize: 20, fontWeight: '900', marginBottom: 8 },
  matchesTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  matchesTitle: { fontSize: 20, fontWeight: '900' },
  matchesHelp: { marginBottom: 8, fontSize: 13, lineHeight: 18 },
  bouncingBall: { fontSize: 22 },
  nav: { flexDirection: 'row', gap: 4, padding: 8, borderTopWidth: 1, borderTopColor: '#1e293b' },
  navBtn: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 14 },
  card: { borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1 },
  matchCard: { borderRadius: 18, padding: 14, marginBottom: 10, borderWidth: 1 },
  cardDark: { backgroundColor: COLORS.darkCard, borderColor: COLORS.slate },
  cardLight: { backgroundColor: COLORS.lightCard, borderColor: '#e2e8f0' },
  matchTeams: { fontSize: 18, fontWeight: '900', marginVertical: 6 },
  input: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10 },
  inputDark: { backgroundColor: '#0f172a', borderColor: COLORS.slate, color: '#ffffff' },
  inputLight: { backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#111827' },
  btn: { backgroundColor: COLORS.amber, padding: 10, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8, flex: 1 },
  btnText: { fontWeight: '900', color: '#000000', textAlign: 'center' },
  disabled: { opacity: 0.45 },

  celebrationCard: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', borderWidth: 2, borderColor: '#fbbf24', borderRadius: 18, padding: 14, marginTop: 14, backgroundColor: 'rgba(251,191,36,0.14)' },
  celebrationEmoji: { fontSize: 42 },
  celebrationTitle: { color: '#fbbf24', fontSize: 18, fontWeight: '900', marginBottom: 4 },
  celebration: { color: '#22c55e', fontWeight: '900', marginTop: 6 },
  shareBox: { borderWidth: 1, borderColor: '#38bdf8', borderRadius: 14, padding: 10, marginTop: 12, marginBottom: 8, backgroundColor: 'rgba(56,189,248,0.08)' },
  shareHint: { color: '#38bdf8', fontWeight: '800', marginBottom: 4, fontSize: 12 },
  shareRow: { flexDirection: 'row', gap: 8, alignItems: 'stretch', marginTop: 2 },
  sponsor: { minHeight: 96, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14, overflow: 'hidden', borderBottomWidth: 1, borderBottomColor: COLORS.slate },
  sponsorLogo: { width: 92, height: 92, borderRadius: 14, backgroundColor: '#ffffff' },
  sponsorLogoFallback: { width: 74, height: 60, borderRadius: 14, borderWidth: 1, borderColor: COLORS.amber, alignItems: 'center', justifyContent: 'center' },
  sponsorLabel: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  sponsorName: { fontWeight: '900', fontSize: 18, lineHeight: 22 },
  sponsorText: { fontWeight: '800', fontSize: 20, color: COLORS.amber, width: 760, marginTop: 2 },
  adBox: { height: 58, borderWidth: 1, borderStyle: 'dashed', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginVertical: 10, overflow: 'hidden' },
  hiddenAdProbe: { height: 1, opacity: 0, overflow: 'hidden' },
  stepper: { flex: 1, alignItems: 'center', backgroundColor: '#02061788', padding: 10, borderRadius: 14 },
  stepperLabel: { fontWeight: '900', color: COLORS.amber, textAlign: 'center' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  scoreText: { fontSize: 30, fontWeight: '900', color: '#ffffff' },
  blackBox: { backgroundColor: '#020617', padding: 12, borderRadius: 14, marginTop: 12 },
  blackTitle: { color: COLORS.amber, fontWeight: '900', textAlign: 'center' },
  blackScore: { color: '#ffffff', fontSize: 20, fontWeight: '900', textAlign: 'center', marginTop: 4 },
  blackSmall: { color: '#94a3b8', fontSize: 11, textAlign: 'center' },
  stadiumHero: { minHeight: 170, borderRadius: 22, overflow: 'hidden', marginBottom: 12, borderWidth: 1, borderColor: COLORS.amber },
  stadiumEmoji: { position: 'absolute', right: 18, top: 8, fontSize: 94, opacity: 0.28 },
  stadiumOverlay: { flex: 1, justifyContent: 'flex-end', padding: 16, backgroundColor: '#02061788' },
  stadiumTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  stadiumText: { color: '#e2e8f0', fontSize: 14, marginTop: 2 },
  bestPlayerPill: { borderWidth: 1, borderColor: COLORS.slate, borderRadius: 14, padding: 8 },
  jerseyWrap: { alignItems: 'center', marginBottom: 8 },
  jersey: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.slate },
  jerseyLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '800' },
  coachCard: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: 14, marginBottom: 8 },
  playerMini: { marginTop: 8, padding: 8, borderWidth: 1, borderColor: COLORS.slate, borderRadius: 12 },
  playerCard: { flexDirection: 'row', gap: 12, borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1 },
  fullPlayerPhoto: { width: 86, minHeight: 150, borderRadius: 16, backgroundColor: '#020617', alignItems: 'center', justifyContent: 'center' },
  groupGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  groupBox: { width: '48.5%', borderRadius: 16, padding: 10, marginBottom: 10, borderWidth: 1 },
  groupHeader: { backgroundColor: '#064e3b', color: '#ffffff', fontWeight: '900', padding: 6, borderRadius: 8, marginBottom: 6, textAlign: 'center' },
  groupTeamRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, borderRadius: 10, paddingHorizontal: 4 },
  groupTeamSelected: { backgroundColor: '#fbbf2422', borderWidth: 1, borderColor: COLORS.amber },
  championBadge: { color: COLORS.amber, fontSize: 18, fontWeight: '900' },
  bracketBox: { borderRadius: 18, padding: 12, marginBottom: 18, borderWidth: 1 },
  bracketLandscape: { alignItems: 'center', paddingVertical: 6, paddingHorizontal: 2, gap: 8 },
  bracketColumn: { width: 150, gap: 6 },
  bracketColumnTitle: { color: COLORS.amber, fontWeight: '900', textAlign: 'center', marginBottom: 4 },
  bracketSlotCard: { backgroundColor: '#064e3b', borderRadius: 10, padding: 7, minHeight: 58, borderWidth: 1, borderColor: '#16a34a' },
  bracketSlotTitle: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  bracketFlagRow: { flexDirection: 'row', gap: 2, marginVertical: 3, flexWrap: 'wrap' },
  bracketFlag: { fontSize: 16 },
  bracketHelper: { fontSize: 9, opacity: 0.82 },
  bracketConnectorColumn: { width: 86, gap: 28, alignItems: 'center', justifyContent: 'center' },
  bracketAdvance: { backgroundColor: '#0f172a', color: '#ffffff', fontWeight: '900', borderRadius: 10, paddingVertical: 9, paddingHorizontal: 8, borderWidth: 1, borderColor: COLORS.slate, textAlign: 'center', minWidth: 66 },
  bracketAdvanceTall: { paddingVertical: 24, borderColor: COLORS.amber },
  trophyCenterLarge: { width: 130, minHeight: 210, borderRadius: 22, backgroundColor: '#020617', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.amber, padding: 10 },
  trophyText: { color: COLORS.amber, fontWeight: '900', textAlign: 'center' },
  trophySub: { color: '#e2e8f0', fontSize: 11, fontWeight: '800', textAlign: 'center' },
  finalCupLine: { width: 54, height: 2, backgroundColor: COLORS.amber, marginVertical: 8 },
  bracketRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bracketSide: { flex: 1, gap: 6 },
  bracketMatch: { backgroundColor: '#064e3b', color: '#ffffff', fontWeight: '900', paddingVertical: 5, paddingHorizontal: 6, borderRadius: 6, fontSize: 11 },
  trophyCenter: { width: 90, alignItems: 'center', justifyContent: 'center' },

  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  avatarChoice: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#475569',
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
  },
  avatarChoiceSelected: {
    borderColor: '#fbbf24',
    backgroundColor: 'rgba(251, 191, 36, 0.22)',
  },

});

// PHASE_3DB_WIRING_NOTE:
// To wire the final delete button, call this from the Menu delete-account section:
// phase3DBDeleteAccount({ auth, db, user, clearLocalAccount: async () => {}, afterDeleted: () => {} })
// Replace auth/db/user names if this App.js uses different variable names.

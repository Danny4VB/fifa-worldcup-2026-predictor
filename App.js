import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  BackHandler,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

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

function getAdUnitId(placement = 'matches', settings = DEFAULT_AD_SETTINGS) {
  if (settings?.useTestAds) return TestIds.BANNER;
  return ADMOB_AD_UNITS[placement] || ADMOB_AD_UNITS.matches;
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

async function writeDoc(path, id, data, merge = true) {
  await setDoc(doc(db, path, id), data, { merge });
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
        stage: 'Group Stage',
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
  { id: 2, title: 'Fans can start preparing predictions', source: 'Virtual Beehive Inc.', date: '2026', body: 'Users can select matches, make score predictions, choose a champion once, and select a best player of the game. In this local preview, predictions are saved on the phone.' },
  { id: 3, title: 'Sponsor banner ready for Hobbee.FUN', source: 'Virtual Beehive Inc.', date: '2026', body: 'The sponsor banner is built as a moving banner and can later be controlled from the hidden admin tools or backend sponsor manager.' },
];

function fmtDate(iso) {
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function matchStatus(match) {
  const now = new Date();
  const start = new Date(match.dateTime);
  const lock = new Date(start.getTime() + 45 * 60 * 1000);
  const finish = new Date(start.getTime() + 120 * 60 * 1000);
  const raw = String(match.adminStatus || match.status || '').toLowerCase();
  if (['final', 'finished', 'fulltime', 'full-time'].includes(raw)) {
    return { label: 'Final', bucket: 'finished', color: '#94a3b8', locked: true, left: 0, prompt: 'Match finished. Prediction closed.' };
  }
  if (['halftime', 'half-time', 'secondhalf', 'second-half', 'locked'].includes(raw)) {
    return { label: raw.includes('half') ? 'Halftime / Locked' : 'Locked', bucket: 'locked', color: COLORS.amber, locked: true, left: 0, prompt: 'Prediction locked after halftime.' };
  }
  if (['live', 'firsthalf', 'first-half'].includes(raw)) {
    return { label: 'Live 1st Half', bucket: 'live', color: COLORS.green, locked: false, left: Math.max(0, lock - now), prompt: 'Prediction closes at halftime.' };
  }
  if (now < start) return { label: 'Upcoming', bucket: 'upcoming', color: COLORS.amber, locked: false, left: start - now, prompt: 'Prediction open until kickoff and first half.' };
  if (now >= start && now < lock) return { label: 'Live 1st Half', bucket: 'live', color: COLORS.green, locked: false, left: lock - now, prompt: 'Prediction closes at halftime.' };
  if (now >= lock && now < finish) return { label: 'Locked', bucket: 'locked', color: '#64748b', locked: true, left: 0, prompt: 'Prediction locked after halftime.' };
  return { label: 'Final', bucket: 'finished', color: '#94a3b8', locked: true, left: 0, prompt: 'Match finished. Prediction closed.' };
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


function applyMatchOverrides(fixtures, overrides = {}) {
  return fixtures.map((match) => {
    const override = overrides[String(match.id)] || {};
    const hasScoreA = override.teamAScore !== undefined || override.scoreA !== undefined;
    const hasScoreB = override.teamBScore !== undefined || override.scoreB !== undefined;
    const scoreA = hasScoreA ? Number(override.teamAScore ?? override.scoreA ?? 0) : match.liveScore?.[0] ?? 0;
    const scoreB = hasScoreB ? Number(override.teamBScore ?? override.scoreB ?? 0) : match.liveScore?.[1] ?? 0;
    return {
      ...match,
      ...override,
      adminStatus: override.status || override.adminStatus || match.adminStatus || match.status || '',
      liveScore: [Number.isFinite(scoreA) ? scoreA : 0, Number.isFinite(scoreB) ? scoreB : 0],
    };
  });
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getMatchSmartRank(match) {
  const st = matchStatus(match);
  const now = new Date();
  const start = new Date(match.dateTime);
  if (st.bucket === 'live') return 0;
  if (!st.locked && isSameDay(start, now)) return 1;
  if (st.bucket === 'locked' && isSameDay(start, now)) return 2;
  if (st.bucket === 'finished') {
    const ageHours = Math.abs(now - start) / 36e5;
    return ageHours < 36 ? 3 : 5;
  }
  return 4;
}

function sortMatchesSmartly(matches) {
  return [...matches].sort((a, b) => {
    const rankA = getMatchSmartRank(a);
    const rankB = getMatchSmartRank(b);
    if (rankA !== rankB) return rankA - rankB;
    return new Date(a.dateTime) - new Date(b.dateTime);
  });
}

function getRelevantMatchId(matches) {
  const sorted = sortMatchesSmartly(matches);
  const live = sorted.find((m) => matchStatus(m).bucket === 'live');
  if (live) return live.id;
  const today = sorted.find((m) => isSameDay(new Date(m.dateTime), new Date()) && !matchStatus(m).locked);
  if (today) return today.id;
  const upcoming = sorted.find((m) => !matchStatus(m).locked);
  if (upcoming) return upcoming.id;
  return sorted.find((m) => matchStatus(m).bucket === 'finished')?.id || sorted[0]?.id;
}

function statusTagText(match) {
  const st = matchStatus(match);
  const start = new Date(match.dateTime);
  if (st.bucket === 'live') return 'Live now';
  if (st.bucket === 'finished') return 'Finished';
  if (isSameDay(start, new Date())) return 'Today';
  return st.label;
}

function calculatePredictionPoints(match, prediction) {
  if (!prediction) return { points: 0, label: 'No prediction' };
  const st = matchStatus(match);
  if (st.bucket !== 'finished') return { points: 0, label: 'Pending result' };
  const finalA = Number(match.liveScore?.[0] ?? 0);
  const finalB = Number(match.liveScore?.[1] ?? 0);
  const predA = Number(prediction.a ?? prediction.teamAScore ?? 0);
  const predB = Number(prediction.b ?? prediction.teamBScore ?? 0);
  if (predA === finalA && predB === finalB) return { points: 50, label: 'Exact score' };
  const predOutcome = predA === predB ? 'draw' : predA > predB ? 'A' : 'B';
  const finalOutcome = finalA === finalB ? 'draw' : finalA > finalB ? 'A' : 'B';
  if (predOutcome === finalOutcome && finalOutcome === 'draw') return { points: 15, label: 'Correct draw' };
  if (predOutcome === finalOutcome) return { points: 10, label: 'Correct winner' };
  return { points: 0, label: 'Missed result' };
}

function calculateLocalScore(matches, predictions) {
  return matches.reduce((acc, match) => {
    const result = calculatePredictionPoints(match, predictions[String(match.id)]);
    acc.points += result.points;
    if (result.points > 0) acc.correct += 1;
    if (result.points === 50) acc.exact += 1;
    return acc;
  }, { points: 0, correct: 0, exact: 0 });
}

function predictionAverageText(match, predictions) {
  const pred = predictions[String(match.id)];
  if (!pred) return { line: `${match.teamA} — ${match.teamB}`, note: 'Global Firebase average will appear as more users save predictions online.' };
  return { line: `${match.teamA} ${pred.a} - ${pred.b} ${match.teamB}`, note: 'Showing your saved prediction until global Firebase averages are aggregated.' };
}

function ButtonPill({ label, onPress, disabled, color }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.btn, disabled && styles.disabled, color ? { backgroundColor: color } : null]}>
      <Text style={styles.btnText}>{label}</Text>
    </TouchableOpacity>
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

function SponsorBanner({ dark, sponsor }) {
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(x, { toValue: -520, duration: 11000, useNativeDriver: true }),
        Animated.timing(x, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [x]);
  const name = sponsor?.name || 'Hobbee.FUN';
  const message = sponsor?.message || 'Sponsored section';
  const callToAction = sponsor?.callToAction || 'Visit Hobbee.FUN';
  return (
    <View style={[styles.sponsor, dark ? styles.cardDark : styles.cardLight]}>
      <Animated.Text style={[styles.sponsorText, { transform: [{ translateX: x }] }]}>🐝 {name}   •   {message}   •   {callToAction}   •   Sponsor can be changed from admin controls later   •</Animated.Text>
    </View>
  );
}

function AdBox({ dark, tone = 0, placement = 'matches', adSettings = DEFAULT_AD_SETTINGS }) {
  const settings = { ...DEFAULT_AD_SETTINGS, ...(adSettings || {}) };
  const backgrounds = dark ? ['#0b1220', '#111827', '#172033'] : ['#f1f5f9', '#fff7ed', '#ecfeff'];
  const borders = dark ? ['#334155', '#475569', '#14532d'] : ['#cbd5e1', '#fed7aa', '#a5f3fc'];
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!settings.adsEnabled || (failed && settings.autoHideOnNoFill)) return null;

  return (
    <View style={loaded ? [styles.adBox, { backgroundColor: backgrounds[tone % backgrounds.length], borderColor: borders[tone % borders.length] }] : styles.hiddenAdProbe}> 
      {loaded ? <Text style={{ color: dark ? '#e2e8f0' : '#334155', fontWeight: '900', marginBottom: 6 }}>Advertisement</Text> : null}
      <BannerAd
        unitId={getAdUnitId(placement, settings)}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: settings.nonPersonalized !== false }}
        onAdLoaded={() => setLoaded(true)}
        onAdFailedToLoad={() => setFailed(true)}
      />
      {loaded && settings.useTestAds ? <Text style={{ color: dark ? '#64748b' : '#94a3b8', fontSize: 10, marginTop: 4 }}>Test ads enabled</Text> : null}
    </View>
  );
}

function Header({ dark, fg, setDark, setMenu }) {
  return (
    <View style={[styles.header, dark ? { backgroundColor: '#0f172a' } : { backgroundColor: '#ffffff' }] }>
      <Image source={require('./assets/app-logo.png')} style={styles.logo} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.tiny, { color: COLORS.amber }]}>Virtual Beehive Inc.</Text>
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

function Matches({ dark, fg, predictions, setSelected, adSettings, matchOverrides }) {
  const scrollRef = useRef(null);
  const [filter, setFilter] = useState('smart');
  const effectiveMatches = useMemo(() => applyMatchOverrides(FIXTURES, matchOverrides), [matchOverrides]);
  const relevantId = useMemo(() => getRelevantMatchId(effectiveMatches), [effectiveMatches]);
  const shownMatches = useMemo(() => {
    const smart = sortMatchesSmartly(effectiveMatches);
    if (filter === 'live') return smart.filter((m) => matchStatus(m).bucket === 'live');
    if (filter === 'today') return smart.filter((m) => isSameDay(new Date(m.dateTime), new Date()));
    if (filter === 'upcoming') return smart.filter((m) => !matchStatus(m).locked);
    if (filter === 'finished') return smart.filter((m) => matchStatus(m).bucket === 'finished');
    if (filter === 'all') return effectiveMatches;
    return smart;
  }, [effectiveMatches, filter]);

  useEffect(() => {
    const index = shownMatches.findIndex((m) => m.id === relevantId);
    if (index > 0 && filter === 'smart') {
      const timer = setTimeout(() => scrollRef.current?.scrollTo({ y: Math.max(0, index * 150 - 20), animated: true }), 450);
      return () => clearTimeout(timer);
    }
  }, [shownMatches, relevantId, filter]);

  return (
    <ScrollView ref={scrollRef} style={{ padding: 12 }} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={[styles.big, { color: fg }]}>Matches</Text>
      <Text style={{ color: fg, marginBottom: 8 }}>Smart match list moves with the tournament date. Live, today, and recent results appear first, but you can still scroll all 104 matches.</Text>
      <View style={styles.filterRow}>
        {[['smart', 'Smart'], ['live', 'Live'], ['today', 'Today'], ['upcoming', 'Upcoming'], ['finished', 'Finished'], ['all', 'All']].map(([key, label]) => (
          <TouchableOpacity key={key} onPress={() => setFilter(key)} style={[styles.filterChip, filter === key && { backgroundColor: COLORS.amber, borderColor: COLORS.amber }] }>
            <Text style={{ color: filter === key ? '#000' : fg, fontWeight: '900' }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <AdBox dark={dark} tone={0} placement="matches" adSettings={adSettings} />
      {shownMatches.length === 0 ? (
        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
          <Text style={{ color: fg, fontWeight: '900' }}>No matches in this filter.</Text>
        </View>
      ) : null}
      {shownMatches.map((match, index) => {
        const st = matchStatus(match);
        const pred = predictions[String(match.id)];
        const scoreInfo = calculatePredictionPoints(match, pred);
        const isRelevant = match.id === relevantId;
        const isFinished = st.bucket === 'finished';
        return (
          <View key={match.id}>
            <TouchableOpacity onPress={() => setSelected(match)} style={[styles.matchCard, dark ? styles.cardDark : styles.cardLight, isRelevant && { borderColor: COLORS.green, borderWidth: 2 }, isFinished && { opacity: 0.62 }] }>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                <Text style={{ color: st.color, fontWeight: '900' }}>#{match.matchNo} {statusTagText(match)}</Text>
                <Text style={{ color: fg }}>{fmtDate(match.dateTime)}</Text>
              </View>
              <Text style={[styles.matchTeams, { color: fg }]}>{FLAGS[match.teamA] || '🏳️'} {match.teamA}  vs  {FLAGS[match.teamB] || '🏳️'} {match.teamB}</Text>
              <Text style={{ color: fg }}>{match.stage} {match.group ? `• Group ${match.group}` : ''}</Text>
              <Text style={{ color: fg }}>{match.stadium} • {match.city}</Text>
              {st.locked ? <Text style={{ color: st.color, fontWeight: '900' }}>Prediction locked</Text> : <Text style={{ color: COLORS.green, fontWeight: '900' }}>Prediction open until halftime</Text>}
              {isFinished ? <Text style={{ color: fg, fontWeight: '900' }}>Final score: {match.liveScore[0]} - {match.liveScore[1]}</Text> : null}
              {pred ? <Text style={{ color: COLORS.green, fontWeight: '900' }}>Your prediction: {pred.a} - {pred.b} • {scoreInfo.label}{scoreInfo.points ? ` • ${scoreInfo.points} pts` : ''}</Text> : <Text style={{ color: COLORS.amber }}>No prediction yet</Text>}
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
        <Text style={styles.stadiumText}>{match.city}, {match.state} • {match.country}</Text>
        <Text style={styles.stadiumText}>Capacity: {match.capacity}</Text>
        <Text style={styles.stadiumText}>Ticket range: {match.ticketRange}</Text>
      </View>
    </View>
  );
}

function MatchDetail({ match, onClose, dark, predictions, savePrediction, setTeamOpen, bestPlayers, saveBestPlayer, adSettings }) {
  const fg = dark ? '#ffffff' : '#0f172a';
  const [tab, setTab] = useState('summary');
  const saved = predictions[String(match.id)] || { a: 0, b: 0 };
  const [a, setA] = useState(saved.a);
  const [b, setB] = useState(saved.b);
  const selectedBest = bestPlayers[String(match.id)];
  const status = matchStatus(match);
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: dark ? COLORS.darkBg : COLORS.lightBg }] }>
      <BackHeader title={`${match.teamA} vs ${match.teamB}`} onBack={onClose} dark={dark} />
      <ScrollView style={{ padding: 16 }}>
        <StadiumCard match={match} dark={dark} fg={fg} />
        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: status.color }] }>
          <Text style={{ color: status.color, fontWeight: '900' }}>{status.label}</Text>
          <Text style={[styles.big, { color: fg }]}>{match.teamA} vs {match.teamB}</Text>
          <Text style={{ color: fg }}>Prediction time left: {fmtLeft(status.left)}</Text>
          <Text style={{ color: fg }}>{status.prompt}</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <ScoreStepper label={match.teamA} value={a} setValue={setA} disabled={status.locked} />
            <ScoreStepper label={match.teamB} value={b} setValue={setB} disabled={status.locked} />
          </View>
          <ButtonPill label="Confirm / Save Prediction" disabled={status.locked} onPress={() => savePrediction(match.id, a, b)} color={COLORS.green} />
          <View style={styles.blackBox}>
            <Text style={styles.blackTitle}>Our Users Prediction</Text>
            <Text style={styles.blackScore}>{predictionAverageText(match, predictions).line}</Text>
            <Text style={styles.blackSmall}>{predictionAverageText(match, predictions).note}</Text>
          </View>
          <View style={styles.blackBox}>
            <Text style={styles.blackTitle}>Live Score</Text>
            <Text style={styles.blackScore}>{match.teamA} {match.liveScore[0]} - {match.liveScore[1]} {match.teamB}</Text>
          </View>
        </View>
        <AdBox dark={dark} tone={1} placement="matches" adSettings={adSettings} />
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          {['summary', 'compare', 'head'].map((t) => (
            <ButtonPill key={t} label={t === 'summary' ? 'Summary' : t === 'compare' ? 'Teams' : 'History'} onPress={() => setTab(t)} color={tab === t ? COLORS.amber : COLORS.slate} />
          ))}
        </View>
        {tab === 'summary' && (
          <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.sectionTitle, { color: fg }]}>Best player of the game</Text>
            <Text style={{ color: fg }}>Choose anytime before or after the match.</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {[...((TEAM_DETAILS[match.teamA] || {}).players || []), ...((TEAM_DETAILS[match.teamB] || {}).players || [])].slice(0, 10).map((p) => (
                <TouchableOpacity key={`${p.name}-${p.number}`} onPress={() => saveBestPlayer(match.id, p.name)} style={[styles.bestPlayerPill, selectedBest === p.name && { backgroundColor: COLORS.green }]}>
                  <Text style={{ fontWeight: '900', color: selectedBest === p.name ? '#000' : fg }}>#{p.number} {p.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {tab === 'compare' && <TeamCompare a={match.teamA} b={match.teamB} dark={dark} setTeamOpen={setTeamOpen} />}
        {tab === 'head' && (
          <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.sectionTitle, { color: fg }]}>Previous matches</Text>
            <Text style={{ color: fg }}>{match.previous}</Text>
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
                  <Text style={{ color: fg, fontSize: 11 }}>{p.position} • {p.height} • {p.weight}</Text>
                </View>
              ))}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function KnockoutBracket({ dark, fg }) {
  const left = ['1E vs 3-', '1I vs 3-', '2A vs 2B', '1F vs 2C', '2K vs 2L', '1H vs 2J', '1D vs 3-', '1G vs 3-'];
  const right = ['1C vs 2F', '2E vs 2I', '1A vs 3-', '1L vs 3-', '1J vs 2H', '2D vs 2G', '1B vs 3-', '1K vs 3-'];
  return (
    <View style={[styles.bracketBox, dark ? styles.cardDark : styles.cardLight]}>
      <Text style={[styles.sectionTitle, { color: fg }]}>Knockout map</Text>
      <Text style={{ color: fg, marginBottom: 8 }}>Active teams remain colorful. Eliminated teams will gray out when live/backend updates are connected.</Text>
      <View style={styles.bracketRow}>
        <View style={styles.bracketSide}>{left.map((m) => <Text key={m} style={styles.bracketMatch}>{m}</Text>)}</View>
        <View style={styles.trophyCenter}><Text style={{ fontSize: 58 }}>🏆</Text><Text style={{ color: COLORS.amber, fontWeight: '900', textAlign: 'center' }}>FIFA 2026</Text></View>
        <View style={styles.bracketSide}>{right.map((m) => <Text key={m} style={styles.bracketMatch}>{m}</Text>)}</View>
      </View>
    </View>
  );
}

function Groups({ dark, fg, champion, chooseChampion, setTeamOpen, adSettings }) {
  return (
    <ScrollView style={{ padding: 12 }}>
      <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.amber }]}>
        <Text style={[styles.big, { color: fg }]}>Pick Your Champion</Text>
        <Text style={{ color: fg }}>Choose once. After confirmation, it is locked.</Text>
        <Text style={{ color: COLORS.green, fontWeight: '900', fontSize: 18, marginTop: 8 }}>{champion ? `Confirmed: ${FLAGS[champion]} ${champion}` : 'No champion selected yet'}</Text>
      </View>
      <Text style={[styles.sectionTitle, { color: fg }]}>FIFA World Cup 2026 groups</Text>
      {Object.entries(GROUPS).map(([group, arr], index) => (
        <View key={group}>
          <View style={[styles.groupBox, dark ? styles.cardDark : styles.cardLight]}>
            <Text style={styles.groupHeader}>Group {group}</Text>
            {arr.map((team) => (
              <TouchableOpacity key={team} onPress={() => chooseChampion(team)} onLongPress={() => setTeamOpen(team)} style={styles.groupTeamRow}>
                <Text style={{ fontSize: 18 }}>{FLAGS[team]}</Text>
                <Text style={{ fontWeight: '900', color: fg }}>{team}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {(index + 1) % 4 === 0 && <AdBox dark={dark} tone={index} placement="groups" adSettings={adSettings} />}
        </View>
      ))}
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
            <Text style={{ color: COLORS.amber }}>{n.source} • {n.date}</Text>
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
        <Text style={{ color: COLORS.amber, fontWeight: '900' }}>Source: {item.source} • {item.date}</Text>
        <Text style={{ color: fg, fontSize: 16, marginTop: 16, lineHeight: 24 }}>{item.body}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function TeamDetail({ team, onClose, dark }) {
  const fg = dark ? '#ffffff' : '#0f172a';
  const d = TEAM_DETAILS[team] || { players: [], achievements: [] };
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
        <Text style={{ color: fg, lineHeight: 22 }}>{d.description}</Text>
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

function TopPredictors({ dark, fg, adSettings, predictions, matchOverrides, profile }) {
  const effectiveMatches = useMemo(() => applyMatchOverrides(FIXTURES, matchOverrides), [matchOverrides]);
  const localScore = useMemo(() => calculateLocalScore(effectiveMatches, predictions || {}), [effectiveMatches, predictions]);
  const hasLocalScore = localScore.points > 0 || Object.keys(predictions || {}).length > 0;
  const sampleList = Array.from({ length: 40 }, (_, i) => ({ nick: `Predictor${i + 1}`, points: Math.max(0, 120 - i * 2), correct: Math.max(1, 12 - (i % 7)), exact: i % 5, photo: '👤', sample: true }));
  const localUser = { nick: profile?.nickname || profile?.name || 'You', points: localScore.points, correct: localScore.correct, exact: localScore.exact, photo: '⭐', sample: false };
  const list = hasLocalScore ? [localUser, ...sampleList].sort((a, b) => b.points - a.points) : sampleList;
  return (
    <ScrollView style={{ padding: 12 }} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={[styles.sectionTitle, { color: fg }]}>Top predictors</Text>
      <Text style={{ color: fg }}>Leaderboard scoring is now calculated from finished match results. Global Firebase leaderboard summaries will replace sample predictor rows as real users accumulate correct results.</Text>
      <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.amber }] }>
        <Text style={[styles.sectionTitle, { color: fg }]}>Scoring rules</Text>
        <Text style={{ color: fg }}>Exact score: 50 pts • Correct draw: 15 pts • Correct winner: 10 pts</Text>
      </View>
      {list.map((u, i) => (
        <React.Fragment key={`${u.nick}-${i}`}>
          <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { flexDirection: 'row', alignItems: 'center', gap: 12 }, !u.sample && { borderColor: COLORS.green, borderWidth: 2 }] }>
            <Text style={{ color: COLORS.amber, fontWeight: '900' }}>#{i + 1}</Text>
            <Text style={{ fontSize: 28 }}>{u.photo}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: fg, fontWeight: '900' }}>{u.nick}{u.sample ? '' : ' • Your score'}</Text>
              <Text style={{ color: fg }}>{u.correct} correct • {u.exact || 0} exact • {u.points} pts</Text>
            </View>
          </View>
          {(i + 1) % 3 === 0 && i !== list.length - 1 && <AdBox dark={dark} tone={i} placement="top" adSettings={adSettings} />}
        </React.Fragment>
      ))}
    </ScrollView>
  );
}

function SignInScreen({ dark, onBack, onSave, onEmailAuth, currentProfile }) {
  const fg = dark ? '#ffffff' : '#0f172a';
  const [p, setP] = useState({ email: currentProfile?.email || '', password: '', name: currentProfile?.name || '', nickname: currentProfile?.nickname || '', age: currentProfile?.age || '', sex: currentProfile?.sex || '', location: currentProfile?.country || currentProfile?.location || 'Auto-detected country only' });
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: dark ? COLORS.darkBg : COLORS.lightBg }] }>
      <BackHeader title="Sign in" onBack={onBack} dark={dark} />
      <ScrollView style={{ padding: 16 }}>
        <Text style={[styles.big, { color: fg }]}>Account</Text>
        <Text style={{ color: fg, marginBottom: 12 }}>Create an account or sign in to save your predictions online, keep leaderboard points, and access your profile from another device. Google and social sign-in will be added later.</Text>
        <Text style={[styles.sectionTitle, { color: fg, marginTop: 10 }]}>Email / Password</Text>
        {['email', 'password', 'name', 'nickname', 'age', 'sex'].map((key) => (
          <TextInput key={key} placeholder={key} placeholderTextColor="#94a3b8" secureTextEntry={key === 'password'} value={p[key] || ''} onChangeText={(v) => setP({ ...p, [key]: v })} style={[styles.input, dark ? styles.inputDark : styles.inputLight]} autoCapitalize={key === 'email' ? 'none' : 'sentences'} />
        ))}
        <ButtonPill label="Detect my country" onPress={() => setP({ ...p, location: 'United States' })} color={COLORS.amber} />
        <Text style={{ color: fg, marginTop: 8 }}>Country shown publicly: {p.location}</Text>
        <ButtonPill label="Create New Account" onPress={() => onEmailAuth(p, 'signup')} color={COLORS.green} />
        <ButtonPill label="Sign In" onPress={() => onEmailAuth(p, 'signin')} color={COLORS.blue} />
        <ButtonPill label="Save profile locally only" onPress={() => onSave(p)} color="#64748b" />
      </ScrollView>
    </SafeAreaView>
  );
}


function AdminScreen({ dark, onClose, firebaseUser, admin }) {
  const fg = dark ? '#ffffff' : '#0f172a';
  const [sponsorForm, setSponsorForm] = useState({
    name: 'Hobbee.FUN',
    message: 'Discover hobbies and share predictions with fans.',
    callToAction: 'Visit Hobbee.FUN',
    linkUrl: 'https://hobbee.fun',
    logoUrl: '',
  });
  const [matchForm, setMatchForm] = useState({ matchId: '1', teamAScore: '0', teamBScore: '0', status: 'upcoming' });
  const [newsForm, setNewsForm] = useState({ title: '', source: 'Virtual Beehive Inc.', body: '', url: '' });
  const [imageForm, setImageForm] = useState({ collection: 'stadiums', docId: '', imageUrl: '', coachImageUrl: '', playerImageUrl: '', jerseyHomeUrl: '', jerseyAwayUrl: '' });
  const [adForm, setAdForm] = useState(DEFAULT_AD_SETTINGS);

  useEffect(() => {
    async function loadAdminAdSettings() {
      try {
        const remote = await readDoc('appConfig', 'ads');
        if (remote) setAdForm({ ...DEFAULT_AD_SETTINGS, ...remote });
      } catch (e) {
        console.log('Admin ad settings load failed', e?.message || e);
      }
    }
    loadAdminAdSettings();
  }, []);

  async function requireAdmin() {
    if (!firebaseUser || !admin) {
      Alert.alert('Admin access required', 'Please sign in with the approved admin account first.');
      return false;
    }
    return true;
  }

  async function saveSponsor() {
    if (!(await requireAdmin())) return;
    await writeDoc('sponsors', 'active', {
      ...sponsorForm,
      active: true,
      updatedBy: firebaseUser.uid,
      updatedAt: serverTimestamp(),
    });
    Alert.alert('Sponsor saved', 'The active sponsor banner was saved to Firebase. Users will see it after the app reloads or refreshes sponsor data.');
  }

  async function saveMatchUpdate() {
    if (!(await requireAdmin())) return;
    const id = String(matchForm.matchId || '').trim();
    if (!id) { Alert.alert('Missing match ID', 'Enter a match number first.'); return; }
    await writeDoc('matches', id, {
      matchId: id,
      teamAScore: Number(matchForm.teamAScore || 0),
      teamBScore: Number(matchForm.teamBScore || 0),
      status: matchForm.status || 'upcoming',
      updatedBy: firebaseUser.uid,
      updatedAt: serverTimestamp(),
    });
    Alert.alert('Match update saved', `Match #${id} was saved to Firebase.`);
  }

  async function saveNewsItem() {
    if (!(await requireAdmin())) return;
    if (!newsForm.title || !newsForm.body) { Alert.alert('Missing news info', 'Enter a title and full story.'); return; }
    const id = `news_${Date.now()}`;
    await writeDoc('news', id, {
      ...newsForm,
      id,
      active: true,
      createdBy: firebaseUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, false);
    setNewsForm({ title: '', source: 'Virtual Beehive Inc.', body: '', url: '' });
    Alert.alert('News saved', 'The news item was saved to Firebase.');
  }

  async function saveImageLinks() {
    if (!(await requireAdmin())) return;
    const collection = imageForm.collection || 'stadiums';
    const id = String(imageForm.docId || '').trim();
    if (!id) { Alert.alert('Missing document ID', 'Enter a stadium/team/player document ID.'); return; }
    await writeDoc(collection, id, {
      imageUrl: imageForm.imageUrl || '',
      coachImageUrl: imageForm.coachImageUrl || '',
      playerImageUrl: imageForm.playerImageUrl || '',
      jerseyHomeUrl: imageForm.jerseyHomeUrl || '',
      jerseyAwayUrl: imageForm.jerseyAwayUrl || '',
      updatedBy: firebaseUser.uid,
      updatedAt: serverTimestamp(),
    });
    Alert.alert('Image links saved', `${collection}/${id} was saved to Firebase.`);
  }

  async function saveAdSettings() {
    if (!(await requireAdmin())) return;
    await writeDoc('appConfig', 'ads', {
      adsEnabled: adForm.adsEnabled === true,
      useTestAds: adForm.useTestAds === true,
      nonPersonalized: adForm.nonPersonalized !== false,
      autoHideOnNoFill: adForm.autoHideOnNoFill !== false,
      updatedBy: firebaseUser.uid,
      updatedAt: serverTimestamp(),
    });
    Alert.alert('Ad settings saved', 'Ad placements will follow this Firebase setting after users reopen the app. If AdMob has no fill, the placement will hide automatically.');
  }

  const inputStyle = [styles.input, dark ? styles.inputDark : styles.inputLight];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: dark ? COLORS.darkBg : COLORS.lightBg }] }>
      <BackHeader title="Admin Control Panel" onBack={onClose} dark={dark} />
      <ScrollView style={{ padding: 16 }} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={[styles.big, { color: fg }]}>Admin Control Panel</Text>
        <Text style={{ color: fg, marginBottom: 12 }}>Only approved admins can save changes. This panel writes to Firebase so key app content can change without rebuilding the app.</Text>

        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.amber }] }>
          <Text style={[styles.sectionTitle, { color: fg }]}>AdMob Display Control</Text>
          <Text style={{ color: fg, marginBottom: 8 }}>Controls Google ad placements without rebuilding. Ads can stay allowed, but each slot will automatically hide if AdMob has no ad to fill.</Text>
          <ButtonPill label={adForm.adsEnabled ? 'Ad placements: ON' : 'Ad placements: OFF'} onPress={() => setAdForm({ ...adForm, adsEnabled: !adForm.adsEnabled })} color={adForm.adsEnabled ? COLORS.green : '#64748b'} />
          <ButtonPill label={adForm.useTestAds ? 'Test ads: ON' : 'Test ads: OFF'} onPress={() => setAdForm({ ...adForm, useTestAds: !adForm.useTestAds })} color={adForm.useTestAds ? COLORS.amber : '#64748b'} />
          <ButtonPill label={adForm.autoHideOnNoFill ? 'Auto-hide no-fill ads: ON' : 'Auto-hide no-fill ads: OFF'} onPress={() => setAdForm({ ...adForm, autoHideOnNoFill: !adForm.autoHideOnNoFill })} color={adForm.autoHideOnNoFill ? COLORS.green : '#64748b'} />
          <ButtonPill label={adForm.nonPersonalized ? 'Non-personalized request: ON' : 'Non-personalized request: OFF'} onPress={() => setAdForm({ ...adForm, nonPersonalized: !adForm.nonPersonalized })} color={COLORS.blue} />
          <ButtonPill label="Save AdMob display settings" onPress={saveAdSettings} color={COLORS.green} />
        </View>

        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.green }] }>
          <Text style={[styles.sectionTitle, { color: fg }]}>Sponsor Manager</Text>
          <TextInput placeholder="Sponsor name" placeholderTextColor="#94a3b8" value={sponsorForm.name} onChangeText={(v)=>setSponsorForm({...sponsorForm,name:v})} style={inputStyle} />
          <TextInput placeholder="Sponsor message" placeholderTextColor="#94a3b8" value={sponsorForm.message} onChangeText={(v)=>setSponsorForm({...sponsorForm,message:v})} style={inputStyle} />
          <TextInput placeholder="Call to action" placeholderTextColor="#94a3b8" value={sponsorForm.callToAction} onChangeText={(v)=>setSponsorForm({...sponsorForm,callToAction:v})} style={inputStyle} />
          <TextInput placeholder="Link URL" placeholderTextColor="#94a3b8" value={sponsorForm.linkUrl} onChangeText={(v)=>setSponsorForm({...sponsorForm,linkUrl:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Logo URL optional" placeholderTextColor="#94a3b8" value={sponsorForm.logoUrl} onChangeText={(v)=>setSponsorForm({...sponsorForm,logoUrl:v})} style={inputStyle} autoCapitalize="none" />
          <ButtonPill label="Save active sponsor" onPress={saveSponsor} color={COLORS.green} />
        </View>

        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight] }>
          <Text style={[styles.sectionTitle, { color: fg }]}>Match Manager</Text>
          <Text style={{ color: fg, marginBottom: 8 }}>Use this for manual score/status override until the live sports API is connected.</Text>
          <TextInput placeholder="Match ID / number" placeholderTextColor="#94a3b8" value={matchForm.matchId} onChangeText={(v)=>setMatchForm({...matchForm,matchId:v})} style={inputStyle} keyboardType="number-pad" />
          <TextInput placeholder="Team A score" placeholderTextColor="#94a3b8" value={matchForm.teamAScore} onChangeText={(v)=>setMatchForm({...matchForm,teamAScore:v})} style={inputStyle} keyboardType="number-pad" />
          <TextInput placeholder="Team B score" placeholderTextColor="#94a3b8" value={matchForm.teamBScore} onChangeText={(v)=>setMatchForm({...matchForm,teamBScore:v})} style={inputStyle} keyboardType="number-pad" />
          <TextInput placeholder="Status: upcoming, live, halftime, final" placeholderTextColor="#94a3b8" value={matchForm.status} onChangeText={(v)=>setMatchForm({...matchForm,status:v})} style={inputStyle} autoCapitalize="none" />
          <ButtonPill label="Save match update" onPress={saveMatchUpdate} color={COLORS.blue} />
        </View>

        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight] }>
          <Text style={[styles.sectionTitle, { color: fg }]}>News Manager</Text>
          <TextInput placeholder="News title" placeholderTextColor="#94a3b8" value={newsForm.title} onChangeText={(v)=>setNewsForm({...newsForm,title:v})} style={inputStyle} />
          <TextInput placeholder="Source" placeholderTextColor="#94a3b8" value={newsForm.source} onChangeText={(v)=>setNewsForm({...newsForm,source:v})} style={inputStyle} />
          <TextInput placeholder="Full news story" placeholderTextColor="#94a3b8" value={newsForm.body} onChangeText={(v)=>setNewsForm({...newsForm,body:v})} style={[...inputStyle, { minHeight: 100, textAlignVertical: 'top' }]} multiline />
          <TextInput placeholder="Source URL optional" placeholderTextColor="#94a3b8" value={newsForm.url} onChangeText={(v)=>setNewsForm({...newsForm,url:v})} style={inputStyle} autoCapitalize="none" />
          <ButtonPill label="Publish news item" onPress={saveNewsItem} color={COLORS.amber} />
        </View>

        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight] }>
          <Text style={[styles.sectionTitle, { color: fg }]}>Image URL Manager</Text>
          <Text style={{ color: fg, marginBottom: 8 }}>Add image links for stadiums, teams, coaches, players, and jerseys without uploading heavy images to Firebase Storage.</Text>
          <TextInput placeholder="Collection: stadiums, teams, players" placeholderTextColor="#94a3b8" value={imageForm.collection} onChangeText={(v)=>setImageForm({...imageForm,collection:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Document ID, example: metlife or argentina" placeholderTextColor="#94a3b8" value={imageForm.docId} onChangeText={(v)=>setImageForm({...imageForm,docId:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Main image URL" placeholderTextColor="#94a3b8" value={imageForm.imageUrl} onChangeText={(v)=>setImageForm({...imageForm,imageUrl:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Coach image URL" placeholderTextColor="#94a3b8" value={imageForm.coachImageUrl} onChangeText={(v)=>setImageForm({...imageForm,coachImageUrl:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Player image URL" placeholderTextColor="#94a3b8" value={imageForm.playerImageUrl} onChangeText={(v)=>setImageForm({...imageForm,playerImageUrl:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Home jersey URL" placeholderTextColor="#94a3b8" value={imageForm.jerseyHomeUrl} onChangeText={(v)=>setImageForm({...imageForm,jerseyHomeUrl:v})} style={inputStyle} autoCapitalize="none" />
          <TextInput placeholder="Away jersey URL" placeholderTextColor="#94a3b8" value={imageForm.jerseyAwayUrl} onChangeText={(v)=>setImageForm({...imageForm,jerseyAwayUrl:v})} style={inputStyle} autoCapitalize="none" />
          <ButtonPill label="Save image links" onPress={saveImageLinks} color={COLORS.green} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuScreen({ dark, fg, profile = {}, saveProfile, admin, onClose, firebaseUser, onOpenSignIn, onSignOut, onOpenAdmin }) {
  const signedIn = !!firebaseUser || !!profile?.email;
  const profileName = profile?.name || 'Not signed in';
  const profileNickname = profile?.nickname || 'Not set';
  const profileAge = profile?.age || 'Not set';
  const profileSex = profile?.sex || 'Not set';
  const profileCountry = profile?.country || profile?.location || 'Not detected';

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
          <Text style={{ color: fg }}>Name: {profileName}</Text>
          <Text style={{ color: fg }}>Nickname: {profileNickname}</Text>
          <Text style={{ color: fg }}>Age: {profileAge}</Text>
          <Text style={{ color: fg }}>Sex: {profileSex}</Text>
          <Text style={{ color: fg }}>Country: {profileCountry}</Text>
          <Text style={{ color: fg }}>Account status: {firebaseUser ? 'Signed in online' : 'Local/guest mode'}</Text>
        </View>
        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.sectionTitle, { color: fg }]}>Privacy Policy</Text>
          <Text style={{ color: fg }}>We do not sell user data. Leaderboard shows nickname and profile image only when a user has correct predictions.</Text>
          <Text style={[styles.sectionTitle, { color: fg, marginTop: 12 }]}>Terms of Use</Text>
          <Text style={{ color: fg }}>Predictions are for entertainment. Score predictions lock after halftime or when match is finished. Best-player voting can happen before or after the game.</Text>
          <Text style={[styles.sectionTitle, { color: fg, marginTop: 12 }]}>Delete Account</Text>
          <ButtonPill label="Delete local account data" onPress={() => saveProfile({})} color={COLORS.red} />
        </View>
        {admin ? (
          <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.green }]}>
            <Text style={[styles.sectionTitle, { color: fg }]}>Hidden Admin</Text>
            <Text style={{ color: fg }}>Admin access is enabled for this account.</Text>
            <Text style={{ color: fg, marginBottom: 8 }}>Manage sponsors, news, match updates, and image URLs from Firebase.</Text>
            <ButtonPill label="Open Admin Control Panel" onPress={onOpenAdmin} color={COLORS.green} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
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
  const [champion, setChampion] = useState(null);
  const [profile, setProfile] = useState({ email: '', password: '', name: '', nickname: '', age: '', sex: '', location: '', country: '' });
  const [admin, setAdmin] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [sponsor, setSponsor] = useState(null);
  const [adSettings, setAdSettings] = useState(DEFAULT_AD_SETTINGS);
  const [matchOverrides, setMatchOverrides] = useState({});
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
        setProfile(parsed);
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
          setProfile(merged);
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
        const active = await readDoc('sponsors', 'active');
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
        const remote = await readDoc('appConfig', 'ads');
        if (remote) setAdSettings({ ...DEFAULT_AD_SETTINGS, ...remote });
      } catch (e) {
        console.log('Ad settings load failed', e?.message || e);
      }
    }
    loadAdSettings();
  }, []);


  useEffect(() => {
    async function loadMatchOverrides() {
      try {
        const snap = await getDocs(collection(db, 'matches'));
        const next = {};
        snap.forEach((item) => { next[String(item.id)] = item.data(); });
        setMatchOverrides(next);
      } catch (e) {
        console.log('Match override load failed', e?.message || e);
      }
    }
    loadMatchOverrides();
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
      Alert.alert('Best player saved online', `${playerName} selected as your best player of the game.`);
    } else {
      Alert.alert('Best player saved locally', `${playerName} selected. Sign in to save online.`);
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

  async function saveProfile(p) {
    const clean = { ...p, country: p.country || p.location || 'United States' };
    setProfile(clean);
    await AsyncStorage.setItem('profile', JSON.stringify(clean));
    if (firebaseUser) {
      const profileDoc = {
        email: firebaseUser.email || clean.email || '',
        name: clean.name || '',
        nickname: clean.nickname || '',
        age: clean.age || '',
        sex: clean.sex || '',
        country: clean.country || 'United States',
        photoUrl: clean.photoUrl || '',
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };
      await writeDoc('users', firebaseUser.uid, profileDoc);
      const latest = await readDoc('users', firebaseUser.uid);
      if (latest?.isAdmin === true) setAdmin(true);
      Alert.alert('Profile saved online', 'Your profile was saved online.');
    } else {
      Alert.alert('Profile saved locally', 'Sign in to save this profile online.');
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
        latest = { email: user.email || cleanEmail, name: p.name || '', nickname: p.nickname || '', country: p.location || 'United States', isAdmin: false };
      }

      const merged = {
        ...(latest || {}),
        email: user.email || cleanEmail,
        name: latest?.name || p.name || '',
        nickname: latest?.nickname || p.nickname || '',
        country: latest?.country || p.location || 'United States',
      };

      setProfile(merged);
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
    setProfile({ email: '', password: '', name: '', nickname: '', age: '', sex: '', location: '', country: '' });
    await AsyncStorage.removeItem('profile');
    Alert.alert('Signed out', 'You are now signed out.');
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: bg }] }>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Header dark={dark} fg={fg} setDark={setDark} setMenu={setMenu} />
      <SponsorBanner dark={dark} sponsor={sponsor} />
      <View style={{ flex: 1 }}>
        {tab === 'matches' && <Matches dark={dark} fg={fg} predictions={predictions} setSelected={setSelected} adSettings={adSettings} matchOverrides={matchOverrides} />}
        {tab === 'groups' && <Groups dark={dark} fg={fg} champion={champion} chooseChampion={chooseChampion} setTeamOpen={setTeamOpen} adSettings={adSettings} />}
        {tab === 'news' && <News dark={dark} fg={fg} setNewsOpen={setNewsOpen} adSettings={adSettings} />}
        {tab === 'top' && <TopPredictors dark={dark} fg={fg} adSettings={adSettings} predictions={predictions} matchOverrides={matchOverrides} profile={profile} />}
      </View>
      <View style={[styles.nav, dark ? { backgroundColor: '#111827' } : { backgroundColor: '#ffffff' }] }>
        {[['matches', 'Matches'], ['groups', 'Groups'], ['news', 'News'], ['top', 'Top']].map(([key, label]) => (
          <TouchableOpacity key={key} onPress={() => setTab(key)} style={[styles.navBtn, tab === key && { backgroundColor: COLORS.amber }]}>
            <Text style={{ fontWeight: '900', color: tab === key ? '#000000' : fg }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        <MatchDetail match={selected} onClose={() => setSelected(null)} dark={dark} predictions={predictions} savePrediction={savePrediction} setTeamOpen={setTeamOpen} bestPlayers={bestPlayers} saveBestPlayer={saveBestPlayer} adSettings={adSettings} />
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
          saveProfile={saveProfile}
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
        />
      </Modal>
      <Modal visible={authOpen} animationType="slide" onRequestClose={() => setAuthOpen(false)}>
        <SignInScreen
          dark={dark}
          currentProfile={profile || {}}
          onEmailAuth={async (p, mode) => {
            const ok = await handleEmailAuth(p, mode);
            if (ok) setAuthOpen(false);
          }}
          onBack={() => setAuthOpen(false)}
          onSave={async (p) => {
            await saveProfile(p);
            setAuthOpen(false);
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  backHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  backButton: { backgroundColor: COLORS.amber, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '900' },
  logo: { width: 42, height: 42, borderRadius: 21 },
  iconBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  tiny: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  title: { fontSize: 16, fontWeight: '900' },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 8 },
  big: { fontSize: 22, fontWeight: '900', marginBottom: 8 },
  nav: { flexDirection: 'row', gap: 4, padding: 8, borderTopWidth: 1, borderTopColor: '#1e293b' },
  navBtn: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 14 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: '#334155' },
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
  sponsor: { height: 42, justifyContent: 'center', overflow: 'hidden', borderBottomWidth: 1, borderBottomColor: COLORS.slate },
  sponsorText: { fontWeight: '900', fontSize: 15, color: COLORS.amber, width: 900 },
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
  groupBox: { borderRadius: 16, padding: 12, marginBottom: 10, borderWidth: 1 },
  groupHeader: { backgroundColor: '#064e3b', color: '#ffffff', fontWeight: '900', padding: 6, borderRadius: 8, marginBottom: 6, textAlign: 'center' },
  groupTeamRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  bracketBox: { borderRadius: 18, padding: 12, marginBottom: 18, borderWidth: 1 },
  bracketRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bracketSide: { flex: 1, gap: 6 },
  bracketMatch: { backgroundColor: '#064e3b', color: '#ffffff', fontWeight: '900', paddingVertical: 5, paddingHorizontal: 6, borderRadius: 6, fontSize: 11 },
  trophyCenter: { width: 90, alignItems: 'center', justifyContent: 'center' },
});

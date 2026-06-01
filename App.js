import React, { useEffect, useRef, useState } from 'react';
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

function SponsorBanner({ dark }) {
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(x, { toValue: -430, duration: 9500, useNativeDriver: true }),
        Animated.timing(x, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [x]);
  return (
    <View style={[styles.sponsor, dark ? styles.cardDark : styles.cardLight]}>
      <Animated.Text style={[styles.sponsorText, { transform: [{ translateX: x }] }]}>🐝 Hobbee.FUN   •   Sponsored section   •   Visit Hobbee.FUN   •   Sponsor can be changed from hidden admin later   •</Animated.Text>
    </View>
  );
}

function AdBox({ dark, tone = 0 }) {
  const backgrounds = dark ? ['#0b1220', '#111827', '#172033'] : ['#f1f5f9', '#fff7ed', '#ecfeff'];
  const borders = dark ? ['#334155', '#475569', '#14532d'] : ['#cbd5e1', '#fed7aa', '#a5f3fc'];
  return (
    <View style={[styles.adBox, { backgroundColor: backgrounds[tone % backgrounds.length], borderColor: borders[tone % borders.length] }]}>
      <Text style={{ color: dark ? '#94a3b8' : '#475569', fontWeight: '700' }}>Advertisement</Text>
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

function Matches({ dark, fg, predictions, setSelected }) {
  return (
    <ScrollView style={{ padding: 12 }}>
      <Text style={[styles.big, { color: fg }]}>Matches</Text>
      <Text style={{ color: fg, marginBottom: 8 }}>All 104 tournament matches are listed. Tap any match to predict before halftime.</Text>
      <AdBox dark={dark} tone={0} />
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
              <Text style={{ color: fg }}>{match.stadium} • {match.city}</Text>
              {pred ? <Text style={{ color: COLORS.green, fontWeight: '900' }}>Your prediction: {pred.a} - {pred.b}</Text> : <Text style={{ color: COLORS.amber }}>No prediction yet</Text>}
            </TouchableOpacity>
            {(index + 1) % 4 === 0 && <AdBox dark={dark} tone={index} />}
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

function MatchDetail({ match, onClose, dark, predictions, savePrediction, setTeamOpen, bestPlayers, saveBestPlayer }) {
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
            <Text style={styles.blackScore}>{match.teamA} {fakeAverage(match.id, 1)} - {fakeAverage(match.id, 2)} {match.teamB}</Text>
            <Text style={styles.blackSmall}>Placeholder until backend global averages are connected.</Text>
          </View>
          <View style={styles.blackBox}>
            <Text style={styles.blackTitle}>Live Score</Text>
            <Text style={styles.blackScore}>{match.teamA} {match.liveScore[0]} - {match.liveScore[1]} {match.teamB}</Text>
          </View>
        </View>
        <AdBox dark={dark} tone={1} />
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
            <Text style={[styles.sectionTitle, { color: fg, marginTop: 16 }]}>Match location</Text>
            <Text style={{ color: fg }}>Stadium: {match.stadium}</Text>
            <Text style={{ color: fg }}>City/State: {match.city}, {match.state}</Text>
            <Text style={{ color: fg }}>Country: {match.country}</Text>
            <Text style={{ color: fg }}>Capacity: {match.capacity}</Text>
            <Text style={{ color: fg }}>Ticket range: {match.ticketRange}</Text>
          </View>
        )}
        {tab === 'compare' && <TeamCompare a={match.teamA} b={match.teamB} dark={dark} setTeamOpen={setTeamOpen} />}
        {tab === 'head' && (
          <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.sectionTitle, { color: fg }]}>Previous matches</Text>
            <Text style={{ color: fg }}>{match.previous}</Text>
            <AdBox dark={dark} tone={2} />
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

function Groups({ dark, fg, champion, chooseChampion, setTeamOpen }) {
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
          {(index + 1) % 4 === 0 && <AdBox dark={dark} tone={index} />}
        </View>
      ))}
      <KnockoutBracket dark={dark} fg={fg} />
    </ScrollView>
  );
}

function News({ dark, fg, setNewsOpen }) {
  return (
    <ScrollView style={{ padding: 12 }}>
      {NEWS.map((n, index) => (
        <View key={n.id}>
          <TouchableOpacity onPress={() => setNewsOpen(n)} style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.sectionTitle, { color: fg }]}>{n.title}</Text>
            <Text style={{ color: COLORS.amber }}>{n.source} • {n.date}</Text>
            <Text style={{ color: fg }}>Tap to read full news</Text>
          </TouchableOpacity>
          {index === 0 && <AdBox dark={dark} tone={1} />}
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

function TopPredictors({ dark, fg }) {
  const list = Array.from({ length: 50 }, (_, i) => ({ nick: `Predictor${i + 1}`, points: 120 - i * 2, correct: Math.max(1, 12 - (i % 7)), photo: '👤' }));
  return (
    <ScrollView style={{ padding: 12 }}>
      <Text style={[styles.sectionTitle, { color: fg }]}>Top predictors</Text>
      <Text style={{ color: fg }}>Shows everyone with at least one correct prediction. Emails and private data are hidden.</Text>
      <AdBox dark={dark} tone={0} />
      {list.map((u, i) => (
        <View key={u.nick} style={[styles.card, dark ? styles.cardDark : styles.cardLight, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
          <Text style={{ color: COLORS.amber, fontWeight: '900' }}>#{i + 1}</Text>
          <Text style={{ fontSize: 28 }}>{u.photo}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: fg, fontWeight: '900' }}>{u.nick}</Text>
            <Text style={{ color: fg }}>{u.correct} correct • {u.points} pts</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function SignInScreen({ dark, onBack, onSave }) {
  const fg = dark ? '#ffffff' : '#0f172a';
  const [p, setP] = useState({ email: '', password: '', name: '', nickname: '', age: '', sex: '', location: 'Auto-detected country only' });
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: dark ? COLORS.darkBg : COLORS.lightBg }] }>
      <BackHeader title="Sign in" onBack={onBack} dark={dark} />
      <ScrollView style={{ padding: 16 }}>
        <Text style={[styles.big, { color: fg }]}>Sign in options</Text>
        <ButtonPill label="Continue with Google" onPress={() => Alert.alert('Phase 2B', 'Google sign-in will connect with backend authentication.')} color="#ffffff" />
        <ButtonPill label="Continue with social media" onPress={() => Alert.alert('Phase 2B', 'Social login will connect with backend authentication.')} color="#38bdf8" />
        <Text style={[styles.sectionTitle, { color: fg, marginTop: 18 }]}>Username / Password</Text>
        {['email', 'password', 'name', 'nickname', 'age', 'sex'].map((key) => (
          <TextInput key={key} placeholder={key} placeholderTextColor="#94a3b8" secureTextEntry={key === 'password'} value={p[key] || ''} onChangeText={(v) => setP({ ...p, [key]: v })} style={[styles.input, dark ? styles.inputDark : styles.inputLight]} />
        ))}
        <ButtonPill label="Detect my country" onPress={() => setP({ ...p, location: 'United States' })} color={COLORS.amber} />
        <Text style={{ color: fg, marginTop: 8 }}>Country shown: {p.location}</Text>
        <ButtonPill label="Save and return to menu" onPress={() => onSave(p)} color={COLORS.green} />
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuScreen({ dark, fg, profile, saveProfile, admin, onClose }) {
  const [signingIn, setSigningIn] = useState(false);
  if (signingIn) {
    return <SignInScreen dark={dark} onBack={() => setSigningIn(false)} onSave={(p) => { saveProfile(p); setSigningIn(false); }} />;
  }
  const signedIn = !!profile.email;
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: dark ? COLORS.darkBg : COLORS.lightBg }] }>
      <BackHeader title="Menu" onBack={onClose} dark={dark} />
      <ScrollView style={{ padding: 16 }}>
        {!signedIn ? <ButtonPill label="Sign in" onPress={() => setSigningIn(true)} color={COLORS.green} /> : <ButtonPill label="Sign out" onPress={() => saveProfile({})} color="#64748b" />}
        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.big, { color: fg }]}>Account</Text>
          <Text style={{ color: fg }}>Name: {profile.name || 'Not signed in'}</Text>
          <Text style={{ color: fg }}>Nickname: {profile.nickname || 'Not set'}</Text>
          <Text style={{ color: fg }}>Age: {profile.age || 'Not set'}</Text>
          <Text style={{ color: fg }}>Sex: {profile.sex || 'Not set'}</Text>
          <Text style={{ color: fg }}>Country: {profile.location || 'Not detected'}</Text>
        </View>
        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.sectionTitle, { color: fg }]}>Privacy Policy</Text>
          <Text style={{ color: fg }}>We do not sell user data. Leaderboard shows nickname and profile image only when a user has correct predictions.</Text>
          <Text style={[styles.sectionTitle, { color: fg, marginTop: 12 }]}>Terms of Use</Text>
          <Text style={{ color: fg }}>Predictions are for entertainment. Score predictions lock after halftime or when match is finished. Best-player voting can happen before or after the game.</Text>
          <Text style={[styles.sectionTitle, { color: fg, marginTop: 12 }]}>Delete Account</Text>
          <ButtonPill label="Delete local account data" onPress={() => saveProfile({})} color={COLORS.red} />
        </View>
        {admin && (
          <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, { borderColor: COLORS.green }] }>
            <Text style={[styles.sectionTitle, { color: fg }]}>Hidden Admin</Text>
            <Text style={{ color: fg }}>Visible only for Daniel Pirooz admin login in this prototype. Real version should use backend role security.</Text>
            <Text style={{ color: fg }}>Sponsor Manager: Hobbee.FUN banner fields placeholder.</Text>
            <Text style={{ color: fg }}>Match Manager: manual live score updates placeholder.</Text>
          </View>
        )}
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
  const [predictions, setPredictions] = useState({});
  const [bestPlayers, setBestPlayers] = useState({});
  const [champion, setChampion] = useState(null);
  const [profile, setProfile] = useState({ email: '', password: '', name: '', nickname: '', age: '', sex: '', location: '' });
  const [admin, setAdmin] = useState(false);
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
        setAdmin(parsed.email === 'danny@virtualbeehiveinc.com' && parsed.password === 'YaPe1200@');
      }
    }
    load();
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (menu) { setMenu(false); return true; }
      if (newsOpen) { setNewsOpen(null); return true; }
      if (teamOpen) { setTeamOpen(null); return true; }
      if (selected) { setSelected(null); return true; }
      return false;
    });
    return () => sub.remove();
  }, [menu, newsOpen, teamOpen, selected]);

  async function savePrediction(id, a, b) {
    const next = { ...predictions, [String(id)]: { a, b, savedAt: new Date().toISOString() } };
    setPredictions(next);
    await AsyncStorage.setItem('predictions', JSON.stringify(next));
    Alert.alert('Prediction saved', `Your prediction ${a} - ${b} was saved on this phone.`);
  }

  async function saveBestPlayer(id, playerName) {
    const next = { ...bestPlayers, [String(id)]: playerName };
    setBestPlayers(next);
    await AsyncStorage.setItem('bestPlayers', JSON.stringify(next));
    Alert.alert('Best player saved', `${playerName} selected as your best player of the game.`);
  }

  async function chooseChampion(team) {
    if (champion) {
      Alert.alert('Champion locked', `You already confirmed ${champion}.`);
      return;
    }
    Alert.alert('Confirm champion', `Choose ${team} as your champion? This can be selected only once.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: async () => { setChampion(team); await AsyncStorage.setItem('champion', team); } },
    ]);
  }

  async function saveProfile(p) {
    setProfile(p);
    const isAdmin = p.email === 'danny@virtualbeehiveinc.com' && p.password === 'YaPe1200@';
    setAdmin(isAdmin);
    await AsyncStorage.setItem('profile', JSON.stringify(p));
    Alert.alert(isAdmin ? 'Admin enabled' : 'Profile saved', isAdmin ? 'Hidden admin tools are now visible in menu.' : 'Your profile was saved locally.');
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: bg }] }>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Header dark={dark} fg={fg} setDark={setDark} setMenu={setMenu} />
      <SponsorBanner dark={dark} />
      <View style={{ flex: 1 }}>
        {tab === 'matches' && <Matches dark={dark} fg={fg} predictions={predictions} setSelected={setSelected} />}
        {tab === 'groups' && <Groups dark={dark} fg={fg} champion={champion} chooseChampion={chooseChampion} setTeamOpen={setTeamOpen} />}
        {tab === 'news' && <News dark={dark} fg={fg} setNewsOpen={setNewsOpen} />}
        {tab === 'top' && <TopPredictors dark={dark} fg={fg} />}
      </View>
      <View style={[styles.nav, dark ? { backgroundColor: '#111827' } : { backgroundColor: '#ffffff' }] }>
        {[['matches', 'Matches'], ['groups', 'Groups'], ['news', 'News'], ['top', 'Top']].map(([key, label]) => (
          <TouchableOpacity key={key} onPress={() => setTab(key)} style={[styles.navBtn, tab === key && { backgroundColor: COLORS.amber }]}>
            <Text style={{ fontWeight: '900', color: tab === key ? '#000000' : fg }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        <MatchDetail match={selected} onClose={() => setSelected(null)} dark={dark} predictions={predictions} savePrediction={savePrediction} setTeamOpen={setTeamOpen} bestPlayers={bestPlayers} saveBestPlayer={saveBestPlayer} />
      </Modal>
      <Modal visible={!!teamOpen} animationType="slide" onRequestClose={() => setTeamOpen(null)}>
        <TeamDetail team={teamOpen} onClose={() => setTeamOpen(null)} dark={dark} />
      </Modal>
      <Modal visible={!!newsOpen} animationType="slide" onRequestClose={() => setNewsOpen(null)}>
        <NewsDetail item={newsOpen} onClose={() => setNewsOpen(null)} dark={dark} />
      </Modal>
      <Modal visible={menu} animationType="slide" onRequestClose={() => setMenu(false)}>
        <MenuScreen dark={dark} fg={fg} profile={profile} saveProfile={saveProfile} admin={admin} onClose={() => setMenu(false)} />
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
  adBox: { height: 58, borderWidth: 1, borderStyle: 'dashed', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
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

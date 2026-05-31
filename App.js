import React, { useMemo, useState } from 'react';
import { Alert, Image, Linking, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const logo = require('./assets/app-logo.png');

const COLORS = {
  darkBg: '#080B12', darkCard: '#111827', darkSoft: '#1F2937', darkText: '#F9FAFB', darkMuted: '#9CA3AF',
  lightBg: '#F8FAFC', lightCard: '#FFFFFF', lightSoft: '#E5E7EB', lightText: '#111827', lightMuted: '#6B7280',
  amber: '#FBBF24', green: '#34D399', red: '#F87171', blue: '#60A5FA'
};

const teams = [
  ['Canada','🇨🇦','Host'],['Mexico','🇲🇽','Host'],['USA','🇺🇸','Host'],['Australia','🇦🇺','AFC'],['Iraq','🇮🇶','AFC'],['IR Iran','🇮🇷','AFC'],['Japan','🇯🇵','AFC'],['Jordan','🇯🇴','AFC'],['Korea Republic','🇰🇷','AFC'],['Qatar','🇶🇦','AFC'],['Saudi Arabia','🇸🇦','AFC'],['Uzbekistan','🇺🇿','AFC'],['Algeria','🇩🇿','CAF'],['Cabo Verde','🇨🇻','CAF'],['Congo DR','🇨🇩','CAF'],['Côte d’Ivoire','🇨🇮','CAF'],['Egypt','🇪🇬','CAF'],['Ghana','🇬🇭','CAF'],['Morocco','🇲🇦','CAF'],['Senegal','🇸🇳','CAF'],['South Africa','🇿🇦','CAF'],['Tunisia','🇹🇳','CAF'],['Curaçao','🇨🇼','Concacaf'],['Haiti','🇭🇹','Concacaf'],['Panama','🇵🇦','Concacaf'],['Argentina','🇦🇷','CONMEBOL'],['Brazil','🇧🇷','CONMEBOL'],['Colombia','🇨🇴','CONMEBOL'],['Ecuador','🇪🇨','CONMEBOL'],['Paraguay','🇵🇾','CONMEBOL'],['Uruguay','🇺🇾','CONMEBOL'],['New Zealand','🇳🇿','OFC'],['Austria','🇦🇹','UEFA'],['Belgium','🇧🇪','UEFA'],['Bosnia and Herzegovina','🇧🇦','UEFA'],['Croatia','🇭🇷','UEFA'],['Czechia','🇨🇿','UEFA'],['England','🏴','UEFA'],['France','🇫🇷','UEFA'],['Germany','🇩🇪','UEFA'],['Netherlands','🇳🇱','UEFA'],['Norway','🇳🇴','UEFA'],['Portugal','🇵🇹','UEFA'],['Scotland','🏴','UEFA'],['Spain','🇪🇸','UEFA'],['Sweden','🇸🇪','UEFA'],['Switzerland','🇨🇭','UEFA'],['Türkiye','🇹🇷','UEFA']
].map(([name,flag,confederation]) => ({ name, flag, confederation, active: true, coach: 'Team Coach' }));

const groupLabels = ['A','B','C','D','E','F','G','H','I','J','K','L'];
const tournamentGroups = groupLabels.map((g,i) => ({ label: `Group ${g}`, teams: teams.slice(i*4, i*4+4) }));

const matches = [
  { id: 1, a: 'USA', b: 'Argentina', status: 'upcoming', time: 'Jun 14, 2026 • 8:00 PM', venue: 'MetLife Stadium', score: null, userPrediction: [2,1], avg: [3.56,2.44], predictions: 1184 },
  { id: 2, a: 'Brazil', b: 'France', status: 'live', minute: "32'", time: 'Live Now', venue: 'AT&T Stadium', score: [1,1], userPrediction: [2,2], avg: [1.22,1.86], predictions: 2401 },
  { id: 3, a: 'Germany', b: 'Japan', status: 'final', time: 'Final', venue: 'SoFi Stadium', score: [1,2], userPrediction: [1,2], avg: [1.31,1.77], predictions: 832 },
  { id: 4, a: 'Mexico', b: 'Canada', status: 'upcoming', time: 'Jun 18, 2026 • 6:00 PM', venue: 'Azteca Stadium', score: null, userPrediction: [0,0], avg: [1.49,1.5], predictions: 391 }
];

const playerStats = [
  { name:'L. Martinez', team:'Argentina', flag:'🇦🇷', position:'Forward', goals:5, assists:2, matches:6, photo:'⚽' },
  { name:'B. Silva', team:'Brazil', flag:'🇧🇷', position:'Winger', goals:4, assists:3, matches:6, photo:'🏃' },
  { name:'C. Johnson', team:'USA', flag:'🇺🇸', position:'Striker', goals:3, assists:1, matches:5, photo:'🎯' },
  { name:'A. Dupont', team:'France', flag:'🇫🇷', position:'Midfielder', goals:3, assists:4, matches:6, photo:'🧠' },
  { name:'M. Tanaka', team:'Japan', flag:'🇯🇵', position:'Attacking Midfielder', goals:2, assists:2, matches:4, photo:'⚡' },
  { name:'P. Hernandez', team:'Mexico', flag:'🇲🇽', position:'Forward', goals:2, assists:1, matches:4, photo:'🔥' },
  { name:'S. Miller', team:'USA', flag:'🇺🇸', position:'Center Back', goals:1, assists:1, matches:5, photo:'🧱' },
  { name:'R. Smith', team:'Canada', flag:'🇨🇦', position:'Defender', goals:1, assists:0, matches:4, photo:'🛡️' },
  { name:'D. Oliveira', team:'Brazil', flag:'🇧🇷', position:'Goalkeeper', goals:0, assists:0, matches:6, photo:'🧤' },
  { name:'T. Watanabe', team:'Japan', flag:'🇯🇵', position:'Left Back', goals:0, assists:2, matches:4, photo:'🚀' }
];

const leaders = [
  { rank: 1, nick: 'GoalKing', photo: '🧑‍🚀', country: 'USA', points: 210, exact: 3, correct: 11 },
  { rank: 2, nick: 'BeeStriker', photo: '👩‍💼', country: 'Canada', points: 180, exact: 2, correct: 10 },
  { rank: 3, nick: 'CupMaster', photo: '🧑‍🎨', country: 'Argentina', points: 165, exact: 2, correct: 9 },
  { rank: 4, nick: 'FootballMind', photo: '👨‍💻', country: 'Brazil', points: 130, exact: 1, correct: 8 },
  { rank: 5, nick: 'PredictionPro', photo: '👩‍🚀', country: 'France', points: 115, exact: 1, correct: 7 }
];

const news = [
  { title: 'Tournament teams prepare final squads', source: 'World Cup Team News', time: '2h ago', tag: 'Teams' },
  { title: 'USA and Argentina expected to draw huge audience', source: 'Football Daily', time: '4h ago', tag: 'Match' },
  { title: 'Brazil training update before knockout stage', source: 'Global Football', time: 'Today', tag: 'Brazil' }
];

function useTheme(dark) {
  return {
    bg: dark ? COLORS.darkBg : COLORS.lightBg,
    card: dark ? COLORS.darkCard : COLORS.lightCard,
    soft: dark ? COLORS.darkSoft : COLORS.lightSoft,
    text: dark ? COLORS.darkText : COLORS.lightText,
    muted: dark ? COLORS.darkMuted : COLORS.lightMuted,
    border: dark ? '#243044' : '#E5E7EB'
  };
}

function Pill({ children, color, style }) { return <View style={[styles.pill, { backgroundColor: color || COLORS.amber }, style]}><Text style={styles.pillText}>{children}</Text></View>; }
function Card({ children, theme, style }) { return <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, style]}>{children}</View>; }
function Ad({ theme, label='Google AdMob placeholder' }) { return <View style={[styles.ad, { borderColor: theme.border }]}><Text style={{ color: theme.muted, fontSize: 12 }}>{label}</Text></View>; }
function TeamFlag({ name, align }) { const t = teams.find(x => x.name === name); return <View style={{ flex: 1, alignItems: align === 'right' ? 'flex-end' : 'flex-start' }}><Text style={{ fontSize: 28 }}>{t?.flag || '🏳️'}</Text><Text numberOfLines={1} style={{ fontWeight: '900', color: 'inherit' }}>{name}</Text></View>; }

function Header({ dark, setDark, theme }) {
  return <View style={[styles.header, { backgroundColor: theme.bg, borderBottomColor: theme.border }]}> 
    <View style={styles.headerRow}>
      <Image source={logo} style={styles.logo} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.kicker, { color: COLORS.amber }]}>VIRTUAL BEEHIVE INC.</Text>
        <Text style={[styles.title, { color: theme.text }]}>FIFA WorldCup{`\n`}2026 Predictor</Text>
      </View>
      <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.soft }]} onPress={() => setDark(!dark)}>
        <Ionicons name={dark ? 'sunny' : 'moon'} size={19} color={theme.text} />
      </TouchableOpacity>
    </View>
    <View style={styles.notice}><Text style={styles.noticeText}><Text style={{ fontWeight: '900' }}>Free fan prediction app.</Text> Supported by light ads and sponsors.</Text></View>
  </View>
}

function SponsorCard({ theme }) {
  return <Card theme={theme} style={{ borderColor: '#FBBF24' }}><View style={styles.row}>
    <View style={styles.bee}><Text style={{ fontSize: 26 }}>🐝</Text></View><View style={{ flex: 1 }}><Text style={[styles.kicker, { color: COLORS.amber }]}>SPONSORED SECTION</Text><Text style={[styles.h3, { color: theme.text }]}>Hobbee.FUN</Text><Text style={{ color: theme.muted, fontSize: 12 }}>Discover hobbies and share predictions with fans.</Text></View><TouchableOpacity onPress={() => Linking.openURL('https://hobbee.fun')}><Pill>Visit</Pill></TouchableOpacity>
  </View></Card>
}

function MatchesScreen({ theme }) {
  const [selected, setSelected] = useState(matches[0]);
  return <ScrollView contentContainerStyle={styles.screen}>
    <Text style={[styles.h2, { color: theme.text }]}>Matches</Text>
    <SponsorCard theme={theme} />
    <Ad theme={theme} />
    {matches.map((m, i) => <React.Fragment key={m.id}><MatchCard match={m} selected={selected.id === m.id} onPress={() => setSelected(m)} theme={theme}/>{i===1 && <Ad theme={theme} label="Native feed ad placeholder" />}</React.Fragment>)}
    <MatchDetail match={selected} theme={theme} />
  </ScrollView>
}

function MatchCard({ match, selected, onPress, theme }) {
  const color = match.status === 'live' ? COLORS.green : match.status === 'final' ? theme.muted : COLORS.amber;
  return <TouchableOpacity onPress={onPress} style={[styles.matchCard, { backgroundColor: theme.card, borderColor: selected ? COLORS.amber : theme.border, opacity: match.status === 'final' ? 0.68 : 1 }]}> 
    <View style={styles.rowBetween}><Pill color={color}>{match.status === 'live' ? `LIVE ${match.minute}` : match.status}</Pill><Text style={{ color: theme.muted, fontSize: 12 }}>{match.time}</Text></View>
    <View style={[styles.rowBetween, { marginTop: 12 }]}><TeamName name={match.a} theme={theme}/><View style={styles.scoreBox}><Text style={styles.scoreText}>{match.score ? `${match.score[0]} - ${match.score[1]}` : 'vs'}</Text></View><TeamName name={match.b} theme={theme} right /></View>
    <Text style={{ color: theme.muted, marginTop: 10, fontSize: 12 }}>📍 {match.venue}</Text>
  </TouchableOpacity>
}
function TeamName({ name, theme, right }) { const t=teams.find(x=>x.name===name); return <View style={{ flex:1, alignItems:right?'flex-end':'flex-start' }}><Text style={{ fontSize:26 }}>{t?.flag}</Text><Text numberOfLines={1} style={{ color:theme.text, fontWeight:'900' }}>{name}</Text></View> }

function MatchDetail({ match, theme }) {
  const [a, setA] = useState(match.userPrediction[0]); const [b, setB] = useState(match.userPrediction[1]); const [tab, setTab] = useState('Summary');
  const locked = match.status === 'final';
  const tabs = ['Summary', 'Head-to-head', match.a, match.b];
  return <Card theme={theme} style={{ marginTop: 12 }}>
    <View style={styles.rowBetween}><View><Text style={[styles.kicker, { color: COLORS.amber }]}>YOUR PREDICTION</Text><Text style={[styles.h3, { color: theme.text }]}>{match.a} vs {match.b}</Text></View><Pill color={locked ? theme.muted : COLORS.green}>{locked ? 'Locked' : 'Open'}</Pill></View>
    <View style={styles.scoreStepperRow}><Stepper label={match.a} value={a} setValue={setA} locked={locked} theme={theme}/><Stepper label={match.b} value={b} setValue={setB} locked={locked} theme={theme}/></View>
    <View style={styles.avgBox}><Text style={styles.avgKicker}>OUR USERS’ PREDICTION</Text><Text style={styles.avgText}>{match.a} {Math.round(match.avg[0])} - {Math.round(match.avg[1])} {match.b}</Text><Text style={styles.avgSub}>Based on {match.predictions.toLocaleString()} predictions</Text></View>
    <View style={styles.row}><TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.amber }]}><Text style={styles.actionText}>💾 Save</Text></TouchableOpacity><TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.green }]}><Text style={styles.actionText}>↗ Share</Text></TouchableOpacity></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>{tabs.map(x=><TouchableOpacity key={x} onPress={()=>setTab(x)} style={[styles.tabPill,{backgroundColor:tab===x?COLORS.amber:theme.soft}]}><Text style={{fontWeight:'900',color:tab===x?'#000':theme.text,fontSize:12}}>{x}</Text></TouchableOpacity>)}</ScrollView>
    {tab === 'Summary' && <Summary theme={theme}/>} {tab === 'Head-to-head' && <HeadToHead theme={theme} match={match}/>} {(tab===match.a || tab===match.b) && <TeamPanel theme={theme} team={tab}/>} 
  </Card>
}
function Stepper({ label, value, setValue, locked, theme }) { return <View style={[styles.stepper,{backgroundColor:theme.soft}]}><Text style={{ color: theme.text, fontWeight:'900', textAlign:'center' }}>{label}</Text><View style={styles.stepRow}><TouchableOpacity disabled={locked} onPress={()=>setValue(Math.max(0,value-1))} style={styles.stepBtn}><Text style={styles.stepText}>−</Text></TouchableOpacity><Text style={[styles.bigScore,{color:theme.text}]}>{value}</Text><TouchableOpacity disabled={locked} onPress={()=>setValue(value+1)} style={[styles.stepBtn,{backgroundColor:COLORS.amber}]}><Text style={styles.stepText}>+</Text></TouchableOpacity></View></View> }
function Summary({ theme }) { return <View style={{ marginTop:12 }}><Text style={[styles.h3,{color:theme.text}]}>Match Summary</Text><View style={styles.statGrid}>{['Possession 52%-48%','Shots 8-6','Corners 4-2','Cards 1-2'].map(x=><View key={x} style={[styles.stat,{backgroundColor:theme.soft}]}><Text style={{color:theme.text,fontWeight:'800'}}>{x}</Text></View>)}</View><Ad theme={theme} label="Native ad below summary" /></View> }
function HeadToHead({ theme, match }) { return <View style={{ marginTop:12 }}>{['2022 Friendly • 1-1','2018 Tournament • 2-0','2014 Friendly • 0-1'].map(x=><View key={x} style={[styles.listItem,{backgroundColor:theme.soft}]}><Text style={{color:theme.text}}>{match.a} vs {match.b} • {x}</Text></View>)}</View> }
function makeSquad(team){ const base=playerStats.filter(p=>p.team===team); const filler=['Goalkeeper','Right Back','Center Back','Left Back','Defensive Midfielder','Central Midfielder','Winger','Forward','Substitute Forward','Reserve Midfielder','Striker'].map((pos,i)=>({name:`${team} Player ${i+1}`,team,flag:teams.find(t=>t.name===team)?.flag||'🏳️',position:pos,goals:i%4,assists:i%3,matches:Math.max(1,6-(i%3)),photo:i%2?'🧑':'👤'})); return [...base,...filler].slice(0,11); }
function TeamPanel({ theme, team }) { const t=teams.find(x=>x.name===team); return <View style={{ marginTop:12 }}><View style={styles.row}><Text style={{fontSize:34}}>{t?.flag}</Text><View><Text style={[styles.h3,{color:theme.text}]}>{team}</Text><Text style={{color:theme.muted,fontSize:12}}>Coach: {t?.coach}</Text></View></View>{makeSquad(team).map((p,i)=><View key={p.name+i} style={[styles.playerRow,{backgroundColor:theme.soft}]}><Text style={styles.playerPhoto}>{p.photo}</Text><View style={{flex:1}}><Text style={{color:theme.text,fontWeight:'900'}}>{p.name}</Text><Text style={{color:theme.muted,fontSize:12}}>{p.position} • {p.matches} matches</Text></View><Pill>{p.goals} G</Pill><Pill color={theme.card}>{p.assists} A</Pill></View>)}</View> }

function GroupsScreen({ theme }) { const [champion,setChampion]=useState('Argentina'); const [q,setQ]=useState(''); const filtered=teams.filter(t=>`${t.name} ${t.confederation}`.toLowerCase().includes(q.toLowerCase())); const champ=teams.find(t=>t.name===champion); return <ScrollView contentContainerStyle={styles.screen}><Text style={[styles.h2,{color:theme.text}]}>Groups & Tournament Map</Text><Card theme={theme}><Text style={[styles.h3,{color:theme.text}]}>Pick Your Champion</Text><TextInput placeholder="Search any of the 48 teams..." placeholderTextColor={theme.muted} value={q} onChangeText={setQ} style={[styles.input,{color:theme.text,backgroundColor:theme.soft}]} /><View style={[styles.selectedChampion,{backgroundColor:theme.soft}]}><Text style={{color:COLORS.amber,fontWeight:'900',fontSize:11}}>SELECTED CHAMPION</Text><Text style={{color:theme.text,fontWeight:'900',fontSize:18}}>{champ?.flag} {champion}</Text></View><View style={styles.teamGrid}>{filtered.map(t=><TouchableOpacity key={t.name} onPress={()=>setChampion(t.name)} style={[styles.teamTile,{backgroundColor:champion===t.name?'#FBBF2433':theme.soft,borderColor:champion===t.name?COLORS.amber:theme.border}]}><Text style={{fontSize:24}}>{t.flag}</Text><Text numberOfLines={1} style={{color:theme.text,fontWeight:'900'}}>{t.name}</Text><Text style={{color:theme.muted,fontSize:10}}>{t.confederation}</Text></TouchableOpacity>)}</View><TouchableOpacity style={[styles.fullBtn,{backgroundColor:COLORS.green}]}><Text style={styles.actionText}>Share Champion Pick</Text></TouchableOpacity></Card><SponsorCard theme={theme}/><Ad theme={theme}/>{tournamentGroups.map(g=><Card key={g.label} theme={theme}><Text style={[styles.h3,{color:theme.text}]}>{g.label}</Text><View style={styles.groupGrid}>{g.teams.map(t=><TouchableOpacity key={t.name} onPress={()=>setChampion(t.name)} style={[styles.groupTeam,{backgroundColor:theme.soft}]}><Text style={{fontSize:22}}>{t.flag}</Text><Text numberOfLines={1} style={{color:theme.text,fontSize:10,fontWeight:'800'}}>{t.name}</Text></TouchableOpacity>)}</View></Card>)}</ScrollView> }

function PlayersScreen({ theme }) { const [q,setQ]=useState(''); const [pos,setPos]=useState('All'); const positions=['All','Forward','Winger','Midfielder','Defender','Goalkeeper']; const filtered=playerStats.filter(p=>`${p.name} ${p.team} ${p.position}`.toLowerCase().includes(q.toLowerCase())).filter(p=>pos==='All'||p.position.toLowerCase().includes(pos.toLowerCase())).sort((a,b)=>b.goals-a.goals||b.assists-a.assists); return <ScrollView contentContainerStyle={styles.screen}><Text style={[styles.h2,{color:theme.text}]}>Players & Goals</Text><TextInput placeholder="Search player, team, or position..." placeholderTextColor={theme.muted} value={q} onChangeText={setQ} style={[styles.input,{color:theme.text,backgroundColor:theme.card,borderColor:theme.border}]} /><ScrollView horizontal showsHorizontalScrollIndicator={false}>{positions.map(x=><TouchableOpacity key={x} onPress={()=>setPos(x)} style={[styles.tabPill,{backgroundColor:pos===x?COLORS.amber:theme.soft}]}><Text style={{fontWeight:'900',color:pos===x?'#000':theme.text}}>{x}</Text></TouchableOpacity>)}</ScrollView><Card theme={theme}><Text style={{color:theme.text,fontWeight:'800'}}>Tournament player rankings show position, goals, assists, and matches played.</Text></Card>{filtered.map((p,i)=><View key={p.name} style={[styles.leaderRow,{backgroundColor:theme.card,borderColor:theme.border}]}><Text style={{color:COLORS.amber,fontWeight:'900',fontSize:18}}>#{i+1}</Text><Text style={styles.leaderPhoto}>{p.photo}</Text><View style={{flex:1}}><Text style={{color:theme.text,fontWeight:'900'}}>{p.name}</Text><Text style={{color:theme.muted,fontSize:12}}>{p.flag} {p.team} • {p.position} • {p.matches} matches</Text></View><View style={styles.pointsBox}><Text style={styles.points}>{p.goals}</Text><Text style={styles.pointsLabel}>goals</Text></View></View>)}<Ad theme={theme} label="Player stats ad placeholder" /></ScrollView> }

function NewsScreen({ theme }) { return <ScrollView contentContainerStyle={styles.screen}><Text style={[styles.h2,{color:theme.text}]}>World Cup + Team News</Text><SponsorCard theme={theme}/>{news.map(n=><Card key={n.title} theme={theme}><View style={styles.rowBetween}><Pill>{n.tag}</Pill><Text style={{color:theme.muted,fontSize:12}}>{n.time}</Text></View><Text style={[styles.h3,{color:theme.text,marginTop:8}]}>{n.title}</Text><Text style={{color:theme.muted,fontSize:12}}>{n.source} • Short preview only. Tap later to read full article at source.</Text></Card>)}<Ad theme={theme} label="News native ad"/></ScrollView> }
function LeaderboardScreen({ theme }) { return <ScrollView contentContainerStyle={styles.screen}><Text style={[styles.h2,{color:theme.text}]}>Top Predictors</Text><Card theme={theme}><Text style={{color:theme.text,fontWeight:'800'}}>Only users with correct predictions appear here. Leaderboard uses nickname + profile picture. Email is never shown.</Text></Card><SponsorCard theme={theme}/>{leaders.map(l=><View key={l.nick} style={[styles.leaderRow,{backgroundColor:theme.card,borderColor:theme.border}]}><Text style={{color:COLORS.amber,fontWeight:'900',fontSize:18}}>#{l.rank}</Text><Text style={styles.leaderPhoto}>{l.photo}</Text><View style={{flex:1}}><Text style={{color:theme.text,fontWeight:'900'}}>{l.nick}</Text><Text style={{color:theme.muted,fontSize:12}}>{l.country} • {l.exact} exact • {l.correct} correct games</Text></View><View style={styles.pointsBox}><Text style={styles.points}>{l.points}</Text><Text style={styles.pointsLabel}>pts</Text></View></View>)}</ScrollView> }

function ProfileScreen({ theme }) { const [photo,setPhoto]=useState(null); const [country,setCountry]=useState('Not selected'); async function choosePhoto(){ const res=await ImagePicker.launchImageLibraryAsync({mediaTypes:ImagePicker.MediaTypeOptions.Images,allowsEditing:true,quality:0.8}); if(!res.canceled) setPhoto(res.assets[0].uri); } async function getCountry(){ const perm=await Location.requestForegroundPermissionsAsync(); if(perm.status!=='granted'){Alert.alert('Permission needed','Location permission was not granted.');return;} const loc=await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Balanced}); const geo=await Location.reverseGeocodeAsync(loc.coords); setCountry(geo?.[0]?.country || 'Country found'); }
  const items=['Edit name, nickname, age, sex','Theme: light or dark','Privacy Policy','Terms / User Policy','Delete account request','Sign in: Google, Apple, email, or guest']; return <ScrollView contentContainerStyle={styles.screen}><Text style={[styles.h2,{color:theme.text}]}>Profile & Settings</Text><Card theme={theme}><View style={styles.row}><TouchableOpacity onPress={choosePhoto}>{photo?<Image source={{uri:photo}} style={styles.profileImg}/>:<View style={styles.profileImg}><Text style={{fontSize:30}}>🧑</Text></View>}</TouchableOpacity><View style={{flex:1}}><Text style={[styles.h3,{color:theme.text}]}>Nickname: GoalKing</Text><Text style={{color:theme.muted,fontSize:12}}>Name and email stay private. Nickname appears on leaderboard.</Text></View></View><TouchableOpacity onPress={getCountry} style={[styles.fullBtn,{backgroundColor:COLORS.blue,marginTop:12}]}><Text style={styles.actionText}>Use Phone Location: {country}</Text></TouchableOpacity></Card>{items.map(x=><Card key={x} theme={theme}><Text style={{color:theme.text,fontWeight:'800'}}>{x}</Text></Card>)}</ScrollView> }
function AdminScreen({ theme }) { const rows=['Match Manager: update scores, status, halftime lock, final result','News Manager: manual posts + free source backup','Sponsor Manager: logo, text, link, start/end date','User Manager: search users, export Excel/CSV, delete requests','Ads / AdMob: placement IDs and revenue dashboard link','Admin Invitations: invite admins by email']; return <ScrollView contentContainerStyle={styles.screen}><Text style={[styles.h2,{color:theme.text}]}>Admin Preview</Text><View style={styles.statGrid}>{['Users 12,480','Predictions 86,210','Sessions 31,004','Sponsor Clicks 4,992'].map(x=><View key={x} style={[styles.stat,{backgroundColor:theme.card,borderColor:theme.border}]}><Text style={{color:theme.text,fontWeight:'900'}}>{x}</Text></View>)}</View>{rows.map(x=><Card key={x} theme={theme}><Text style={{color:theme.text,fontWeight:'800'}}>{x}</Text></Card>)}<Card theme={theme}><Text style={{color:theme.text}}>User data should be stored in a secure database. Admin can export Excel/CSV reports instead of using Excel as the main database.</Text></Card></ScrollView> }

const tabs = [
  ['matches','Matches','calendar'],['groups','Groups','trophy'],['news','News','newspaper'],['players','Players','people'],['leaders','Top','star'],['profile','Menu','person'],['admin','Admin','shield-checkmark']
];

export default function App() {
  const [dark, setDark] = useState(true); const [active, setActive] = useState('matches'); const theme = useTheme(dark);
  const screen = useMemo(()=>({matches:<MatchesScreen theme={theme}/>,groups:<GroupsScreen theme={theme}/>,news:<NewsScreen theme={theme}/>,players:<PlayersScreen theme={theme}/>,leaders:<LeaderboardScreen theme={theme}/>,profile:<ProfileScreen theme={theme}/>,admin:<AdminScreen theme={theme}/>}[active]),[active,theme]);
  return <SafeAreaView style={[styles.app,{backgroundColor:theme.bg,paddingTop:Platform.OS==='android'?StatusBar.currentHeight:0}]}><ExpoStatusBar style={dark?'light':'dark'} /><Header dark={dark} setDark={setDark} theme={theme}/><View style={{flex:1}}>{screen}</View><View style={[styles.bottomNav,{backgroundColor:theme.card,borderTopColor:theme.border}]}>{tabs.map(([key,label,icon])=><TouchableOpacity key={key} onPress={()=>setActive(key)} style={[styles.navItem,{backgroundColor:active===key?COLORS.amber:'transparent'}]}><Ionicons name={icon} size={18} color={active===key?'#000':theme.text}/><Text style={{fontSize:9,fontWeight:'900',color:active===key?'#000':theme.text}}>{label}</Text></TouchableOpacity>)}</View></SafeAreaView>
}

const styles = StyleSheet.create({
  app:{flex:1}, header:{paddingHorizontal:16,paddingBottom:12,borderBottomWidth:1}, headerRow:{flexDirection:'row',alignItems:'center',gap:12}, logo:{width:58,height:58,borderRadius:29,backgroundColor:'#fff'}, kicker:{fontSize:10,fontWeight:'900',letterSpacing:1.5}, title:{fontSize:20,fontWeight:'900',lineHeight:22}, iconBtn:{width:42,height:42,borderRadius:18,alignItems:'center',justifyContent:'center'}, notice:{backgroundColor:'#FBBF2430',padding:10,borderRadius:18,marginTop:10}, noticeText:{fontSize:12,color:'#FDE68A'}, screen:{padding:16,paddingBottom:100,gap:12}, h2:{fontSize:22,fontWeight:'900'}, h3:{fontSize:16,fontWeight:'900'}, row:{flexDirection:'row',alignItems:'center',gap:10}, rowBetween:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10}, card:{borderWidth:1,borderRadius:24,padding:14}, pill:{borderRadius:20,paddingHorizontal:10,paddingVertical:5}, pillText:{fontSize:10,fontWeight:'900',color:'#000'}, ad:{borderWidth:1,borderStyle:'dashed',borderRadius:18,padding:12,alignItems:'center'}, bee:{width:48,height:48,borderRadius:18,backgroundColor:COLORS.amber,alignItems:'center',justifyContent:'center'}, matchCard:{borderWidth:1,borderRadius:24,padding:14}, scoreBox:{backgroundColor:'#000',borderRadius:14,paddingHorizontal:14,paddingVertical:8}, scoreText:{color:'#fff',fontWeight:'900',fontSize:18}, scoreStepperRow:{flexDirection:'row',gap:10,marginTop:12}, stepper:{flex:1,borderRadius:20,padding:12}, stepRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,marginTop:8}, stepBtn:{width:38,height:38,borderRadius:14,backgroundColor:'#E5E7EB',alignItems:'center',justifyContent:'center'}, stepText:{fontSize:22,fontWeight:'900',color:'#000'}, bigScore:{fontSize:30,fontWeight:'900',minWidth:34,textAlign:'center'}, avgBox:{backgroundColor:'#000',borderRadius:18,padding:12,alignItems:'center',marginTop:12}, avgKicker:{color:COLORS.amber,fontWeight:'900',fontSize:11}, avgText:{color:'#fff',fontWeight:'900',fontSize:20}, avgSub:{color:'#D1D5DB',fontSize:11}, actionBtn:{flex:1,borderRadius:16,padding:13,alignItems:'center',marginTop:12}, actionText:{fontWeight:'900',color:'#000'}, tabPill:{borderRadius:18,paddingHorizontal:14,paddingVertical:8,marginRight:8}, statGrid:{flexDirection:'row',flexWrap:'wrap',gap:10}, stat:{borderRadius:18,padding:12,flexBasis:'47%',borderWidth:1}, listItem:{padding:12,borderRadius:16,marginTop:8}, playerRow:{flexDirection:'row',alignItems:'center',gap:8,padding:10,borderRadius:18,marginTop:8}, playerPhoto:{fontSize:24,width:38,textAlign:'center'}, input:{borderWidth:1,borderRadius:18,padding:12,marginTop:10}, selectedChampion:{borderRadius:18,padding:12,marginVertical:10}, teamGrid:{flexDirection:'row',flexWrap:'wrap',gap:8}, teamTile:{width:'48%',borderWidth:1,borderRadius:18,padding:10}, fullBtn:{borderRadius:18,padding:14,alignItems:'center'}, groupGrid:{flexDirection:'row',gap:8,marginTop:8}, groupTeam:{flex:1,borderRadius:16,padding:8,alignItems:'center'}, leaderRow:{borderWidth:1,borderRadius:22,padding:12,flexDirection:'row',alignItems:'center',gap:10}, leaderPhoto:{fontSize:28,width:48,height:48,textAlign:'center',textAlignVertical:'center',backgroundColor:COLORS.amber,borderRadius:16,overflow:'hidden'}, pointsBox:{backgroundColor:'#000',borderRadius:16,paddingHorizontal:10,paddingVertical:8,alignItems:'center'}, points:{color:'#fff',fontWeight:'900',fontSize:18}, pointsLabel:{color:'#D1D5DB',fontSize:9}, profileImg:{width:66,height:66,borderRadius:22,backgroundColor:COLORS.amber,alignItems:'center',justifyContent:'center'}, bottomNav:{height:74,borderTopWidth:1,flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:4,paddingBottom:6}, navItem:{alignItems:'center',justifyContent:'center',gap:3,borderRadius:18,paddingVertical:8,paddingHorizontal:6,minWidth:48}
});

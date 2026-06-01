from pathlib import Path

p = Path('App.js')
s = p.read_text()

PHASE = 'Phase 3G notification preferences'

if 'PHASE3G_NOTIFICATION_PREFS' in s:
    print('Phase 3G notification preferences already applied.')
    raise SystemExit(0)

# 1) Add constants and helper functions after SUPPORT_EMAIL if possible.
marker = "const SUPPORT_EMAIL = 'danny@virtualbeehiveinc.com';\n"
insert = r'''

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
'''
if marker in s:
    s = s.replace(marker, marker + insert)
else:
    s = insert + '\n' + s

# 2) Add NotificationSettingsCard before MenuScreen.
marker2 = 'function MenuScreen({ dark, fg, profile = {}, saveProfile, admin, onClose, firebaseUser, onOpenSignIn, onSignOut, onOpenAdmin }) {'
component = r'''
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
      <Text style={[styles.sectionTitle, { color: fg }]}>Notifications</Text>
      <Text style={{ color: fg, marginBottom: 8 }}>
        Choose which reminders you want. Push notifications will be connected in a later update; these settings prepare your preferences now.
      </Text>
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
          <Text style={{ color: fg, fontWeight: '900' }}>{prefs[key] ? 'ON' : 'OFF'} • {label}</Text>
          <Text style={{ color: fg, opacity: 0.85, marginTop: 3 }}>{help}</Text>
        </TouchableOpacity>
      ))}
      <Text style={{ color: COLORS.blue, fontWeight: '900', marginTop: 10 }}>
        Build: Phase 3G notification preferences
      </Text>
    </View>
  );
}

'''
if marker2 in s:
    s = s.replace(marker2, component + marker2)
else:
    print('Warning: Could not find MenuScreen marker. Component was not inserted.')

# 3) Add card in Menu before Privacy & Legal card.
menu_marker = "        <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>\n          <Text style={[styles.sectionTitle, { color: fg }]}>Privacy & Legal</Text>"
menu_insert = "        <NotificationSettingsCard dark={dark} fg={fg} />\n" + menu_marker
if menu_marker in s:
    s = s.replace(menu_marker, menu_insert, 1)
else:
    print('Warning: Could not find Privacy & Legal card marker. Add <NotificationSettingsCard dark={dark} fg={fg} /> manually in MenuScreen.')

# 4) Update build label if a known build label exists.
for old in [
    'Build: Phase 3H celebration sharing',
    'Build: Phase 2S restore hotfix',
    'Build: Phase 2R hotfix',
]:
    s = s.replace(old, 'Build: Phase 3G notification preferences')

p.write_text(s)
print('Applied Phase 3G notification preferences patch to App.js.')

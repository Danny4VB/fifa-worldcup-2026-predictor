from pathlib import Path
import re

path = Path('App.js')
if not path.exists():
    raise SystemExit('App.js not found. Run this script from the project root.')

s = path.read_text()
original = s
changes = []

def replace_once(old, new, label):
    global s
    if old in s:
        s = s.replace(old, new, 1)
        changes.append(label)
    else:
        print(f'WARNING: Could not find target for {label}')

# 1) Shorten Matches helper text.
s = s.replace(
    'All 104 tournament matches are listed. Tap any match to predict before halftime.',
    'Tap any match to predict before halftime.'
)
changes.append('shortened Matches helper text')

# 2) Add simple bouncing soccer ball component if not already present.
if 'function BouncingBall(' not in s:
    marker = 'function Matches({ dark, fg, predictions, setSelected, adSettings }) {'
    comp = r'''
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

'''
    if marker in s:
        s = s.replace(marker, comp + marker, 1)
        changes.append('added small bouncing soccer ball component')
    else:
        print('WARNING: Could not insert BouncingBall component')
else:
    print('BouncingBall already exists; skipping component insert')

# 3) Replace Matches title block with a row containing smaller title + animated ball.
old_block = """      <Text style={[styles.big, { color: fg }]}>Matches</Text>\n      <Text style={{ color: fg, marginBottom: 8 }}>Tap any match to predict before halftime.</Text>"""
new_block = """      <View style={styles.matchesTitleRow}>\n        <Text style={[styles.matchesTitle, { color: fg }]}>Matches</Text>\n        <BouncingBall />\n      </View>\n      <Text style={[styles.matchesHelp, { color: fg }]}>Tap any match to predict before halftime.</Text>"""
if old_block in s:
    s = s.replace(old_block, new_block, 1)
    changes.append('polished Matches title row')
else:
    print('WARNING: Matches title block not found; trying regex fallback')
    pattern = re.compile(r"\s*<Text style=\{\[styles\.big, \{ color: fg \}\]\}>Matches</Text>\n\s*<Text style=\{\{ color: fg, marginBottom: 8 \}\}>Tap any match to predict before halftime\.</Text>")
    repl = "\n      <View style={styles.matchesTitleRow}>\n        <Text style={[styles.matchesTitle, { color: fg }]}>Matches</Text>\n        <BouncingBall />\n      </View>\n      <Text style={[styles.matchesHelp, { color: fg }]}>Tap any match to predict before halftime.</Text>"
    s, n = pattern.subn(repl, s, count=1)
    if n:
        changes.append('polished Matches title row via regex')

# 4) Replace selected style lines. These exact replacements are intentionally conservative.
style_replacements = [
    (
        "header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: '#1e293b' },",
        "header: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1e293b' },",
        'made top app header taller'
    ),
    (
        "logo: { width: 42, height: 42, borderRadius: 21 },",
        "logo: { width: 52, height: 52, borderRadius: 26 },",
        'made app logo larger'
    ),
    (
        "title: { fontSize: 16, fontWeight: '900' },",
        "title: { fontSize: 17, fontWeight: '900', lineHeight: 20 },",
        'improved app title sizing'
    ),
    (
        "big: { fontSize: 22, fontWeight: '900', marginBottom: 8 },",
        "big: { fontSize: 20, fontWeight: '900', marginBottom: 8 },",
        'reduced generic big title size'
    ),
    (
        "sponsor: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10, overflow: 'hidden', borderBottomWidth: 1, borderBottomColor: COLORS.slate },",
        "sponsor: { minHeight: 96, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14, overflow: 'hidden', borderBottomWidth: 1, borderBottomColor: COLORS.slate },",
        'made sponsor bar taller'
    ),
    (
        "sponsorLogo: { width: 54, height: 54, borderRadius: 12, backgroundColor: '#ffffff' },",
        "sponsorLogo: { width: 74, height: 60, borderRadius: 14, backgroundColor: '#ffffff' },",
        'improved sponsor logo frame'
    ),
    (
        "sponsorLogoFallback: { width: 54, height: 54, borderRadius: 12, borderWidth: 1, borderColor: COLORS.amber, alignItems: 'center', justifyContent: 'center' },",
        "sponsorLogoFallback: { width: 74, height: 60, borderRadius: 14, borderWidth: 1, borderColor: COLORS.amber, alignItems: 'center', justifyContent: 'center' },",
        'improved sponsor logo fallback frame'
    ),
    (
        "sponsorName: { fontWeight: '900', fontSize: 16 },",
        "sponsorName: { fontWeight: '900', fontSize: 18, lineHeight: 22 },",
        'made sponsor name larger'
    ),
    (
        "sponsorText: { fontWeight: '800', fontSize: 13, color: COLORS.amber, width: 720 },",
        "sponsorText: { fontWeight: '800', fontSize: 14, color: COLORS.amber, width: 760, marginTop: 2 },",
        'improved sponsor message text'
    ),
]
for old, new, label in style_replacements:
    if old in s:
        s = s.replace(old, new, 1)
        changes.append(label)
    else:
        print(f'WARNING: Style target not found for {label}')

# 5) Add new styles before nav if missing.
if 'matchesTitleRow:' not in s:
    anchor = "  nav: { flexDirection: 'row', gap: 4, padding: 8, borderTopWidth: 1, borderTopColor: '#1e293b' },"
    insert = """  matchesTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },\n  matchesTitle: { fontSize: 20, fontWeight: '900' },\n  matchesHelp: { marginBottom: 8, fontSize: 13, lineHeight: 18 },\n  bouncingBall: { fontSize: 22 },\n"""
    if anchor in s:
        s = s.replace(anchor, insert + anchor, 1)
        changes.append('added Matches title/ball styles')
    else:
        print('WARNING: Could not add new match title styles')
else:
    print('Matches title styles already exist; skipping')

# 6) Add build label update if current label exists.
s = s.replace('Build: Phase 2U sponsor/admin/share fix', 'Build: Phase 2V visual polish')
s = s.replace('Build: Phase 2S restore hotfix', 'Build: Phase 2V visual polish')

if s == original:
    print('No changes were made. App.js may already be patched or structure changed.')
else:
    path.write_text(s)
    print('Phase 2V visual polish patch applied.')
    print('Changes:')
    for c in changes:
        print(f'- {c}')

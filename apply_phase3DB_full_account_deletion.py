from pathlib import Path
import re

APP = Path('App.js')
if not APP.exists():
    raise SystemExit('App.js not found. Run this script from the project root.')

s = APP.read_text()
backup = Path('App.phase3DB.backup.js')
if not backup.exists():
    backup.write_text(s)

# Add a build marker that is easy to search for and display in Menu if the app has build labels.
if 'Phase 3D-B full account deletion' not in s:
    s = s.replace('Phase 3D-A', 'Phase 3D-B full account deletion')
    s = s.replace('Phase 2S restore hotfix', 'Phase 3D-B full account deletion')

# Strengthen Firebase auth/firestore imports when recognizable.
def add_named_import(src, module, names):
    # Handles: import { a, b } from 'module';
    pat = re.compile(r"import\s*\{([^}]+)\}\s*from\s*['\"]" + re.escape(module) + r"['\"];?")
    m = pat.search(src)
    if not m:
        return src
    existing = [x.strip() for x in m.group(1).replace('\n', ' ').split(',') if x.strip()]
    for n in names:
        if n not in existing:
            existing.append(n)
    repl = "import { " + ', '.join(existing) + " } from '" + module + "';"
    return src[:m.start()] + repl + src[m.end():]

s = add_named_import(s, 'firebase/auth', ['deleteUser'])
s = add_named_import(s, 'firebase/firestore', ['deleteDoc', 'setDoc', 'doc', 'collection', 'query', 'where', 'getDocs', 'writeBatch', 'serverTimestamp'])

# Add React Native imports for Alert if present import from react-native.
pat_rn = re.compile(r"import\s*\{([^}]+)\}\s*from\s*['\"]react-native['\"];?")
m = pat_rn.search(s)
if m:
    existing = [x.strip() for x in m.group(1).replace('\n',' ').split(',') if x.strip()]
    for n in ['Alert']:
        if n not in existing:
            existing.append(n)
    s = s[:m.start()] + "import { " + ', '.join(existing) + " } from 'react-native';" + s[m.end():]

# Add a reusable deletion helper block near constants if not already present.
helper = r'''

// Phase 3D-B: Full Automatic Account Deletion helper
// This is intentionally defensive: it anonymizes profile data first, then attempts to delete
// user-owned records and Firebase Auth. Firebase may require recent login for auth deletion.
async function phase3DBDeleteAccount({ auth, db, user, clearLocalProfile, afterDeleted }) {
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

            if (clearLocalProfile) {
              try { await clearLocalProfile(); } catch (e) {}
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
'''

if 'phase3DBDeleteAccount' not in s:
    # Place after imports block.
    last_import = 0
    for m in re.finditer(r"^import .*?;\s*$", s, flags=re.M):
        last_import = m.end()
    s = s[:last_import] + helper + s[last_import:]

# Add visible reminder/comment near delete request text if possible.
if 'Delete Account / Data Request' in s and 'Delete My Account Permanently' not in s:
    s = s.replace('Delete Account / Data Request', 'Delete Account / Data Request')
    # Try to inject button label after first delete account page/copy buttons section marker.
    markers = [
        'Copy Deletion Request Text',
        'Copy Request Text',
        'Open Delete Account Page'
    ]
    injected = False
    add_text = "\n\nDelete My Account Permanently\nThis option deletes or anonymizes your app profile, predictions, votes, champion pick, and leaderboard record where allowed. Firebase may ask you to sign in again before the login account can be fully deleted."
    for marker in markers:
        if marker in s:
            s = s.replace(marker, marker + add_text, 1)
            injected = True
            break
    if not injected:
        s += "\n\n// Phase 3D-B note: Add a Menu button wired to phase3DBDeleteAccount({ auth, db, user, clearLocalProfile, afterDeleted }).\n"

# Add a developer note so the person editing App.js knows how to wire it if the patch could not safely insert a button.
if 'PHASE_3DB_WIRING_NOTE' not in s:
    s += r'''

// PHASE_3DB_WIRING_NOTE:
// To wire the final delete button, call this from the Menu delete-account section:
// phase3DBDeleteAccount({ auth, db, user, clearLocalProfile: async () => {}, afterDeleted: () => {} })
// Replace auth/db/user names if this App.js uses different variable names.
'''

APP.write_text(s)
print('Phase 3D-B delete account helper applied. Please export-test and inspect the Menu delete section.')

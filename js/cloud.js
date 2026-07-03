// Firebase auth + Firestore cloud sync
const firebaseConfig = {
  apiKey: "AIzaSyAXVhQLLQDnm3tKL8kRc380CW-vEq8Q6_c",
  authDomain: "one-more-kilo-d2498.firebaseapp.com",
  projectId: "one-more-kilo-d2498",
  storageBucket: "one-more-kilo-d2498.firebasestorage.app",
  messagingSenderId: "467329163900",
  appId: "1:467329163900:web:0d9794872ee8d74ce4dff9"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {});
const db = firebase.firestore();
let currentUser = null;
let syncTimer = null;


// ---- cloud backup (Firebase) ----
let authMode = 'login';
const INVITE_CODE = 'mellon'; // soft gate — this app is invite-only, ask the owner for the code. Change this string to change the code (compared lowercase, so case doesn't matter).

function headerAccountClick() { if (!currentUser) openLoginOverlay(false); }

function openLoginOverlay(isInitial) {
  authMode = 'login';
  document.getElementById('login-overlay').dataset.initial = isInitial ? '1' : '';
  updateAuthModeUI();
  document.getElementById('login-error').textContent = '';
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-invite').value = '';
  document.getElementById('login-overlay').hidden = false;
}
function closeLoginOverlay() { document.getElementById('login-overlay').hidden = true; sessionStorage.setItem('wk_entered', '1'); }

// Validate the invite code against the serverless function when hosted on Netlify;
// fall back to the local constant elsewhere (GitHub Pages, local file).
async function checkInvite(guess) {
  try {
    const res = await fetch('/.netlify/functions/invite', { method: 'POST', body: JSON.stringify({ code: guess }) });
    if (res.ok) { const j = await res.json(); return !!j.ok; }
  } catch (e) {}
  return guess.trim().toLowerCase() === INVITE_CODE;
}

async function skipLogin() {
  // Existing users (or devices that already passed the gate) go straight through
  if (getProfile() || localStorage.getItem('wk_invite_ok')) {
    closeLoginOverlay();
    if (!getProfile()) document.getElementById('onboard-overlay').hidden = false;
    return;
  }
  const wrap = document.getElementById('login-invite-wrap');
  const errEl = document.getElementById('login-error');
  const inviteEl = document.getElementById('login-invite');
  if (wrap.hidden || !inviteEl.value.trim()) {
    wrap.hidden = false;
    errEl.textContent = 'Guests need the invite code too — answer the riddle above to continue.';
    inviteEl.focus();
    return;
  }
  const invite = inviteEl.value;
  if (!(await checkInvite(invite))) { errEl.textContent = 'Invalid invite code.'; return; }
  localStorage.setItem('wk_invite_ok', '1');
  errEl.textContent = '';
  closeLoginOverlay();
  document.getElementById('onboard-overlay').hidden = false;
}

function toggleAuthMode() {
  authMode = authMode === 'login' ? 'signup' : 'login';
  updateAuthModeUI();
}
function updateAuthModeUI() {
  const isLogin = authMode === 'login';
  const isInitial = !!document.getElementById('login-overlay').dataset.initial;
  document.getElementById('login-title').textContent = isLogin ? 'Welcome back' : 'Create your account';
  document.getElementById('login-sub').textContent = isLogin ? 'Log in to restore your data, or start fresh on this device.' : 'This app is invite-only — ask the owner for an invite code to sign up.';
  document.getElementById('login-submit').textContent = isLogin ? 'Log in' : 'Sign up';
  document.getElementById('login-mode-toggle').textContent = isLogin ? 'New here? Sign up instead' : 'Already have an account? Log in';
  document.getElementById('login-password').autocomplete = isLogin ? 'current-password' : 'new-password';
  document.getElementById('login-invite-wrap').hidden = isLogin;
  // Guest entry: always offered on the sign-up view; on the login view only at app entry
  const skipBtn = document.getElementById('login-skip');
  skipBtn.style.display = (isLogin && !isInitial) ? 'none' : '';
  skipBtn.textContent = getProfile() ? 'Continue to app' : (isLogin ? 'Continue without an account' : 'Continue as guest');
}

// Submitting via a real <form> (rather than a plain button click) is what lets Safari/Chrome/Edge
// offer to save the password and autofill it next time.
function handleAuthSubmit(event) {
  event.preventDefault();
  submitAuth();
  return false;
}

async function submitAuth() {
  const email = document.getElementById('login-email').value.trim();
  const pw = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  errEl.textContent = '';
  if (!email || !pw) { errEl.textContent = 'Enter an email and password.'; return; }
  if (authMode === 'signup') {
    const invite = document.getElementById('login-invite').value;
    if (!(await checkInvite(invite))) { errEl.textContent = 'Invalid invite code.'; return; }
  }
  const action = authMode === 'login' ? auth.signInWithEmailAndPassword(email, pw) : auth.createUserWithEmailAndPassword(email, pw);
  action.catch(e => { errEl.textContent = e.message; });
}
function logOut() {
  auth.signOut().then(() => {
    ['wk_profile', 'wk_logs', 'wk_checklist', 'wk_milestones', 'wk_weightlog', 'wk_daydone', 'wk_routines', 'wk_active', 'wk_extras', 'wk_photos'].forEach(k => localStorage.removeItem(k));
    // Clear the session flag so the login screen greets them again
    sessionStorage.removeItem('wk_entered');
    location.href = 'index.html';
  });
}

function renderHeaderAccount() {
  const el = document.getElementById('header-account');
  if (!el) return;
  if (currentUser) {
    // Email + logout live on the Profile page only; the header shows an avatar shortcut
    const profile = getProfile();
    const initial = ((profile && profile.name) || currentUser.email || '?')[0].toUpperCase();
    const face = (profile && profile.photo) ? `<img src="${profile.photo}" alt=""/>` : initial;
    el.innerHTML = `<a class="header-avatar" href="profile.html" aria-label="Profile">${face}</a>`;
  } else {
    el.innerHTML = `<button class="header-account-btn" onclick="headerAccountClick()">Log in</button>`;
  }
}

function setSyncStatus(text) { const el = document.getElementById('sync-status'); if (el) el.textContent = text; }

function collectLocalState() {
  return {
    profile: getProfile(),
    logs: getLogs(),
    checklist: getChecklist(),
    milestones: getMilestones(),
    weightlog: getWeightLog(),
    daydone: getDayDone(),
    routines: getRoutines(),
    active: getActive(),
    extras: getExtras(),
    updatedAt: Date.now()
  };
}

function applyCloudState(data) {
  if (data.profile) saveProfile(data.profile);
  if (data.logs) saveLogs(data.logs);
  if (data.checklist) saveChecklist(data.checklist);
  if (data.milestones) saveMilestones(data.milestones);
  if (data.weightlog) saveWeightLog(data.weightlog);
  if (data.daydone) saveDayDone(data.daydone);
  if (data.routines) saveRoutines(data.routines);
  if (data.active) saveActive(data.active);
  if (data.extras) saveExtras(data.extras);
  const profile = getProfile();
  document.getElementById('onboard-overlay').hidden = true;
  closeLoginOverlay();
  if (profile) applyBodyType(profile.bodyType);
}

function pullFromCloud() {
  if (!currentUser) return;
  setSyncStatus('Syncing…');
  pullPhotosFromCloud();
  db.collection('users').doc(currentUser.uid).get().then(doc => {
    if (doc.exists) {
      applyCloudState(doc.data());
      setSyncStatus('Synced');
    } else if (getProfile()) {
      syncToCloudNow();
    } else {
      document.getElementById('onboard-overlay').hidden = false;
    }
  }).catch(() => setSyncStatus('Sync error — will retry'));
}

function syncToCloud() {
  if (!currentUser) return;
  clearTimeout(syncTimer);
  setSyncStatus('Syncing…');
  syncTimer = setTimeout(syncToCloudNow, 1500);
}
function syncToCloudNow() {
  if (!currentUser) return;
  db.collection('users').doc(currentUser.uid).set(collectLocalState(), { merge: true })
    .then(() => setSyncStatus('Synced'))
    .catch(() => setSyncStatus('Sync error — will retry'));
}

auth.onAuthStateChanged(user => {
  currentUser = user;
  renderHeaderAccount();
  const outEl = document.getElementById('account-status-signed-out');
  const inEl = document.getElementById('account-status-signed-in');
  if (user) {
    if (outEl) outEl.hidden = true;
    if (inEl) inEl.hidden = false;
    const emailEl = document.getElementById('account-email');
    if (emailEl) emailEl.textContent = user.email;
    closeLoginOverlay();
    pullFromCloud();
  } else {
    if (outEl) outEl.hidden = false;
    if (inEl) inEl.hidden = true;
  }
});

// ---- password management ----
// Both flows use Firebase's email reset link: no old-password handling in the app,
// and it works even when the login session is stale.
function forgotPassword() {
  const email = document.getElementById('login-email').value.trim();
  const errEl = document.getElementById('login-error');
  if (!email) { errEl.textContent = 'Type your email above first, then tap "Forgot password?".'; return; }
  auth.sendPasswordResetEmail(email)
    .then(() => { errEl.style.color = 'var(--primary)'; errEl.textContent = `Reset link sent to ${email} — check your inbox.`; })
    .catch(e => { errEl.style.color = '#e87a50'; errEl.textContent = e.message; });
}

function changePassword() {
  if (!currentUser) return;
  const el = document.getElementById('account-msg');
  auth.sendPasswordResetEmail(currentUser.email)
    .then(() => { if (el) el.textContent = `Password change link sent to ${currentUser.email}.`; })
    .catch(e => { if (el) el.textContent = e.message; });
}

// ---- progress photos: synced one Firestore doc per photo (main doc has a 1MB cap) ----
function syncPhotoToCloud(photo) {
  if (!currentUser) return;
  db.collection('users').doc(currentUser.uid).collection('photos').doc(photo.id).set(photo).catch(() => {});
}
function deletePhotoFromCloud(id) {
  if (!currentUser) return;
  db.collection('users').doc(currentUser.uid).collection('photos').doc(id).delete().catch(() => {});
}
function pullPhotosFromCloud() {
  if (!currentUser) return;
  db.collection('users').doc(currentUser.uid).collection('photos').get().then(snap => {
    const local = getPhotos();
    const ids = new Set(local.map(p => p.id));
    let added = false;
    snap.forEach(doc => { if (!ids.has(doc.id)) { local.push(doc.data()); added = true; } });
    if (added) { savePhotosLocal(local); if (typeof renderGallery === 'function') renderGallery(); }
    // push any local-only photos up (e.g. taken while signed out)
    const cloudIds = new Set(); snap.forEach(doc => cloudIds.add(doc.id));
    local.filter(p => !cloudIds.has(p.id)).forEach(syncPhotoToCloud);
  }).catch(() => {});
}

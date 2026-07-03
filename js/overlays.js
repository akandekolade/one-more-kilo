// Onboarding + body-type/plan picker logic

// ---- onboarding + body type + plan length ----
let pendingBodyType = null;
let pendingDays = null;
let pendingSex = null;

function selectSexCard(s) {
  pendingSex = s;
  document.querySelectorAll('#onboard-sex button').forEach(b => b.classList.toggle('active', b.dataset.sex === s));
  checkOnboardReady();
}

function selectBodyTypeCard(bt) {
  pendingBodyType = bt;
  document.querySelectorAll('.bodytype-card').forEach(c => c.classList.toggle('selected', c.dataset.bt === bt));
  checkOnboardReady();
}

function selectDaysCard(n) {
  pendingDays = n;
  document.querySelectorAll('#onboard-days button').forEach(b => b.classList.toggle('active', parseInt(b.dataset.days, 10) === n));
  checkOnboardReady();
}

function checkOnboardReady() {
  const h = document.getElementById('onboard-height');
  const w = document.getElementById('onboard-weight');
  const name = document.getElementById('onboard-name');
  const age = document.getElementById('onboard-age');
  const btn = document.getElementById('onboard-submit');
  if (!btn) return;
  const isSwitch = document.getElementById('onboard-overlay').dataset.mode === 'switch';
  btn.disabled = isSwitch
    ? !(pendingBodyType && pendingDays)
    : !(pendingBodyType && pendingDays && pendingSex && name.value.trim() && age.value && h.value && w.value);
}

function completeOnboarding() {
  const overlay = document.getElementById('onboard-overlay');
  if (overlay.dataset.mode === 'switch') {
    if (!pendingBodyType || !pendingDays) return;
    const profile = getProfile() || {};
    profile.bodyType = pendingBodyType;
    profile.daysPerWeek = pendingDays;
    saveProfile(profile);
    overlay.hidden = true;
    overlay.dataset.mode = '';
    document.getElementById('onboard-hw').style.display = '';
    document.getElementById('onboard-title').textContent = 'Welcome to One more Kilo!';
    document.getElementById('onboard-submit').textContent = 'Get started';
    applyBodyType(pendingBodyType);
    return;
  }
  const h = parseFloat(document.getElementById('onboard-height').value);
  const w = parseFloat(document.getElementById('onboard-weight').value);
  const name = document.getElementById('onboard-name').value.trim();
  const age = parseInt(document.getElementById('onboard-age').value, 10);
  if (!pendingBodyType || !pendingDays || !pendingSex || !name || !age || !h || !w) return;
  saveProfile({ bodyType: pendingBodyType, daysPerWeek: pendingDays, heightCm: h, name, age, sex: pendingSex });
  const log = getWeightLog();
  log.push({ date: todayISO(), weight: w });
  saveWeightLog(log);
  overlay.hidden = true;
  applyBodyType(pendingBodyType);
}

function openBodyTypePicker() {
  pendingBodyType = currentBodyType;
  pendingDays = getDaysPerWeek();
  const overlay = document.getElementById('onboard-overlay');
  document.getElementById('onboard-title').textContent = 'Switch plan';
  document.querySelectorAll('.bodytype-card').forEach(c => c.classList.toggle('selected', c.dataset.bt === currentBodyType));
  document.querySelectorAll('#onboard-days button').forEach(b => b.classList.toggle('active', parseInt(b.dataset.days, 10) === pendingDays));
  document.getElementById('onboard-hw').style.display = 'none';
  document.getElementById('onboard-submit').textContent = 'Save changes';
  overlay.dataset.mode = 'switch';
  overlay.hidden = false;
  checkOnboardReady();
}

// ---- shared markup: overlays (onboarding, login, lightbox) + header + bottom nav ----
// Injected on every page so this markup lives in one place.
const SHARED_OVERLAYS_HTML = `
<div class="onboard-overlay" id="onboard-overlay" hidden>
  <div class="onboard-title" id="onboard-title">Welcome to One more Kilo!</div>
  <div class="onboard-sub">Pick how often you can train and the body type that best matches your goal — this builds your weekly plan. You can change both anytime from the Progress tab.</div>
  <div class="seg-label" style="margin-top:0">How many days a week can you train?</div>
  <div class="seg" id="onboard-days" style="margin-bottom:16px">
    <button data-days="4" onclick="selectDaysCard(4)">4 days</button>
    <button data-days="5" onclick="selectDaysCard(5)">5 days</button>
    <button data-days="6" onclick="selectDaysCard(6)">6 days</button>
    <button data-days="7" onclick="selectDaysCard(7)">7 days</button>
  </div>
  <div class="seg-label">Body type</div>
  <div id="bodytype-picker">
    <div class="bodytype-card" data-bt="ecto" onclick="selectBodyTypeCard('ecto')"><div class="bt-title">Ectomorph</div><div class="bt-body">Naturally lean, hard to gain weight. Heavy compound lifts, low reps, long rest, calorie surplus.</div></div>
    <div class="bodytype-card" data-bt="meso" onclick="selectBodyTypeCard('meso')"><div class="bt-title">Mesomorph</div><div class="bt-body">Naturally athletic. Balanced Push/Pull/Legs training, moderate reps, maintenance-to-slight-surplus.</div></div>
    <div class="bodytype-card" data-bt="endo" onclick="selectBodyTypeCard('endo')"><div class="bt-title">Endomorph</div><div class="bt-body">Gains muscle and fat easily. Higher-rep circuits, shorter rest, more cardio, calorie deficit.</div></div>
  </div>
  <div class="onboard-form">
    <div id="onboard-hw">
      <label for="onboard-name">Your name</label>
      <input type="text" id="onboard-name" maxlength="30" placeholder="e.g. Madison" oninput="checkOnboardReady()"/>
      <label for="onboard-age">Age</label>
      <input type="number" id="onboard-age" min="10" max="100" placeholder="e.g. 24" oninput="checkOnboardReady()"/>
      <label>Sex</label>
      <div class="seg" id="onboard-sex" style="margin-bottom:14px">
        <button data-sex="male" onclick="selectSexCard('male')">Male</button>
        <button data-sex="female" onclick="selectSexCard('female')">Female</button>
      </div>
      <label for="onboard-height">Height (cm)</label>
      <input type="number" id="onboard-height" min="100" max="250" placeholder="e.g. 175"/>
      <label for="onboard-weight">Current weight (kg)</label>
      <input type="number" id="onboard-weight" min="30" max="300" step="0.1" placeholder="e.g. 68"/>
    </div>
    <button id="onboard-submit" onclick="completeOnboarding()" disabled>Get started</button>
  </div>
</div>
<div class="onboard-overlay" id="login-overlay" hidden>
  <div class="onboard-title" id="login-title">Welcome back</div>
  <div class="onboard-sub" id="login-sub">Log in to restore your data, or start fresh on this device.</div>
  <form class="onboard-form" id="login-form" onsubmit="return handleAuthSubmit(event)" autocomplete="on">
    <div class="auth-panel">
      <label for="login-email">Email</label>
      <input type="email" id="login-email" name="email" autocomplete="username" placeholder="you@example.com"/>
      <label for="login-password">Password</label>
      <input type="password" id="login-password" name="password" autocomplete="current-password" placeholder="Password"/>
      <button type="button" class="forgot-link" onclick="forgotPassword()">Forgot Password?</button>
      <div id="login-invite-wrap" hidden>
        <label for="login-invite">Speak, friend, and enter.</label>
        <input type="text" id="login-invite" autocomplete="off" placeholder="Ask the app owner"/>
      </div>
    </div>
    <button type="submit" id="login-submit">Log in</button>
    <div class="info-body" id="login-error" style="margin-top:8px;color:#e87a50;text-align:center"></div>
    <button type="button" class="link-btn" id="login-mode-toggle" onclick="toggleAuthMode()">New here? Sign up instead</button>
    <button type="button" class="link-btn muted" id="login-skip" onclick="skipLogin()">Continue without an account</button>
  </form>
</div>
<div class="lightbox" id="lightbox" hidden onclick="lightboxBackdropClick(event)">
  <button class="lightbox-close" onclick="closeLightbox()" aria-label="Close">✕</button>
  <button class="step-arrow prev" onclick="lightboxFlip(-1);event.stopPropagation()" aria-label="Previous step">‹</button>
  <button class="step-arrow next" onclick="lightboxFlip(1);event.stopPropagation()" aria-label="Next step">›</button>
  <img id="lightbox-img" alt=""/>
  <div class="lightbox-caption" id="lightbox-caption"></div>
  <div class="lightbox-hint">Swipe or tap arrows to switch step · tap outside to close</div>
  <div class="lightbox-dots"><span class="step-dot active" id="lightbox-dot-0"></span><span class="step-dot" id="lightbox-dot-1"></span></div>
</div>
`;

// Inline SVG icons (kit-style filled glyphs, inherit currentColor)
const NAV_ITEMS = [
  { href: 'index.html', label: 'Plan', icon: '<svg viewBox="0 0 24 24" width="23" height="23" fill="currentColor"><path d="M3 11.2 12 4l9 7.2V20a1 1 0 0 1-1 1h-5.4v-5.4H9.4V21H4a1 1 0 0 1-1-1z"/></svg>' },
  { href: 'progress.html', label: 'Progress', icon: '<svg viewBox="0 0 24 24" width="23" height="23" fill="currentColor"><rect x="4" y="12" width="3.6" height="8" rx="1.6"/><rect x="10.2" y="7" width="3.6" height="13" rx="1.6"/><rect x="16.4" y="3.5" width="3.6" height="16.5" rx="1.6"/></svg>' },
  { href: 'routines.html', label: 'Routines', icon: '<svg viewBox="0 0 24 24" width="23" height="23" fill="currentColor"><path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm1.5 4.4h7v1.8h-7zm0 4h7v1.8h-7zm0 4h4.6v1.8H8.5z"/></svg>' },
  { href: 'gallery.html', label: 'Gallery', icon: '<svg viewBox="0 0 24 24" width="23" height="23" fill="currentColor"><path d="M9 4h6l1.2 2H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.8zM12 9.2A4.3 4.3 0 1 0 12 17.8 4.3 4.3 0 0 0 12 9.2zm0 2a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6z"/></svg>' },
  { href: 'profile.html', label: 'Profile', icon: '<svg viewBox="0 0 24 24" width="23" height="23" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20.2c.7-3.6 4-5.7 8-5.7s7.3 2.1 8 5.7c-.1.5-.5.8-1 .8H5c-.5 0-.9-.3-1-.8z"/></svg>' }
];

function currentPageFile() {
  const f = location.pathname.split('/').pop();
  return f === '' ? 'index.html' : f;
}

function injectSharedChrome() {
  document.body.insertAdjacentHTML('afterbegin', SHARED_OVERLAYS_HTML);
  const page = currentPageFile();
  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.innerHTML = NAV_ITEMS.map(item =>
    `<a class="nav-item ${item.href === page ? 'active' : ''}" href="${item.href}"><span class="nav-icon">${item.icon}</span><span>${item.label}</span></a>`
  ).join('');
  document.body.appendChild(nav);
}
injectSharedChrome();

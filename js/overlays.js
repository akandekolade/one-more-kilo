// Onboarding + body-type/plan picker logic

// ---- onboarding + body type + plan length ----
let pendingBodyType = null;
let pendingDays = null;

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
  const btn = document.getElementById('onboard-submit');
  if (!btn) return;
  const isSwitch = document.getElementById('onboard-overlay').dataset.mode === 'switch';
  btn.disabled = isSwitch ? !(pendingBodyType && pendingDays) : !(pendingBodyType && pendingDays && h.value && w.value);
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
  if (!pendingBodyType || !pendingDays || !h || !w) return;
  saveProfile({ bodyType: pendingBodyType, daysPerWeek: pendingDays, heightCm: h });
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
    <label for="login-email">Email</label>
    <input type="email" id="login-email" name="email" autocomplete="username" placeholder="you@example.com"/>
    <label for="login-password">Password</label>
    <input type="password" id="login-password" name="password" autocomplete="current-password" placeholder="Password"/>
    <div id="login-invite-wrap" hidden>
      <label for="login-invite">Speak, friend, and enter.</label>
      <input type="text" id="login-invite" autocomplete="off" placeholder="Ask the app owner"/>
    </div>
    <button type="submit" id="login-submit">Log in</button>
    <div class="info-body" id="login-error" style="margin-top:8px;color:#e87a50"></div>
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

const NAV_ITEMS = [
  { href: 'index.html', icon: '📅', label: 'Plan' },
  { href: 'progress.html', icon: '📈', label: 'Progress' },
  { href: 'routines.html', icon: '🗂️', label: 'Routines' },
  { href: 'profile.html', icon: '👤', label: 'Profile' }
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

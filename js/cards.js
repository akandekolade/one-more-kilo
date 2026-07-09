// Exercise cards: images, lightbox, checklist, week checks, set logging, timers

function imgPathForStep(base, step) { return base.replace(/0\.jpg$/, step + '.jpg'); }

function renderImgInWrap(wrap, path, alt) {
  const slot = wrap.querySelector('.img-slot');
  const img = document.createElement('img');
  img.src = IMAGE_BASE + path;
  img.alt = alt;
  img.style.cursor = 'zoom-in';
  img.onclick = () => openLightbox(wrap.dataset.imgBase, parseInt(wrap.dataset.step || '0', 10), alt);
  img.onload = () => {
    slot.innerHTML = '';
    slot.appendChild(img);
    const c = document.createElement('div'); c.className = 'img-credit'; c.textContent = 'free-exercise-db CC0';
    slot.appendChild(c);
  };
  img.onerror = () => { slot.innerHTML = `<div class="img-error"><span style="font-size:28px">🏋️</span><span>${alt}</span></div>`; };
}

// ---- fullscreen image lightbox ----
const LIGHTBOX = { base: null, step: 0, alt: '' };
function openLightbox(base, step, alt) {
  LIGHTBOX.base = base; LIGHTBOX.step = step; LIGHTBOX.alt = alt;
  renderLightbox();
  document.getElementById('lightbox').hidden = false;
}
function renderLightbox() {
  const img = document.getElementById('lightbox-img');
  img.src = IMAGE_BASE + imgPathForStep(LIGHTBOX.base, String(LIGHTBOX.step));
  img.alt = LIGHTBOX.alt;
  document.getElementById('lightbox-caption').textContent = `${LIGHTBOX.alt} — Step ${LIGHTBOX.step + 1} of 2`;
  document.getElementById('lightbox-dot-0').classList.toggle('active', LIGHTBOX.step === 0);
  document.getElementById('lightbox-dot-1').classList.toggle('active', LIGHTBOX.step === 1);
}
function lightboxFlip(dir) {
  LIGHTBOX.step = (LIGHTBOX.step + dir + 2) % 2;
  renderLightbox();
}
function closeLightbox() { document.getElementById('lightbox').hidden = true; }
function lightboxBackdropClick(e) { if (e.target.id === 'lightbox') closeLightbox(); }

let touchStartX = null;
document.addEventListener('touchstart', e => {
  if (document.getElementById('lightbox').hidden) return;
  touchStartX = e.touches[0].clientX;
}, { passive: true });
document.addEventListener('touchend', e => {
  if (document.getElementById('lightbox').hidden || touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  touchStartX = null;
  if (Math.abs(dx) > 40) lightboxFlip(dx < 0 ? 1 : -1);
}, { passive: true });


function loadCardImage(card) {
  const wrap = card.querySelector('.ex-img-wrap');
  if (!wrap) return;
  renderImgInWrap(wrap, imgPathForStep(wrap.dataset.imgBase, wrap.dataset.step || '0'), card.querySelector('.ex-name').textContent);
}

function flipStep(key) {
  const card = document.querySelector(`.ex-card[data-ex-key="${key}"]`);
  if (!card) return;
  const wrap = card.querySelector('.ex-img-wrap');
  const newStep = wrap.dataset.step === '0' ? '1' : '0';
  wrap.dataset.step = newStep;
  renderImgInWrap(wrap, imgPathForStep(wrap.dataset.imgBase, newStep), card.querySelector('.ex-name').textContent);
  wrap.querySelectorAll('.step-dot').forEach(d => d.classList.toggle('active', d.dataset.dot === newStep));
}

function loadVisibleImages() {
  // Step photos load only once a card is expanded (collapsed rows show a lazy thumbnail)
  document.querySelectorAll('.ex-card.open').forEach(card => {
    const wrap = card.querySelector('.ex-img-wrap');
    if (wrap && !wrap.dataset.loaded) {
      wrap.dataset.loaded = '1';
      loadCardImage(card);
    }
  });
}


// ---- daily checklist ----
function toggleDone(key) {
  const card = document.querySelector(`.ex-card[data-ex-key="${key}"]`);
  if (!card) return;
  const checklist = getChecklist();
  const newState = !isDoneThisWeek(key);
  if (newState) {
    const today = todayISO();
    checklist[today] = checklist[today] || {};
    checklist[today][key] = true;
  } else {
    uncheckThisWeek(checklist, key);
  }
  saveChecklist(checklist);
  card.classList.toggle('done', newState);
  card.querySelector('.ex-check').classList.toggle('done', newState);
  const dayId = card.closest('[data-day-list]');
  if (dayId) {
    updateDayProgress(dayId.dataset.dayList);
    maybeUpgradeDayDone(dayId.dataset.dayList);
    renderWeekCheck(dayId.dataset.dayList);
  }
}

// Mark or clear every exercise of a day at once
function toggleAllDone(dayId) {
  const list = document.querySelector(`[data-day-list="${dayId}"]`);
  if (!list) return;
  const keys = [...list.querySelectorAll('.ex-card')].map(c => c.dataset.exKey);
  if (!keys.length) return;
  const allDone = keys.every(isDoneThisWeek);
  const checklist = getChecklist();
  if (allDone) {
    keys.forEach(k => uncheckThisWeek(checklist, k));
  } else {
    const today = todayISO();
    checklist[today] = checklist[today] || {};
    keys.forEach(k => { checklist[today][k] = true; });
  }
  saveChecklist(checklist);
  keys.forEach(k => {
    const card = list.querySelector(`.ex-card[data-ex-key="${k}"]`);
    if (!card) return;
    card.classList.toggle('done', !allDone);
    const chk = card.querySelector('.ex-check');
    if (chk) chk.classList.toggle('done', !allDone);
  });
  updateDayProgress(dayId);
  maybeUpgradeDayDone(dayId);
  renderWeekCheck(dayId);
  renderWeekProgress();
}

function updateDayProgress(dayId) {
  const list = document.querySelector(`[data-day-list="${dayId}"]`);
  const el = document.querySelector(`[data-day-progress="${dayId}"]`);
  if (!list || !el) return;
  const total = list.querySelectorAll('.ex-card').length;
  const done = list.querySelectorAll('.ex-card.done').length;
  el.textContent = total ? `${done}/${total} done this cycle` : '';
  const allBtn = document.getElementById('markall-' + dayId);
  if (allBtn) allBtn.textContent = (total > 0 && done >= total) ? 'Unmark all ✕' : 'Mark all done ✓';
}

// How many of a day's exercises are checked off today
function dayExerciseProgress(slot) {
  const list = document.querySelector(`[data-day-list="${slot}"]`);
  if (!list) return { done: 0, total: 0 };
  return { done: list.querySelectorAll('.ex-card.done').length, total: list.querySelectorAll('.ex-card').length };
}

function toggleDayDone(slot) {
  const d = getDayDone();
  if (isDayDoneThisWeek(slot)) {
    delete d[slot];
  } else {
    const p = dayExerciseProgress(slot);
    d[slot] = { checkedAt: Date.now(), partial: p.done < p.total };
  }
  saveDayDone(d);
  renderWeekCheck(slot);
  renderWeekProgress();
}

// When all of a day's exercises are checked: promote a same-day partial to full,
// or auto-mark the week session complete if it wasn't marked yet.
// (Runs only when an exercise is toggled, so a manual uncheck of the session sticks
// until the user interacts with the exercises again.)
function maybeUpgradeDayDone(slot) {
  const p = dayExerciseProgress(slot);
  if (p.total === 0 || p.done < p.total) return;
  const d = getDayDone();
  const entry = d[slot];
  if (!entry || !isDayDoneThisWeek(slot)) {
    d[slot] = { checkedAt: Date.now(), partial: false };
    saveDayDone(d);
    renderWeekCheck(slot);
    renderWeekProgress();
    return;
  }
  const markedToday = (Date.now() - entry.checkedAt) < 24 * 60 * 60 * 1000;
  if (entry.partial && markedToday) {
    entry.partial = false;
    saveDayDone(d);
    renderWeekCheck(slot);
    renderWeekProgress();
  }
}

function renderWeekCheck(slot) {
  const wrapEl = document.getElementById('week-check-wrap-' + slot);
  const boxEl = document.getElementById('week-check-' + slot);
  const subEl = document.getElementById('week-check-sub-' + slot);
  if (!wrapEl || !boxEl) return;
  const done = isDayDoneThisWeek(slot);
  const entry = done ? getDayDone()[slot] : null;
  const partial = !!(entry && entry.partial);
  wrapEl.classList.toggle('done', done && !partial);
  wrapEl.classList.toggle('partial', done && partial);
  boxEl.textContent = done ? (partial ? '◐' : '✓') : '';
  if (subEl) {
    if (done) {
      const daysAgo = Math.floor((Date.now() - entry.checkedAt) / (24 * 60 * 60 * 1000));
      const when = daysAgo <= 0 ? 'today' : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
      const resetIn = daysAgo <= 0 ? 'resets in 7 days' : `resets in ${7 - daysAgo} day${7 - daysAgo === 1 ? '' : 's'}`;
      subEl.textContent = partial
        ? `Partial session ${when} (not all exercises were checked) — ${resetIn}, or tap to undo`
        : `Completed ${when} — ${resetIn}, or tap to undo`;
    } else {
      const p = dayExerciseProgress(slot);
      subEl.textContent = p.done >= p.total && p.total > 0
        ? 'All exercises checked — tap to complete this session'
        : `Check off the exercises below (${p.done}/${p.total}), or tap now to log a partial session`;
    }
  }
}

function renderAllWeekChecks() {
  planDayIds().forEach(renderWeekCheck);
  renderWeekProgress();
}

function renderWeekProgress() {
  const countEl = document.getElementById('week-progress-count');
  const fillEl = document.getElementById('week-progress-fill');
  if (!countEl || !fillEl) return;
  const ids = planDayIds();
  const dayDone = getDayDone();
  const done = ids.filter(isDayDoneThisWeek);
  const partials = done.filter(id => dayDone[id] && dayDone[id].partial).length;
  countEl.textContent = `${done.length}/${ids.length} days${partials ? ` (${partials} partial)` : ''}`;
  fillEl.style.width = (done.length / ids.length * 100) + '%';
  const ringEl = document.getElementById('week-ring');
  if (ringEl && typeof svgRing === 'function') ringEl.innerHTML = svgRing(done.length / ids.length, `${done.length}/${ids.length}`, 'Week completion');
}


// ---- set logging ----
function logSet(key) {
  const wEl = document.getElementById('log-weight-' + key);
  const rEl = document.getElementById('log-reps-' + key);
  const weight = parseFloat(wEl.value);
  const reps = parseInt(rEl.value, 10);
  if (!weight || !reps) { wEl.focus(); return; }
  const logs = getLogs();
  logs[key] = logs[key] || [];
  logs[key].push({ date: todayISO(), weight, reps });
  saveLogs(logs);
  wEl.value = ''; rEl.value = '';
  updateLastLogged(key);
}

function updateLastLogged(key) {
  // Newest first; same-day entries ordered by when they were logged
  const logs = (getLogs()[key] || []).map((l, i) => ({ ...l, idx: i })).sort((a, b) => b.date.localeCompare(a.date) || b.idx - a.idx);
  const lastEl = document.querySelector(`[data-last-for="${key}"]`);
  const histEl = document.getElementById('log-history-' + key);
  if (!logs.length) {
    if (lastEl) lastEl.textContent = '';
    if (histEl) histEl.innerHTML = '';
    return;
  }
  if (lastEl) lastEl.textContent = `Last: ${logs[0].weight}kg × ${logs[0].reps} (${formatDateShort(logs[0].date)})`;
  if (histEl) histEl.innerHTML = logs.slice(0, 5).map(l => `<div><span>${l.weight}kg × ${l.reps}</span><span>${formatDateShort(l.date)} <button class="milestone-del" onclick="deleteSetEntry('${key}',${l.idx})" aria-label="Delete set">✕</button></span></div>`).join('');
}

function deleteSetEntry(key, idx) {
  const logs = getLogs();
  if (!logs[key]) return;
  logs[key].splice(idx, 1);
  if (!logs[key].length) delete logs[key];
  saveLogs(logs);
  updateLastLogged(key);
  renderMilestones();
  renderActivity();
}

function toggleLogPanel(key) {
  const panel = document.getElementById('log-' + key);
  if (!panel) return;
  panel.hidden = !panel.hidden;
  if (!panel.hidden) updateLastLogged(key);
}

// ---- rest timer ----
const TIMERS = {};
function formatTime(sec) {
  sec = Math.max(0, Math.round(sec));
  return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;
}
function updateTimerDisplay(key) {
  const t = TIMERS[key];
  const el = document.getElementById('timer-display-' + key);
  if (el && t) el.textContent = formatTime(t.remaining);
}
function toggleTimerPanel(key) {
  const panel = document.getElementById('timer-' + key);
  if (!panel) return;
  panel.hidden = !panel.hidden;
  if (!panel.hidden && !TIMERS[key]) {
    const card = document.querySelector(`.ex-card[data-ex-key="${key}"]`);
    const rest = parseInt(card.dataset.rest, 10) || 60;
    TIMERS[key] = { remaining: rest, total: rest, running: false, intervalId: null };
    updateTimerDisplay(key);
  }
}
function startPauseTimer(key) {
  const t = TIMERS[key];
  if (!t) return;
  const btn = document.getElementById('timer-btn-' + key);
  if (t.running) {
    clearInterval(t.intervalId);
    t.running = false;
    if (btn) btn.textContent = 'Start';
    return;
  }
  t.running = true;
  if (btn) btn.textContent = 'Pause';
  t.intervalId = setInterval(() => {
    t.remaining -= 1;
    updateTimerDisplay(key);
    if (t.remaining <= 0) {
      clearInterval(t.intervalId);
      t.running = false;
      if (btn) btn.textContent = 'Start';
      onTimerDone(key);
    }
  }, 1000);
}
function resetTimer(key) {
  const t = TIMERS[key];
  if (!t) return;
  clearInterval(t.intervalId);
  t.running = false;
  t.remaining = t.total;
  updateTimerDisplay(key);
  const btn = document.getElementById('timer-btn-' + key);
  if (btn) btn.textContent = 'Start';
}
function adjustTimer(key, delta) {
  const t = TIMERS[key];
  if (!t) return;
  t.remaining = Math.max(0, t.remaining + delta);
  t.total = Math.max(t.total, t.remaining);
  updateTimerDisplay(key);
}
function onTimerDone(key) {
  const panel = document.getElementById('timer-' + key);
  if (panel) { panel.classList.remove('flash'); void panel.offsetWidth; panel.classList.add('flash'); }
  playBeep();
}
function playBeep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.25, 0.5].forEach(delay => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.001, ctx.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + delay + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18);
      o.start(ctx.currentTime + delay);
      o.stop(ctx.currentTime + delay + 0.2);
    });
  } catch (e) {}
}

// ---- card rendering ----
// Cards render collapsed: a compact tappable row (thumb, name, badge, check).
// Tapping expands the full detail (photos, stats, steps, timer, set logging).
function toggleCardOpenEl(headEl) {
  const card = headEl.closest('.ex-card');
  if (!card) return;
  card.classList.toggle('open');
  if (card.classList.contains('open')) {
    const wrap = card.querySelector('.ex-img-wrap');
    if (wrap && !wrap.dataset.loaded) { wrap.dataset.loaded = '1'; loadCardImage(card); }
  }
}

function renderCard(ex, opts) {
  const done = isDoneThisWeek(ex.key);
  const steps = (EXERCISE_STEPS[ex.key] || []).map(s => `<li>${s}</li>`).join('');
  // Library mode strips training controls (check/log/timer): the library is for
  // learning and browsing; training happens on the Plan page.
  const lib = !!(opts && opts.library);
  const trainingBody = lib ? `
      <button class="ex-action-btn" style="width:100%;margin-top:12px" onclick="event.stopPropagation();openAddToPlan('${ex.key}')">＋ Add to a routine or day</button>` : `
      <div class="ex-last" data-last-for="${ex.key}"></div>
      <div class="ex-actions">
        <button class="ex-action-btn" onclick="toggleTimerPanel('${ex.key}')">⏱ Rest</button>
        <button class="ex-action-btn" onclick="toggleLogPanel('${ex.key}')">+ Log set</button>
      </div>
      <div class="timer-panel" id="timer-${ex.key}" hidden>
        <div class="timer-display" id="timer-display-${ex.key}">${formatTime(ex.rest)}</div>
        <div class="timer-adjust"><button onclick="adjustTimer('${ex.key}',-15)">−15s</button><button onclick="adjustTimer('${ex.key}',15)">+15s</button></div>
        <div class="timer-controls"><button class="primary" id="timer-btn-${ex.key}" onclick="startPauseTimer('${ex.key}')">Start</button><button onclick="resetTimer('${ex.key}')">Reset</button></div>
      </div>
      <div class="log-panel" id="log-${ex.key}" hidden>
        <div class="log-form">
          <input type="number" placeholder="Weight (kg)" id="log-weight-${ex.key}" min="0" step="0.5"/>
          <input type="number" placeholder="Reps" id="log-reps-${ex.key}" min="1" step="1"/>
          <button onclick="logSet('${ex.key}')">Log</button>
        </div>
        <div class="log-history" id="log-history-${ex.key}"></div>
      </div>`;
  return `<div class="ex-card ${done && !lib ? 'done' : ''}" data-ex-key="${ex.key}" data-rest="${ex.rest}">
    <div class="ex-head" onclick="toggleCardOpenEl(this)" role="button" aria-label="Show ${ex.name} details">
      <img class="ex-thumb" src="${IMAGE_BASE + ex.img}" alt="" loading="lazy"/>
      <div class="ex-head-mid">
        <div class="ex-name">${ex.name}</div>
        <span class="ex-badge ${ex.badgeClass}">${ex.badge}</span>
      </div>
      ${lib ? '' : `<button class="ex-check ${done ? 'done' : ''}" onclick="event.stopPropagation();toggleDone('${ex.key}')" aria-label="Mark done today">✓</button>`}
      <span class="ex-chevron">▾</span>
    </div>
    <div class="ex-collapse">
    <div class="ex-img-wrap" data-img-base="${ex.img}" data-step="0">
      <div class="img-slot"><div class="img-loading">⏳</div></div>
      <button class="step-arrow prev" onclick="flipStep('${ex.key}')" aria-label="Previous step">‹</button>
      <button class="step-arrow next" onclick="flipStep('${ex.key}')" aria-label="Next step">›</button>
      <div class="step-dots"><span class="step-dot active" data-dot="0"></span><span class="step-dot" data-dot="1"></span></div>
    </div>
    <div class="ex-body">
      <div class="ex-stats">
        <div class="ex-stat"><div class="ex-stat-val ${ex.statColor}">${ex.sets}</div><div class="ex-stat-lbl">Sets</div></div>
        <div class="ex-stat"><div class="ex-stat-val ${ex.statColor}">${ex.reps}</div><div class="ex-stat-lbl">${ex.repsLabel || 'Reps'}</div></div>
        <div class="ex-stat"><div class="ex-stat-val ${ex.statColor}">${ex.rest}s</div><div class="ex-stat-lbl">Rest</div></div>
      </div>
      <div class="ex-tip">${ex.tip}</div>
      <ol class="ex-steps">${steps}</ol>
      ${trainingBody}
    </div>
    </div>
  </div>`;
}

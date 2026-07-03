// Custom routines: list, builder, exercise picker, and ad-hoc day extras

const DAY_COLOR_CYCLE = ['chest', 'back', 'legs', 'arms', 'full', 'core', 'chest'];
const MUSCLE_GROUPS = {
  'badge-chest': 'Chest', 'badge-tri': 'Triceps', 'badge-back': 'Back',
  'badge-arms': 'Biceps', 'badge-sh': 'Shoulders', 'badge-legs': 'Legs',
  'badge-full': 'Full body', 'badge-core': 'Core & cardio'
};

// ---------- exercise picker (shared by builder and day extras) ----------
let pickerOnPick = null;

function openExercisePicker(onPick) {
  pickerOnPick = onPick;
  let el = document.getElementById('exercise-picker');
  if (!el) {
    el = document.createElement('div');
    el.className = 'onboard-overlay';
    el.id = 'exercise-picker';
    el.innerHTML = `
      <div class="onboard-title">Pick an exercise</div>
      <input type="text" class="auth-input" id="picker-search" placeholder="Search exercises…" oninput="renderPickerList()"/>
      <div id="picker-list"></div>
      <button class="link-btn muted" onclick="closeExercisePicker()">Done</button>`;
    document.body.appendChild(el);
  }
  el.hidden = false;
  document.getElementById('picker-search').value = '';
  renderPickerList();
}

function closeExercisePicker() {
  const el = document.getElementById('exercise-picker');
  if (el) el.hidden = true;
  pickerOnPick = null;
  if (typeof pickerClosed === 'function') pickerClosed();
}

function renderPickerList() {
  const listEl = document.getElementById('picker-list');
  if (!listEl) return;
  const q = (document.getElementById('picker-search').value || '').trim().toLowerCase();
  const groups = {};
  EXERCISES.forEach(ex => {
    if (q && !ex.name.toLowerCase().includes(q) && !ex.badge.toLowerCase().includes(q)) return;
    const g = MUSCLE_GROUPS[ex.badgeClass] || 'Other';
    (groups[g] = groups[g] || []).push(ex);
  });
  listEl.innerHTML = Object.keys(groups).map(g =>
    `<div class="seg-label">${g}</div>` +
    groups[g].map(ex =>
      `<button class="picker-row" onclick="pickExercise('${ex.key}')"><span>${ex.name}</span><span class="picker-meta">${ex.sets}×${ex.reps}</span></button>`
    ).join('')
  ).join('') || '<div class="empty-note">No exercises match.</div>';
}

function pickExercise(key) {
  if (pickerOnPick) pickerOnPick(key);
}

// ---------- routines page ----------
let builderState = null; // {id?, name, type, days:[{label, ex:[]}]}

function renderRoutinesPage() {
  const listEl = document.getElementById('my-routines');
  if (!listEl) return;
  const routines = getRoutines();
  const active = getActive();
  const thumbFor = key => {
    const ex = EXERCISES.find(e => e.key === key);
    return ex ? `<img class="routine-thumb" src="${IMAGE_BASE + ex.img}" alt="" loading="lazy"/>` : '';
  };
  listEl.innerHTML = routines.length ? routines.map(r => {
    const inUse = active && active.kind === 'custom' && active.routineId === r.id;
    const meta = r.type === 'daily' ? 'Daily · 1 session' : `Weekly · ${r.days.length} day${r.days.length > 1 ? 's' : ''}`;
    return `<div class="info-card routine-card">
      <div class="routine-info">
        <div class="milestone-top"><div class="info-title">${r.name} ${inUse ? '<span class="ex-badge badge-legs">In use</span>' : ''}</div>
        <button class="milestone-del" onclick="deleteRoutine('${r.id}')" aria-label="Delete routine">✕</button></div>
        <div class="info-body">${meta} · ${r.days.reduce((n, d) => n + d.ex.length, 0)} exercises</div>
        <div class="ex-actions" style="margin-top:10px">
          <button class="ex-action-btn" onclick="useRoutine('${r.id}')">${inUse ? 'In use ✓' : 'Use'}</button>
          <button class="ex-action-btn" onclick="editRoutine('${r.id}')">Edit</button>
        </div>
      </div>
      ${thumbFor(r.days[0] && r.days[0].ex[0])}
    </div>`;
  }).join('') : '<div class="empty-note">No custom routines yet — create one below, or use a recommended plan.</div>';

  const tplEl = document.getElementById('template-plans');
  if (tplEl) {
    const usingTemplate = !active || active.kind !== 'custom';
    tplEl.innerHTML = ['ecto', 'meso', 'endo'].map(bt => {
      const inUse = usingTemplate && currentBodyType === bt;
      return `<div class="info-card routine-card">
        <div class="routine-info">
          <div class="info-title">${BODY_TYPE_NAMES[bt]} ${inUse ? '<span class="ex-badge badge-legs">In use</span>' : ''}</div>
          <div class="info-body">${BODY_GUIDES[bt].subtitle}</div>
          <div class="seg" style="margin-top:10px" id="tpl-days-${bt}">
            ${[4, 5, 6, 7].map(n => `<button class="${(inUse && getDaysPerWeek() === n) ? 'active' : ''}" onclick="useTemplate('${bt}',${n})">${n} days</button>`).join('')}
          </div>
        </div>
        ${thumbFor(PLANS[bt][4][0].ex[0])}
      </div>`;
    }).join('');
  }
}

function useRoutine(id) {
  saveActive({ kind: 'custom', routineId: id });
  renderRoutinesPage();
  applyBodyType(currentBodyType);
  updateProfileLabels();
}

function useTemplate(bt, days) {
  const profile = getProfile() || {};
  profile.bodyType = bt;
  profile.daysPerWeek = days;
  saveProfile(profile);
  saveActive({ kind: 'template' });
  renderRoutinesPage();
  applyBodyType(bt);
  updateProfileLabels();
}

function deleteRoutine(id) {
  const active = getActive();
  saveRoutines(getRoutines().filter(r => r.id !== id));
  if (active && active.kind === 'custom' && active.routineId === id) saveActive({ kind: 'template' });
  renderRoutinesPage();
}

// ---------- builder ----------
function newRoutine() {
  builderState = { name: '', type: 'weekly', days: [{ label: 'Day 1', ex: [] }] };
  renderBuilder();
}

function editRoutine(id) {
  const r = getRoutines().find(x => x.id === id);
  if (!r) return;
  builderState = JSON.parse(JSON.stringify(r));
  renderBuilder();
}

function cancelBuilder() {
  builderState = null;
  renderBuilder();
}

function setBuilderType(type) {
  builderState.type = type;
  if (type === 'daily') builderState.days = [builderState.days[0] || { label: 'Session', ex: [] }];
  renderBuilder();
}

function builderAddDay() {
  if (builderState.days.length >= 7) return;
  builderState.days.push({ label: `Day ${builderState.days.length + 1}`, ex: [] });
  renderBuilder();
}

function builderRemoveDay(i) {
  builderState.days.splice(i, 1);
  if (!builderState.days.length) builderState.days.push({ label: 'Day 1', ex: [] });
  renderBuilder();
}

function builderSetLabel(i, value) { builderState.days[i].label = value; }
function builderSetName(value) { builderState.name = value; }

function builderPickFor(i) {
  openExercisePicker(key => {
    if (!builderState.days[i].ex.includes(key)) builderState.days[i].ex.push(key);
    renderBuilder(); // picker stays open for multi-add
  });
}

function builderRemoveEx(i, key) {
  builderState.days[i].ex = builderState.days[i].ex.filter(k => k !== key);
  renderBuilder();
}

function builderMoveEx(i, key, dir) {
  const arr = builderState.days[i].ex;
  const idx = arr.indexOf(key);
  const to = idx + dir;
  if (idx < 0 || to < 0 || to >= arr.length) return;
  arr.splice(idx, 1);
  arr.splice(to, 0, key);
  renderBuilder();
}

function saveBuilder() {
  const errEl = document.getElementById('builder-error');
  errEl.textContent = '';
  if (!builderState.name.trim()) { errEl.textContent = 'Give your routine a name.'; return; }
  if (builderState.days.some(d => !d.ex.length)) { errEl.textContent = 'Every day needs at least one exercise.'; return; }
  builderState.days = builderState.days.map((d, i) => ({
    chip: d.label || `Day ${i + 1}`,
    label: d.label || `Day ${i + 1}`,
    color: DAY_COLOR_CYCLE[i % DAY_COLOR_CYCLE.length],
    ex: d.ex
  }));
  const routines = getRoutines();
  if (builderState.id) {
    const idx = routines.findIndex(r => r.id === builderState.id);
    if (idx >= 0) routines[idx] = builderState; else routines.push(builderState);
  } else {
    builderState.id = Date.now().toString(36);
    routines.push(builderState);
  }
  saveRoutines(routines);
  builderState = null;
  renderBuilder();
  renderRoutinesPage();
}

function renderBuilder() {
  const el = document.getElementById('routine-builder');
  if (!el) return;
  if (!builderState) { el.innerHTML = `<button class="ex-action-btn" style="width:100%;padding:14px" onclick="newRoutine()">+ New routine</button>`; return; }
  const b = builderState;
  el.innerHTML = `<div class="info-card">
    <div class="info-title">${b.id ? 'Edit routine' : 'New routine'}</div>
    <label class="seg-label">Name</label>
    <input type="text" class="auth-input" value="${b.name.replace(/"/g, '&quot;')}" oninput="builderSetName(this.value)" placeholder="e.g. Push power, Saturday pump…"/>
    <label class="seg-label">Type</label>
    <div class="seg">
      <button class="${b.type === 'weekly' ? 'active' : ''}" onclick="setBuilderType('weekly')">Weekly</button>
      <button class="${b.type === 'daily' ? 'active' : ''}" onclick="setBuilderType('daily')">Daily (one session)</button>
    </div>
    ${b.days.map((d, i) => `
      <div class="builder-day">
        <div class="milestone-top">
          <input type="text" class="auth-input" style="margin-bottom:0" value="${(d.label || '').replace(/"/g, '&quot;')}" oninput="builderSetLabel(${i}, this.value)" placeholder="Day name"/>
          ${b.type === 'weekly' && b.days.length > 1 ? `<button class="milestone-del" onclick="builderRemoveDay(${i})" aria-label="Remove day">✕</button>` : ''}
        </div>
        ${d.ex.map(k => { const ex = EXERCISES.find(e => e.key === k); return ex ? `
          <div class="builder-ex-row"><span>${ex.name}</span>
            <span>
              <button class="mini-btn" onclick="builderMoveEx(${i},'${k}',-1)" aria-label="Move up">↑</button>
              <button class="mini-btn" onclick="builderMoveEx(${i},'${k}',1)" aria-label="Move down">↓</button>
              <button class="mini-btn" onclick="builderRemoveEx(${i},'${k}')" aria-label="Remove">✕</button>
            </span></div>` : ''; }).join('')}
        <button class="ex-action-btn" style="margin-top:8px;width:100%" onclick="builderPickFor(${i})">+ Add exercise</button>
      </div>`).join('')}
    ${b.type === 'weekly' && b.days.length < 7 ? `<button class="ex-action-btn" style="width:100%;margin-top:10px" onclick="builderAddDay()">+ Add day</button>` : ''}
    <div class="info-body" id="builder-error" style="margin-top:8px;color:#e87a50"></div>
    <div class="ex-actions" style="margin-top:10px">
      <button class="ex-action-btn" onclick="saveBuilder()" style="background:var(--primary);color:var(--on-primary)">Save routine</button>
      <button class="ex-action-btn" onclick="cancelBuilder()">Cancel</button>
    </div>
  </div>`;
}

// ---------- ad-hoc extras on the Plan page ----------
function addExtraTo(dayId) {
  openExercisePicker(key => {
    const extras = getExtras();
    extras[dayId] = extras[dayId] || [];
    if (!extras[dayId].some(e => e.key === key)) extras[dayId].push({ key, addedAt: Date.now() });
    saveExtras(extras);
    closeExercisePicker();
    renderPlan();
    loadVisibleImages();
    showDayById(dayId);
  });
}

function removeExtra(dayId, key) {
  const extras = getExtras();
  extras[dayId] = (extras[dayId] || []).filter(e => e.key !== key);
  if (!extras[dayId].length) delete extras[dayId];
  saveExtras(extras);
  renderPlan();
  loadVisibleImages();
  showDayById(dayId);
}

// Re-show a day section after a re-render (renderPlan resets to day 1)
function showDayById(dayId) {
  planDayIds().forEach(id => {
    const e = document.getElementById('ex-' + id);
    if (e) e.style.display = id === dayId ? 'block' : 'none';
  });
  document.querySelectorAll('.day-chip:not(.rest-chip)').forEach(c => {
    c.classList.toggle('active', (c.getAttribute('onclick') || '').includes(`'${dayId}'`));
  });
}

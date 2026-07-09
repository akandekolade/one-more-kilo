// Custom routines: list, builder, exercise picker, and ad-hoc day extras

const DAY_COLOR_CYCLE = ['chest', 'back', 'legs', 'arms', 'full', 'core', 'chest'];
const MUSCLE_GROUPS = {
  'badge-chest': 'Chest', 'badge-tri': 'Triceps', 'badge-back': 'Back',
  'badge-arms': 'Biceps', 'badge-sh': 'Shoulders', 'badge-legs': 'Legs',
  'badge-full': 'Full body', 'badge-core': 'Core & cardio'
};

// ---------- exercise picker (shared by builder and day extras) ----------
// When an isSelected(key) callback is passed, rows render a checkbox and picks
// toggle: the builder uses this for multi-select with visible selection state.
let pickerOnPick = null;
let pickerIsSelected = null;

function openExercisePicker(onPick, isSelected) {
  pickerOnPick = onPick;
  pickerIsSelected = isSelected || null;
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
  pickerIsSelected = null;
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
    groups[g].map(ex => {
      const sel = pickerIsSelected ? pickerIsSelected(ex.key) : false;
      const box = pickerIsSelected ? `<span class="picker-checkbox ${sel ? 'on' : ''}">${sel ? '✓' : ''}</span>` : '';
      return `<button class="picker-row ${sel ? 'selected' : ''}" onclick="pickExercise('${ex.key}')">${box}<span style="flex:1">${ex.name}</span><span class="picker-meta">${ex.sets}×${ex.reps}</span></button>`;
    }).join('')
  ).join('') || '<div class="empty-note">No exercises match.</div>';
}

function pickExercise(key) {
  if (pickerOnPick) pickerOnPick(key);
  if (pickerIsSelected) renderPickerList(); // refresh checkboxes on toggle
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
        <div class="milestone-top"><div class="info-title">${esc(r.name)} ${inUse ? '<span class="ex-badge badge-legs">In use</span>' : ''}</div>
        <button class="milestone-del" onclick="deleteRoutine('${r.id}')" aria-label="Delete routine">✕</button></div>
        <div class="info-body">${meta} · ${r.days.reduce((n, d) => n + d.ex.length, 0)} exercises</div>
        <div class="ex-actions" style="margin-top:10px">
          <button class="ex-action-btn" onclick="useRoutine('${r.id}')">${inUse ? 'In use ✓' : 'Use'}</button>
          <button class="ex-action-btn" onclick="editRoutine('${r.id}')">Edit</button>
          <button class="ex-action-btn" onclick="duplicateRoutine('${r.id}')">Duplicate</button>
        </div>
      </div>
      ${thumbFor(r.days[0] && r.days[0].ex[0])}
    </div>`;
  }).join('') : '<div class="empty-note">No custom routines yet — create one below, or use a recommended plan.</div>';

  const tplEl = document.getElementById('template-plans');
  if (tplEl) {
    const usingTemplate = !active || active.kind !== 'custom';
    const profile = getProfile();
    const mySex = (profile && profile.sex === 'female') ? 'female' : 'male';
    const order = mySex === 'female' ? ['female', 'male'] : ['male', 'female'];
    tplEl.innerHTML = order.map(sex => {
      const heading = sex === 'female' ? "Women's plans" : "Men's plans";
      const cards = ['ecto', 'meso', 'endo'].map(bt => {
        const inUse = usingTemplate && currentBodyType === bt && currentPlanSex() === sex;
        return `<div class="info-card routine-card">
          <div class="routine-info">
            <div class="info-title">${BODY_TYPE_NAMES[bt]} ${inUse ? '<span class="ex-badge badge-legs">In use</span>' : ''}</div>
            <div class="info-body">${BODY_GUIDES[bt].subtitle}${sex === 'female' ? ' · glute & lower-body focus' : ''}</div>
            <div class="seg" style="margin-top:10px" id="tpl-days-${sex}-${bt}">
              ${[1, 2, 3, 4, 5, 6, 7].map(n => `<button class="${(inUse && getDaysPerWeek() === n) ? 'active' : ''}" onclick="useTemplate('${bt}',${n},'${sex}')">${n}</button>`).join('')}
            </div>
            <button class="ex-action-btn" style="margin-top:10px;width:100%" onclick="duplicateTemplate('${bt}','${sex}')">⧉ Duplicate &amp; customize</button>
          </div>
          ${thumbFor(planSetFor(sex)[bt][4][0].ex[0])}
        </div>`;
      }).join('');
      return `<div class="seg-label" style="margin-top:14px">${heading}</div>${cards}`;
    }).join('');
  }
}

function useRoutine(id) {
  saveActive({ kind: 'custom', routineId: id });
  renderRoutinesPage();
  applyBodyType(currentBodyType);
  updateProfileLabels();
}

function useTemplate(bt, days, sex) {
  const profile = getProfile() || {};
  profile.bodyType = bt;
  profile.daysPerWeek = days;
  saveProfile(profile);
  // Remember an explicit cross-gender pick; otherwise the plan follows the profile's sex
  const mySex = (profile.sex === 'female') ? 'female' : 'male';
  saveActive(sex && sex !== mySex ? { kind: 'template', planSex: sex } : { kind: 'template' });
  renderRoutinesPage();
  applyBodyType(bt);
  updateProfileLabels();
}

// ---------- confirm sheet (are-you-sure prompt) ----------
let confirmAction = null;

function showConfirm(title, body, confirmLabel, action) {
  confirmAction = action;
  let el = document.getElementById('confirm-sheet');
  if (!el) {
    el = document.createElement('div');
    el.className = 'onboard-overlay';
    el.id = 'confirm-sheet';
    document.body.appendChild(el);
  }
  el.innerHTML = `
    <div class="onboard-title">${esc(title)}</div>
    <div class="onboard-sub">${esc(body)}</div>
    <div class="ex-actions">
      <button class="ex-action-btn" style="background:#e87a50;color:#fff" onclick="confirmSheetYes()">${esc(confirmLabel)}</button>
      <button class="ex-action-btn" onclick="closeConfirmSheet()">Cancel</button>
    </div>`;
  el.hidden = false;
}

function closeConfirmSheet() {
  const el = document.getElementById('confirm-sheet');
  if (el) el.hidden = true;
  confirmAction = null;
}

function confirmSheetYes() {
  const action = confirmAction;
  closeConfirmSheet();
  if (action) action();
}

function deleteRoutine(id) {
  const r = getRoutines().find(x => x.id === id);
  const name = r ? r.name : 'this routine';
  showConfirm(`Delete “${name}”?`, 'This permanently removes the routine. Exercises you logged stay in your history.', 'Delete routine', () => {
    const active = getActive();
    saveRoutines(getRoutines().filter(x => x.id !== id));
    if (active && active.kind === 'custom' && active.routineId === id) saveActive({ kind: 'template' });
    renderRoutinesPage();
    applyBodyType(currentBodyType);
  });
}

// ---------- duplicating ----------
function duplicateRoutine(id) {
  const r = getRoutines().find(x => x.id === id);
  if (!r) return;
  builderState = JSON.parse(JSON.stringify(r));
  delete builderState.id;
  builderState.name = `${r.name} (copy)`;
  renderBuilder();
  scrollToBuilder();
}

// Copy a recommended plan into the builder so it can be extended and saved as a custom routine
function duplicateTemplate(bt, sex) {
  const days = planSetFor(sex)[bt][getDaysPerWeek()];
  builderState = {
    name: `${BODY_TYPE_NAMES[bt]}${sex === 'female' ? ' (Women)' : ''} — my version`,
    type: 'weekly',
    days: days.map(d => ({ label: d.label, ex: d.ex.slice() }))
  };
  renderBuilder();
  scrollToBuilder();
}

function scrollToBuilder() {
  const el = document.getElementById('routine-builder');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  // Checkbox multi-select: tapping a row toggles it in/out of the day
  openExercisePicker(key => {
    const arr = builderState.days[i].ex;
    const idx = arr.indexOf(key);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(key);
    renderBuilder(); // picker stays open for multi-add
  }, key => builderState.days[i].ex.includes(key));
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

// Saving is two-step: validate → preview (review/remove exercises) → confirm
function saveBuilder() {
  const errEl = document.getElementById('builder-error');
  errEl.textContent = '';
  if (!builderState.name.trim()) { errEl.textContent = 'Give your routine a name.'; return; }
  if (builderState.days.some(d => !d.ex.length)) { errEl.textContent = 'Every day needs at least one exercise.'; return; }
  openBuilderPreview();
}

function openBuilderPreview() {
  let el = document.getElementById('builder-preview');
  if (!el) {
    el = document.createElement('div');
    el.className = 'onboard-overlay';
    el.id = 'builder-preview';
    document.body.appendChild(el);
  }
  const b = builderState;
  el.innerHTML = `
    <div class="onboard-title">Preview “${esc(b.name)}”</div>
    <div class="onboard-sub">Check the routine over — remove anything you don't want, then confirm.</div>
    ${b.days.map((d, i) => `
      <div class="seg-label">${esc(d.label || `Day ${i + 1}`)} · ${d.ex.length} exercise${d.ex.length === 1 ? '' : 's'}</div>
      ${d.ex.map(k => {
        const ex = EXERCISES.find(e => e.key === k);
        return ex ? `<div class="picker-row" style="cursor:default">
          <img class="ex-thumb" src="${IMAGE_BASE + ex.img}" alt="" loading="lazy" style="width:40px;height:40px;border-radius:8px;object-fit:cover;margin-right:10px"/>
          <span style="flex:1">${ex.name}<span class="picker-meta" style="display:block">${ex.sets} sets × ${ex.reps}</span></span>
          <button class="milestone-del" onclick="previewRemoveEx(${i},'${k}')" aria-label="Remove ${ex.name}">✕</button>
        </div>` : '';
      }).join('')}`).join('')}
    <div class="info-body" id="preview-error" style="margin-top:8px;color:#e87a50"></div>
    <div class="ex-actions" style="margin-top:14px">
      <button class="ex-action-btn" style="background:var(--primary);color:var(--on-primary)" onclick="confirmSaveBuilder()">Confirm &amp; save</button>
      <button class="ex-action-btn" onclick="closeBuilderPreview()">Keep editing</button>
    </div>`;
  el.hidden = false;
  el.scrollTop = 0;
}

function previewRemoveEx(i, key) {
  builderState.days[i].ex = builderState.days[i].ex.filter(k => k !== key);
  if (builderState.days.some(d => !d.ex.length)) {
    // A day just became empty — flag it rather than allowing a broken save
    openBuilderPreview();
    const err = document.getElementById('preview-error');
    if (err) err.textContent = 'A day has no exercises left — add some back or remove the day before saving.';
  } else {
    openBuilderPreview();
  }
  renderBuilder();
}

function closeBuilderPreview() {
  const el = document.getElementById('builder-preview');
  if (el) el.hidden = true;
}

function confirmSaveBuilder() {
  if (builderState.days.some(d => !d.ex.length)) {
    const err = document.getElementById('preview-error');
    if (err) err.textContent = 'Every day needs at least one exercise — go back and fix the empty day.';
    return;
  }
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
    // Random suffix so two saves in the same millisecond can't collide
    builderState.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    routines.push(builderState);
  }
  saveRoutines(routines);
  builderState = null;
  closeBuilderPreview();
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
    <input type="text" class="auth-input" value="${esc(b.name)}" oninput="builderSetName(this.value)" placeholder="e.g. Push power, Saturday pump…"/>
    <label class="seg-label">Type</label>
    <div class="seg">
      <button class="${b.type === 'weekly' ? 'active' : ''}" onclick="setBuilderType('weekly')">Weekly</button>
      <button class="${b.type === 'daily' ? 'active' : ''}" onclick="setBuilderType('daily')">Daily (one session)</button>
    </div>
    ${b.days.map((d, i) => `
      <div class="builder-day">
        <div class="milestone-top">
          <input type="text" class="auth-input" style="margin-bottom:0" value="${esc(d.label || '')}" oninput="builderSetLabel(${i}, this.value)" placeholder="Day name"/>
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
      <button class="ex-action-btn" onclick="saveBuilder()" style="background:var(--primary);color:var(--on-primary)">Preview &amp; save</button>
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

// ---------- add an exercise to a plan day or routine (from the Exercise Library) ----------
function openAddToPlan(key) {
  const ex = EXERCISES.find(e => e.key === key);
  if (!ex) return;
  let el = document.getElementById('addto-sheet');
  if (!el) {
    el = document.createElement('div');
    el.className = 'onboard-overlay';
    el.id = 'addto-sheet';
    document.body.appendChild(el);
  }
  const plan = currentPlan();
  const r = typeof activeRoutine === 'function' ? activeRoutine() : null;
  const planName = r ? `“${esc(r.name)}”` : 'this week’s plan';
  const planRows = plan.map((day, i) =>
    `<button class="picker-row" onclick="addToPlanDay('${key}',${i})"><span>${esc(day.label)}</span><span class="picker-meta">Day ${i + 1}</span></button>`
  ).join('');
  const routines = getRoutines();
  const routineRows = routines.map(rt =>
    rt.days.map((day, i) =>
      `<button class="picker-row" onclick="addToRoutineDay('${key}','${rt.id}',${i})"><span>${esc(rt.name)} — ${esc(day.label)}</span><span class="picker-meta">permanent</span></button>`
    ).join('')
  ).join('');
  el.innerHTML = `
    <div class="onboard-title">Add ${ex.name}</div>
    <div class="seg-label">To ${planName} (as this week's extra)</div>
    ${planRows}
    ${routineRows ? `<div class="seg-label" style="margin-top:14px">To one of my routines (permanently)</div>${routineRows}` : ''}
    <div class="info-body" id="addto-msg" style="margin-top:10px;color:var(--primary);text-align:center"></div>
    <button class="link-btn muted" onclick="document.getElementById('addto-sheet').hidden = true">Close</button>`;
  el.hidden = false;
}

function addToPlanDay(key, dayIdx) {
  const dayId = 'd' + (dayIdx + 1);
  const extras = getExtras();
  extras[dayId] = extras[dayId] || [];
  const day = currentPlan()[dayIdx];
  const already = day.ex.includes(key) || extras[dayId].some(e => e.key === key);
  if (!already) {
    extras[dayId].push({ key, addedAt: Date.now() });
    saveExtras(extras);
    renderPlan(); // no-op off the Plan page; refreshes if we're on it
  }
  const msg = document.getElementById('addto-msg');
  if (msg) msg.textContent = already ? `Already on ${day.label}.` : `Added to ${day.label} for this week ✓`;
}

function addToRoutineDay(key, routineId, dayIdx) {
  const routines = getRoutines();
  const rt = routines.find(x => x.id === routineId);
  if (!rt || !rt.days[dayIdx]) return;
  const already = rt.days[dayIdx].ex.includes(key);
  if (!already) {
    rt.days[dayIdx].ex.push(key);
    saveRoutines(routines);
    renderPlan();
    renderRoutinesPage();
  }
  const msg = document.getElementById('addto-msg');
  if (msg) msg.textContent = already ? `Already in ${rt.name} — ${rt.days[dayIdx].label}.` : `Added to ${rt.name} — ${rt.days[dayIdx].label} ✓`;
}

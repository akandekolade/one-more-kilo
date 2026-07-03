// Profile, BMI, weight log, milestones, activity, body guide

function renderBodyGuide() {
  const g = BODY_GUIDES[currentBodyType];
  const el = document.getElementById('body-guide');
  if (!el || !g) return;
  const rows = g.rows.map(r => `<div class="progress-row"><div class="progress-label"><span>${r.label}</span><span>${r.value}</span></div><div class="prog-track"><div class="prog-fill" style="width:${r.pct}%;background:${r.color}"></div></div></div>`).join('');
  const cards = g.cards.map(c => `<div class="info-card"><div class="info-title">${c.title}</div><div class="info-body">${c.body}</div></div>`).join('');
  el.innerHTML = `<div class="section-heading">${g.heading}</div>${rows}<div style="height:16px"></div>${cards}`;
}


function updateProfileLabels() {
  const profile = getProfile();
  if (!profile) return;
  const btLabel = document.getElementById('profile-bodytype-label');
  const hLabel = document.getElementById('profile-height-label');
  const wLabel = document.getElementById('profile-weight-label');
  const dLabel = document.getElementById('profile-days-label');
  if (btLabel) btLabel.textContent = BODY_TYPE_NAMES[profile.bodyType] || profile.bodyType;
  if (hLabel) hLabel.textContent = profile.heightCm;
  if (dLabel) dLabel.textContent = getDaysPerWeek();
  if (wLabel) {
    const log = sortedWeightLog();
    wLabel.textContent = log.length ? `${log[0].weight} kg (${formatDateShort(log[0].date)})` : '—';
  }
  renderWeightHistory();
}

// ---- edit height ----
function toggleHeightPanel() {
  const panel = document.getElementById('height-edit-panel');
  if (!panel) return;
  panel.hidden = !panel.hidden;
  if (!panel.hidden) {
    const profile = getProfile();
    document.getElementById('height-input').value = profile ? profile.heightCm : '';
  }
}
function saveHeight() {
  const el = document.getElementById('height-input');
  const h = parseFloat(el.value);
  if (!h) { el.focus(); return; }
  const profile = getProfile() || {};
  profile.heightCm = h;
  saveProfile(profile);
  document.getElementById('height-edit-panel').hidden = true;
  updateProfileLabels();
}

// ---- BMI ----
function renderBMI() {
  const valEl = document.getElementById('bmi-value');
  const badgeEl = document.getElementById('bmi-badge');
  const noteEl = document.getElementById('bmi-note');
  if (!valEl || !badgeEl) return;
  const profile = getProfile();
  const log = sortedWeightLog();
  if (!profile || !profile.heightCm || !log.length) {
    valEl.textContent = '—';
    badgeEl.textContent = '';
    badgeEl.style.background = 'transparent';
    if (noteEl) noteEl.textContent = 'Log your weight to see your BMI.';
    return;
  }
  const heightM = profile.heightCm / 100;
  const bmi = log[0].weight / (heightM * heightM);
  let category, color;
  if (bmi < 18.5) { category = 'Underweight'; color = '#4a8fd4'; }
  else if (bmi < 25) { category = 'Normal'; color = '#5db87a'; }
  else if (bmi < 30) { category = 'Overweight'; color = '#e8b34a'; }
  else { category = 'Obese'; color = '#e87a50'; }
  valEl.textContent = Math.round(bmi * 10) / 10;
  badgeEl.textContent = category;
  badgeEl.style.background = color + '26';
  badgeEl.style.color = color;
  if (noteEl) noteEl.textContent = `Based on your last logged weight (${log[0].weight}kg) and height (${profile.heightCm}cm).`;
}

// ---- weight logging ----
function toggleWeightPanel() {
  const panel = document.getElementById('weight-log-panel');
  if (!panel) return;
  panel.hidden = !panel.hidden;
  if (!panel.hidden) renderWeightHistory();
}
function logWeight() {
  const el = document.getElementById('weight-input');
  const weight = parseFloat(el.value);
  if (!weight) { el.focus(); return; }
  const log = getWeightLog();
  log.push({ date: todayISO(), weight });
  saveWeightLog(log);
  el.value = '';
  updateProfileLabels();
}
function renderWeightHistory() {
  const histEl = document.getElementById('weight-history');
  renderBMI();
  if (!histEl) return;
  const log = sortedWeightLog();
  if (!log.length) { histEl.innerHTML = ''; return; }
  histEl.innerHTML = log.slice(0, 5).map(l => `<div><span>${l.weight}kg</span><span>${formatDateShort(l.date)} <button class="milestone-del" onclick="deleteWeightEntry(${l.idx})" aria-label="Delete entry">✕</button></span></div>`).join('');
}
function deleteWeightEntry(idx) {
  const log = getWeightLog();
  log.splice(idx, 1);
  saveWeightLog(log);
  updateProfileLabels();
}


// ---- milestones ----
function bestWeight(key) {
  const logs = getLogs()[key] || [];
  return logs.length ? Math.max(...logs.map(l => l.weight)) : 0;
}
function populateMilestoneDropdown() {
  const sel = document.getElementById('ms-exercise');
  if (!sel) return;
  const keys = [...new Set(currentPlan().flatMap(day => day.ex))];
  sel.innerHTML = keys.map(k => EXERCISES.find(e => e.key === k)).filter(Boolean).map(ex => `<option value="${ex.key}">${ex.name}</option>`).join('');
}
function addMilestone() {
  const sel = document.getElementById('ms-exercise');
  const weightEl = document.getElementById('ms-weight');
  const dateEl = document.getElementById('ms-date');
  const targetWeight = parseFloat(weightEl.value);
  if (!sel.value || !targetWeight) { weightEl.focus(); return; }
  const milestones = getMilestones();
  milestones.push({ id: Date.now().toString(36), exKey: sel.value, targetWeight, targetDate: dateEl.value || null });
  saveMilestones(milestones);
  weightEl.value = ''; dateEl.value = '';
  renderMilestones();
}
function deleteMilestone(id) {
  saveMilestones(getMilestones().filter(m => m.id !== id));
  renderMilestones();
}
function renderMilestones() {
  const list = document.getElementById('milestone-list');
  if (!list) return;
  const milestones = getMilestones();
  if (!milestones.length) { list.innerHTML = '<div class="empty-note">No milestones yet — add a target weight for any lift above.</div>'; return; }
  list.innerHTML = milestones.map(m => {
    const ex = EXERCISES.find(e => e.key === m.exKey);
    const name = ex ? ex.name : m.exKey;
    const barColor = ex ? `var(--${ex.statColor.replace('c-', '')})` : 'var(--arms)';
    const best = bestWeight(m.exKey);
    const dateStr = m.targetDate ? ` · by ${formatDateShort(m.targetDate)}` : '';
    if (!best) {
      return `<div class="milestone-card"><div class="milestone-top"><div class="milestone-title">${name} — ${m.targetWeight}kg</div><button class="milestone-del" onclick="deleteMilestone('${m.id}')">✕</button></div><div class="milestone-meta">Log a set on ${name} to start tracking${dateStr}</div></div>`;
    }
    const pct = Math.min(100, Math.round((best / m.targetWeight) * 100));
    return `<div class="milestone-card"><div class="milestone-top"><div class="milestone-title">${name} — ${m.targetWeight}kg</div><button class="milestone-del" onclick="deleteMilestone('${m.id}')">✕</button></div><div class="prog-track"><div class="prog-fill" style="width:${pct}%;background:${barColor}"></div></div><div class="milestone-meta">${best}kg / ${m.targetWeight}kg · ${pct}%${dateStr}</div></div>`;
  }).join('');
}
function renderActivity() {
  const list = document.getElementById('activity-list');
  if (!list) return;
  const logs = getLogs();
  const all = [];
  Object.keys(logs).forEach(key => logs[key].forEach(l => all.push({ key, ...l })));
  all.sort((a, b) => b.date.localeCompare(a.date));
  const recent = all.slice(0, 15);
  if (!recent.length) { list.innerHTML = '<div class="empty-note">No sets logged yet.</div>'; return; }
  list.innerHTML = recent.map(l => {
    const ex = EXERCISES.find(e => e.key === l.key);
    return `<div class="activity-item"><span>${ex ? ex.name : l.key} — ${l.weight}kg × ${l.reps}</span><span>${formatDateShort(l.date)}</span></div>`;
  }).join('');
}

// Date helpers + localStorage-backed state

// Escape user-sourced text before it enters innerHTML templates
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---- date helpers ----
function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
function formatDateShort(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ---- storage ----
function getChecklist() { try { return JSON.parse(localStorage.getItem('wk_checklist')) || {}; } catch (e) { return {}; } }
function saveChecklist(obj) {
  const cutoff = Date.now() - 60 * 24 * 60 * 60 * 1000;
  Object.keys(obj).forEach(date => { if (new Date(date).getTime() < cutoff) delete obj[date]; });
  localStorage.setItem('wk_checklist', JSON.stringify(obj));
  syncToCloud();
}
function isDoneToday(key) { const c = getChecklist(); return !!(c[todayISO()] && c[todayISO()][key]); }

function getLogs() { try { return JSON.parse(localStorage.getItem('wk_logs')) || {}; } catch (e) { return {}; } }
function saveLogs(obj) { localStorage.setItem('wk_logs', JSON.stringify(obj)); syncToCloud(); }

function getMilestones() { try { return JSON.parse(localStorage.getItem('wk_milestones')) || []; } catch (e) { return []; } }
function saveMilestones(arr) { localStorage.setItem('wk_milestones', JSON.stringify(arr)); syncToCloud(); }

function getProfile() { try { return JSON.parse(localStorage.getItem('wk_profile')) || null; } catch (e) { return null; } }
function saveProfile(p) { localStorage.setItem('wk_profile', JSON.stringify(p)); syncToCloud(); }
function getWeightLog() { try { return JSON.parse(localStorage.getItem('wk_weightlog')) || []; } catch (e) { return []; } }
function saveWeightLog(arr) { localStorage.setItem('wk_weightlog', JSON.stringify(arr)); syncToCloud(); }

// Newest first; for entries on the same date the one logged later wins
function sortedWeightLog() {
  return getWeightLog().map((l, i) => ({ ...l, idx: i })).sort((a, b) => b.date.localeCompare(a.date) || b.idx - a.idx);
}



// ---- weekly day-completion checkbox (7-day rolling reset) ----
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
function getDayDone() { try { return JSON.parse(localStorage.getItem('wk_daydone')) || {}; } catch (e) { return {}; } }
// One-time migration: pre-plan versions keyed weekly checkboxes by slot name instead of day number
function migrateDayDone() {
  const d = getDayDone();
  const map = { chest: 'd1', legs: 'd2', arms: 'd3', full: 'd4' };
  let changed = false;
  Object.keys(map).forEach(oldKey => {
    if (d[oldKey]) { d[map[oldKey]] = d[map[oldKey]] || d[oldKey]; delete d[oldKey]; changed = true; }
  });
  if (changed) localStorage.setItem('wk_daydone', JSON.stringify(d));
}
function saveDayDone(obj) { localStorage.setItem('wk_daydone', JSON.stringify(obj)); syncToCloud(); }

function isDayDoneThisWeek(slot) {
  const entry = getDayDone()[slot];
  return !!(entry && entry.checkedAt && (Date.now() - entry.checkedAt) < WEEK_MS);
}


// ---- custom routines ----
function getRoutines() { try { return JSON.parse(localStorage.getItem('wk_routines')) || []; } catch (e) { return []; } }
function saveRoutines(arr) { localStorage.setItem('wk_routines', JSON.stringify(arr)); syncToCloud(); }

// What the Plan page shows: a body-type template (default) or a custom routine
function getActive() { try { return JSON.parse(localStorage.getItem('wk_active')) || null; } catch (e) { return null; } }
function saveActive(a) { localStorage.setItem('wk_active', JSON.stringify(a)); syncToCloud(); }

// Ad-hoc extra exercises added to a day for the current week (expire after 7 days)
function getExtras() {
  let all;
  try { all = JSON.parse(localStorage.getItem('wk_extras')) || {}; } catch (e) { all = {}; }
  const cutoff = Date.now() - WEEK_MS;
  Object.keys(all).forEach(dayId => {
    all[dayId] = (all[dayId] || []).filter(e => e.addedAt > cutoff);
    if (!all[dayId].length) delete all[dayId];
  });
  return all;
}
function saveExtras(obj) { localStorage.setItem('wk_extras', JSON.stringify(obj)); syncToCloud(); }

// ---- progress photos (synced per-photo to Firestore, not in the main state doc) ----
function getPhotos() { try { return JSON.parse(localStorage.getItem('wk_photos')) || []; } catch (e) { return []; } }
function savePhotosLocal(arr) {
  try { localStorage.setItem('wk_photos', JSON.stringify(arr)); }
  catch (e) { alert('Device photo storage is full — delete some gallery photos to add new ones.'); throw e; }
}

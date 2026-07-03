// Date helpers + localStorage-backed state

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


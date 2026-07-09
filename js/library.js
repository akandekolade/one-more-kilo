// Exercise library: search + muscle-group filters over the full exercise pool.
// Reuses the collapsible exercise card, so logging/checking works from here too.

let libFilter = 'all';
let libSearch = '';

const LIB_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'home', label: '🏠 Home (no equipment)' },
  { id: 'badge-chest', label: 'Chest' },
  { id: 'badge-back', label: 'Back' },
  { id: 'badge-legs', label: 'Legs' },
  { id: 'badge-sh', label: 'Shoulders' },
  { id: 'badge-arms', label: 'Biceps' },
  { id: 'badge-tri', label: 'Triceps' },
  { id: 'badge-core', label: 'Core & cardio' },
  { id: 'badge-full', label: 'Full body' }
];

function setLibFilter(id) {
  libFilter = id;
  renderLibrary();
}

function setLibSearch(value) {
  libSearch = value.trim().toLowerCase();
  renderLibrary();
}

function renderLibrary() {
  const listEl = document.getElementById('library-list');
  if (!listEl) return;

  const chipsEl = document.getElementById('library-filters');
  if (chipsEl) {
    chipsEl.innerHTML = LIB_FILTERS.map(f =>
      `<button class="lib-chip ${libFilter === f.id ? 'active' : ''}" onclick="setLibFilter('${f.id}')">${f.label}</button>`
    ).join('');
  }

  const matches = EXERCISES.filter(ex => {
    if (libFilter === 'home') { if (!ex.home) return false; }
    else if (libFilter !== 'all' && ex.badgeClass !== libFilter) return false;
    if (libSearch && !ex.name.toLowerCase().includes(libSearch) && !ex.badge.toLowerCase().includes(libSearch)) return false;
    return true;
  }).sort((a, b) => a.name.localeCompare(b.name));

  const countEl = document.getElementById('library-count');
  if (countEl) countEl.textContent = `${matches.length} exercise${matches.length === 1 ? '' : 's'}`;

  if (!matches.length) {
    listEl.innerHTML = '<div class="empty-note">No exercises match — try a different search or filter.</div>';
    return;
  }

  if (libFilter === 'all' && !libSearch) {
    // Grouped browse view
    const groups = {};
    matches.forEach(ex => {
      const g = MUSCLE_GROUPS[ex.badgeClass] || 'Other';
      (groups[g] = groups[g] || []).push(ex);
    });
    listEl.innerHTML = Object.keys(groups).sort().map(g =>
      `<div class="gal-date">${g}</div>` + groups[g].map(ex => renderCard(ex, { library: true })).join('')
    ).join('');
  } else {
    listEl.innerHTML = matches.map(ex => renderCard(ex, { library: true })).join('');
  }
}

// Theme: light/dark/auto + accent

// ---- theme (light/dark/auto + accent) ----
function getThemeMode() { return localStorage.getItem('wk_thememode') || 'auto'; }
function getAccent() { return localStorage.getItem('wk_accent') || 'green'; }
function setThemeMode(mode) { localStorage.setItem('wk_thememode', mode); applyTheme(); }
function setAccent(accent) { localStorage.setItem('wk_accent', accent); applyTheme(); }
function applyTheme() {
  const mode = getThemeMode();
  const effective = mode === 'auto' ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : mode;
  document.documentElement.setAttribute('data-theme', effective);
  document.documentElement.setAttribute('data-accent', getAccent());
  const meta = document.getElementById('meta-theme-color');
  if (meta) meta.content = effective === 'light' ? '#f5f4f1' : '#0f0f0f';
  const segMode = document.getElementById('seg-mode');
  if (segMode) segMode.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  const segAccent = document.getElementById('seg-accent');
  if (segAccent) segAccent.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.accent === getAccent()));
}
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if (getThemeMode() === 'auto') applyTheme(); });

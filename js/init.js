// Page bootstrap

window.addEventListener('load', () => {
  applyTheme();
  migrateDayDone();
  document.getElementById('onboard-height').addEventListener('input', checkOnboardReady);
  document.getElementById('onboard-weight').addEventListener('input', checkOnboardReady);
  const profile = getProfile();
  if (profile) applyBodyType(profile.bodyType);
  // Show the login screen once per app session, not on every page navigation
  if (!sessionStorage.getItem('wk_entered')) openLoginOverlay(true);
});

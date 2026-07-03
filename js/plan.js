// Plan rendering: day chips/sections, tab/day switching

function applyBodyType(bt) {
  currentBodyType = bt;
  const sub = document.getElementById('header-sub');
  if (sub) sub.textContent = BODY_GUIDES[bt].subtitle;
  const whyEl = document.getElementById('muscle-why-body');
  if (whyEl) whyEl.textContent = BODY_GUIDES[bt].muscleWhy;
  renderBodyGuide();
  renderPlan();
  renderAllWeekChecks();
  loadVisibleImages();
  populateMilestoneDropdown();
  renderMilestones();
  renderActivity();
  updateProfileLabels();
}


function planDayIds() { return currentPlan().map((_, i) => 'd' + (i + 1)); }

// How each plan length maps onto a 7-day calendar week: numbers are training-day


function renderPlan() {
  const plan = currentPlan();
  const layout = WEEK_LAYOUTS[plan.length] || plan.map((_, i) => i + 1);
  const chipsEl = document.getElementById('day-scroll');
  const sectionsEl = document.getElementById('day-sections');
  if (!chipsEl || !sectionsEl) return;

  let chips = '';
  let firstDone = false;
  for (let c = 0; c < layout.length; c++) {
    if (layout[c] === 'R') {
      // merge consecutive rest days into one chip (e.g. "Day 6–7")
      let end = c;
      while (end + 1 < layout.length && layout[end + 1] === 'R') end++;
      const dayLabel = end > c ? `Day ${c + 1}–${end + 1}` : `Day ${c + 1}`;
      chips += `<div class="day-chip rest-chip"><div class="day-num">${dayLabel}</div><div class="day-name">Rest</div><div class="day-dot" style="background:var(--muted)"></div></div>`;
      c = end;
    } else {
      const i = layout[c] - 1;
      const day = plan[i];
      const id = 'd' + (i + 1);
      chips += `<div class="day-chip ${!firstDone ? 'active' : ''}" style="--active-color:var(--${day.color})" onclick="showDay('${id}',this)"><div class="day-num">Day ${c + 1}</div><div class="day-name">${day.chip}</div><div class="day-dot"></div></div>`;
      firstDone = true;
    }
  }
  chipsEl.innerHTML = chips;

  sectionsEl.innerHTML = plan.map((day, i) => {
    const id = 'd' + (i + 1);
    const cards = day.ex.map(k => EXERCISES.find(e => e.key === k)).filter(Boolean).map(renderCard).join('');
    return `<div id="ex-${id}" ${i === 0 ? '' : 'style="display:none"'}>
      <div class="ex-section-label">${day.label} · Day ${calendarDayFor(i + 1)}</div>
      <div class="week-check" id="week-check-wrap-${id}" onclick="toggleDayDone('${id}')">
        <div class="week-check-box" id="week-check-${id}"></div>
        <div><div class="week-check-title">This week's session</div><div class="week-check-sub" id="week-check-sub-${id}"></div></div>
      </div>
      <div class="day-progress" data-day-progress="${id}"></div>
      <div class="ex-card-list" data-day-list="${id}">${cards}</div>
    </div>`;
  }).join('');

  planDayIds().forEach(updateDayProgress);
  EXERCISES.forEach(ex => updateLastLogged(ex.key));
}

function showDay(day, el) {
  document.querySelectorAll('.day-chip:not(.rest-chip)').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  planDayIds().forEach(id => {
    const e = document.getElementById('ex-' + id);
    if (e) e.style.display = 'none';
  });
  const t = document.getElementById('ex-' + day);
  if (t) { t.style.display = 'block'; loadVisibleImages(); }
}

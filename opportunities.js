import { programs, reviewedOn, topicLabels, filterPrograms, rankPrograms, matchReasons } from './opportunities-data.mjs?v=3';

const $ = id => document.getElementById(id);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const external = (url, label, className = '') => `<a href="${escapeHTML(url)}" class="${className}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const icons = {
  atom: '<ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
  robot: '<rect x="5" y="6" width="14" height="13" rx="3"/><path d="M12 6V3M2 10v6m20-6v6M9 16h6"/><circle cx="9" cy="11" r="1"/><circle cx="15" cy="11" r="1"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6zM12 1v3m0 16v3M1 12h3m16 0h3"/>',
  orbit: '<circle cx="12" cy="12" r="7"/><ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(-35 12 12)"/><path d="M12 5c-4 5-4 9 0 14m0-14c4 5 4 9 0 14"/>',
  rocket: '<path d="M9 15 7 9c3-5 7-7 13-7 0 6-2 10-7 13zM7 9H4l-2 5h7m4 1v5l5-2v-5M7 17l-3 4m1-6-3 3"/><circle cx="14" cy="8" r="2"/>',
  leaf: '<path d="M20 3C5 1 1 11 7 17s16 2 13-14ZM5 20 17 7M9 16v-5m4 1h5"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M15 8h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9m3-11v14"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>'
};
const icon = name => `<svg class="stem-symbol" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.compass}</svg>`;
const storageKey = 'stem2connect-shortlist-v1';
let saved = [];
try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); if (Array.isArray(value)) saved = [...new Set(value.filter(id => programs.some(p => p.id === id)))]; } catch { /* Private mode can disable storage; saving still works for this visit. */ }
let filters = { topics: [] }, preferences = {}, matches = programs, limit = 6, mapMode = false;
let map, markerLayer, mapPromise, tileFailures = 0;

function syncSaveButtons() {
  $('saved-count').textContent = saved.length;
  document.querySelectorAll('[data-save]').forEach(button => {
    const p = programs.find(p => p.id === button.dataset.save);
    const isSaved = saved.includes(p.id);
    button.setAttribute('aria-pressed', String(isSaved));
    button.setAttribute('aria-label', `${isSaved ? 'Remove' : 'Save'} ${p.name}${isSaved ? ' from shortlist' : ' to shortlist'}`);
    if (button.classList.contains('detail-save')) button.textContent = isSaved ? 'Saved to shortlist ✓' : 'Save to shortlist +';
  });
}
function toggleSaved(id) {
  saved = saved.includes(id) ? saved.filter(value => value !== id) : [...saved, id];
  let persistent = true;
  try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch { persistent = false; }
  $('opp-announcement').textContent = `${saved.includes(id) ? 'Added to' : 'Removed from'} your shortlist.${persistent ? '' : ' Changes will last for this visit only because browser storage is unavailable.'}`;
  if (filters.savedOnly) render(); else syncSaveButtons();
}
function statusText(p) {
  if (p.opens && new Date().toISOString().slice(0, 10) >= p.opens) return 'Check the announced application window';
  return p.cycle;
}
function card(p, i) {
  const reasons = filters.finder ? matchReasons(p, filters) : [];
  return `<article class="program-card" data-program="${p.id}" data-status="${p.status}" style="--card-index:${i % 6}">
    <div class="program-topline"><span class="program-kind"><span class="program-symbol">${icon(p.icon)}</span>${escapeHTML(p.kind)}</span><button type="button" class="save-program" data-save="${p.id}" aria-pressed="${saved.includes(p.id)}" aria-label="Save ${escapeHTML(p.name)} to shortlist">${icon('bookmark')}</button></div>
    <p class="program-org">${escapeHTML(p.organization)}</p><h3>${escapeHTML(p.name)}</h3><p class="program-description">${escapeHTML(p.description)}</p>
    ${reasons.length ? `<p class="program-reasons">Fits your interests: ${escapeHTML(reasons.slice(0, 2).join(' · '))}</p>` : ''}
    <div class="program-facts"><p>${icon('pin')}<span>${escapeHTML(p.location)}</span></p><p>${icon('clock')}<span>${escapeHTML(p.duration)}${p.modes.includes('online') ? ' · Online available' : ''}</span></p><p class="program-cost">${icon('coin')}<span>${escapeHTML(p.cost)}</span></p></div>
    <p class="program-status">${escapeHTML(statusText(p))}</p><div class="program-card-footer">${external(p.url, `${p.status === 'archived' ? 'Official archive' : 'Official program'} <span aria-hidden="true">↗</span>`, 'program-official')}<button class="program-details" type="button" data-detail="${p.id}" aria-label="Details for ${escapeHTML(p.name)}">View details +</button></div></article>`;
}
function readFilters() {
  for (const name of ['grade', 'budget', 'mode', 'region', 'status']) filters[name] = $(`filter-${name}`).value;
  filters.query = $('program-search').value;
}
function syncFilters() {
  for (const name of ['grade', 'budget', 'mode', 'region', 'status']) $(`filter-${name}`).value = filters[name] || '';
  $('program-search').value = filters.query || '';
  document.querySelectorAll('[data-topic]').forEach(button => button.setAttribute('aria-pressed', String(filters.topics.includes(button.dataset.topic))));
  $('saved-filter').setAttribute('aria-pressed', String(Boolean(filters.savedOnly)));
}
function render() {
  matches = rankPrograms(filterPrograms(programs, filters, saved), filters.finder ? filters : {});
  $('results-count').innerHTML = `<strong>${matches.length}</strong> ${filters.savedOnly ? 'saved ' : ''}${matches.length === 1 ? 'opportunity' : 'opportunities'}${filters.finder ? ' for your preferences' : ' to explore'}`;
  $('program-results').innerHTML = matches.slice(0, limit).map(card).join('');
  $('program-fallback').hidden = true;
  $('empty-results').hidden = matches.length > 0;
  $('empty-message').textContent = filters.savedOnly ? 'Save programs with the bookmark button, or clear filters to see more of your shortlist.' : 'No programs match all of these preferences yet. Try a broader subject, another grade, or fewer filters.';
  $('show-more').hidden = matches.length <= limit;
  $('show-more').innerHTML = `Explore ${Math.min(6, Math.max(0, matches.length - limit))} more programs <span aria-hidden="true">↓</span>`;
  $('match-summary').hidden = !filters.finder;
  const selected = questions.filter(q => Array.isArray(filters[q.key]) ? filters[q.key].length : Boolean(filters[q.key])).length;
  $('match-summary-text').textContent = `${selected} ${selected === 1 ? 'preference' : 'preferences'} considered. Open each program’s details for eligibility, costs, and timing. Your answers do not predict admission.`;
  syncFilters(); syncSaveButtons();
  if (mapMode && map) updateMap();
}
function clearFilters() {
  filters = {topics: []}; preferences = {}; answers = {}; limit = 6;
  syncFilters(); render();
}

$('topic-filters').innerHTML = Object.entries(topicLabels).map(([value,label]) => `<button type="button" class="topic-filter" data-topic="${value}" aria-pressed="false">${label}</button>`).join('');
$('directory-filters').addEventListener('submit', event => event.preventDefault());
$('directory-filters').addEventListener('change', () => {readFilters(); limit = 6; render();});
$('directory-filters').addEventListener('reset', event => {event.preventDefault(); clearFilters();});
$('topic-filters').addEventListener('click', event => {const button = event.target.closest('[data-topic]'); if (!button) return; const value = button.dataset.topic; filters.topics = filters.topics.includes(value) ? filters.topics.filter(t => t !== value) : [...filters.topics, value]; limit = 6; render();});
$('program-search').addEventListener('input', () => {readFilters(); limit = 6; render();});
$('saved-filter').addEventListener('click', () => {filters.savedOnly = !filters.savedOnly; limit = 6; render();});
$('empty-reset').addEventListener('click', clearFilters);
$('show-more').addEventListener('click', () => {const previousCount = Math.min(limit, matches.length); limit += 6; render(); const next = $('program-results').children[previousCount]?.querySelector('[data-detail]'); next?.focus({preventScroll: true});});
document.addEventListener('click', async event => {
  const save = event.target.closest('[data-save]'); if (save) toggleSaved(save.dataset.save);
  const detail = event.target.closest('[data-detail]'); if (detail) openDetail(detail.dataset.detail);
  const assess = event.target.closest('[data-assess]');
  if (assess) {
    assess.disabled = true;
    const status = assess.parentElement.querySelector('[role=status]');
    status.textContent = 'Opening your assessment…';
    try {
      const fit = await loadFitAssessment();
      if (assess.isConnected && assess.closest('dialog').open) fit.openAssessment(programs.find(p=>p.id===assess.dataset.assess), assess);
      status.textContent = '';
    } catch {status.textContent = 'The assessment could not load. Check your connection and try again; program details remain available.';}
    finally {assess.disabled = false;}
  }
  const close = event.target.closest('[data-close-dialog]'); if (close) close.closest('dialog').close();
});
for (const dialog of document.querySelectorAll('.opp-dialog')) {
  dialog.addEventListener('click', event => {if (event.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();});
}
function openDetail(id) {
  const p = programs.find(p => p.id === id); if (!p) return;
  $('program-detail').innerHTML = `<p class="opp-kicker">${escapeHTML(p.short)} / THE FIELD GUIDE</p><h2 id="detail-title">${escapeHTML(p.name)}</h2><p class="detail-intro">${escapeHTML(p.description)}</p><div class="detail-facts"><span>${escapeHTML(p.location)}</span><span>${escapeHTML(p.duration)}</span></div>
    <div class="detail-fit-invite"><div><span aria-hidden="true">✳</span><h3>Turn curiosity into a next step.</h3></div><p>A short, provider-informed checklist with transparent points and practical ways to prepare.</p><button type="button" class="opp-button primary" data-assess="${p.id}">Check my application fit ↗</button><p role="status" class="fit-loading-status"></p></div>
    ${[['Who it’s for',p.eligibility],['Cost & funding',p.costNote],['Application window',p.deadline],['Selection & admission',p.admissions]].map(([heading,text]) => `<div class="detail-block"><h3>${heading}</h3><p>${escapeHTML(text)}</p></div>`).join('')}
    ${p.alternative ? `<div class="detail-block"><h3>A current alternative to explore</h3><button type="button" class="opp-text-button" data-detail="${p.alternative}">Duke Summer Session ↗</button><p>A separate program with different fees and eligibility.</p></div>` : ''}
    <div class="detail-block"><h3>Check the original sources</h3><p>Confirm current availability and all requirements before applying. Matching is based on your preferences, not an admission prediction.</p><div class="detail-source-links">${[p.url,...p.sources].map((url,i) => external(url, i === 0 ? 'Official program ↗' : `Provider details ${i} ↗`)).join('')}</div></div><p class="detail-reviewed">GUIDE REVIEWED ${reviewedOn} · ${p.coordinates ? 'CAMPUS PIN IS APPROXIMATE' : 'ONLINE PROGRAM'}</p>
    <div class="detail-actions">${external(p.url, `${p.status === 'archived' ? 'Visit official archive' : 'Visit official program'} ↗`, 'opp-button primary')}<button class="opp-text-button detail-save" type="button" data-save="${p.id}">Save to shortlist +</button></div>`;
  syncSaveButtons(); const dialog = $('program-dialog'); if (!dialog.open) dialog.showModal(); dialog.scrollTop = 0;
}

let fitLoading;
function loadFitAssessment() {
  if (!fitLoading) fitLoading = Promise.all([
    import('./opportunities-fit.js?v=1'),
    new Promise((resolve,reject) => {
      const existing = document.querySelector('link[data-fit-style]');
      if (existing?.sheet) {resolve(); return;}
      existing?.remove();
      const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'opportunities-fit.css?v=1'; css.dataset.fitStyle = 'true';
      const timer = setTimeout(()=>{css.remove();reject(new Error('Stylesheet timeout'));},10000);
      css.onload = ()=>{clearTimeout(timer);resolve();}; css.onerror = ()=>{clearTimeout(timer);css.remove();reject(new Error('Stylesheet unavailable'));};
      document.head.append(css);
    })
  ]).then(([module])=>module).catch(error=>{fitLoading=null;throw error;});
  return fitLoading;
}

async function loadMapLibrary() {
  if (window.L) return;
  if (mapPromise) return mapPromise;
  mapPromise = new Promise((resolve, reject) => {
    let css = document.querySelector('link[data-map-library]');
    if (!css) { css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'assets/vendor/leaflet/leaflet.css'; css.dataset.mapLibrary = 'true'; document.head.append(css); }
    const script = document.createElement('script'); script.src = 'assets/vendor/leaflet/leaflet.js'; script.async = true;
    const timeout = setTimeout(() => {script.remove(); reject(new Error('Map library timeout'));}, 15000);
    script.onload = () => {clearTimeout(timeout); resolve();}; script.onerror = () => {clearTimeout(timeout); script.remove(); reject(new Error('Map library unavailable'));}; document.head.append(script);
  }).catch(error => {mapPromise = null; throw error;});
  return mapPromise;
}
async function ensureMap() {
  if (map) {map.invalidateSize(); updateMap(); return;}
  $('retry-map').hidden = true; $('map-status').textContent = 'Opening the map…';
  try {
    await loadMapLibrary();
    if (!map) {
      const L = window.L;
      map = L.map('opportunity-map', {scrollWheelZoom: false, zoomControl: true, minZoom: 2, maxZoom: 17, worldCopyJump: true}).setView([38.5,-97], 4);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'}).on('tileerror', () => {tileFailures++; $('map-status').textContent = 'Some map tiles could not load. Program pins and the directory are still available; try the map again when connected.'; $('retry-map').hidden = false;}).addTo(map);
      markerLayer = L.layerGroup().addTo(map);
    }
    if (mapMode) {map.invalidateSize(); updateMap();}
  } catch { $('map-status').textContent = 'The map could not load. All programs, locations, and links are still available in the directory below.'; $('retry-map').hidden = false; }
}
function updateMap() {
  if (!map) return;
  markerLayer.clearLayers();
  const groups = new Map();
  matches.filter(p => p.coordinates && p.status !== 'archived').forEach(p => {const key = p.coordinates.join(','); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(p);});
  for (const group of groups.values()) {
    const marker = window.L.marker(group[0].coordinates, {icon:window.L.divIcon({className:'program-pin',html:group.length > 1 ? String(group.length) : '↗',iconSize:[30,30],iconAnchor:[15,15]}),title:group.map(p=>p.name).join(' · '),keyboard:true});
    const popup = document.createElement('div'); popup.className = 'map-popup';
    popup.innerHTML = group.map(p => `<h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.location)}</p><p>${escapeHTML(statusText(p))}</p>${external(p.url,'Official program ↗')}<br><button type="button" class="opp-text-button" data-detail="${p.id}">View eligibility & details</button>`).join('<hr>');
    marker.bindPopup(popup).addTo(markerLayer);
  }
  const physical = matches.filter(p => p.coordinates && p.status !== 'archived').length;
  const online = matches.filter(p => !p.coordinates).length;
  if (!tileFailures) $('map-status').textContent = `${physical} campus ${physical === 1 ? 'program' : 'programs'} across ${groups.size} ${groups.size === 1 ? 'location' : 'locations'}. ${online} online-only ${online === 1 ? 'program' : 'programs'} in the directory. Discontinued programs are not pinned.`;
  if (groups.size) map.fitBounds([...groups.values()].map(group => group[0].coordinates),{padding:[35,35],maxZoom:8,animate:false});
}
function setMapView(value) {
  mapMode = value; $('map-panel').hidden = !value;
  $('map-view').setAttribute('aria-pressed', String(value)); $('list-view').setAttribute('aria-pressed', String(!value));
  if (value) ensureMap();
}
$('map-view').addEventListener('click', () => setMapView(true)); $('list-view').addEventListener('click', () => setMapView(false));
$('fit-map').addEventListener('click', updateMap);
$('retry-map').addEventListener('click', () => { if (map) {map.remove(); map = null; markerLayer = null;} tileFailures = 0; ensureMap(); });

const questions = [
  {key:'topics',title:'What sparks your curiosity?',hint:'Choose as many subjects as you like.',multiple:true,options:Object.entries(topicLabels)},
  {key:'grade',title:'What grade will you be entering?',hint:'Choose your grade at the start of the program. Final eligibility depends on the provider.',options:[[1,'Grade 1'],[2,'Grade 2'],[3,'Grade 3'],[4,'Grade 4'],[5,'Grade 5'],[6,'Grade 6'],[7,'Grade 7'],[8,'Grade 8'],[9,'Grade 9'],[10,'Grade 10'],[11,'Grade 11'],[12,'Grade 12'],[13,'Recent graduate'],['','Any grade']]},
  {key:'age',title:'How old will you be then?',hint:'Some programs have a minimum age. You can skip this question.',options:[[12,'12 or younger'],[13,'13'],[14,'14'],[15,'15'],[16,'16'],[17,'17'],[18,'18 or older'],['','Prefer to skip']]},
  {key:'mode',title:'Where do you learn best?',hint:'Pick a setting, or keep both possibilities open.',options:[['campus','On a campus'],['online','Online, from anywhere'],['','Either works for me']]},
  {key:'budget',title:'What feels doable financially?',hint:'Tuition-free programs can still have application fees or travel costs. Unknown fees are excluded from the $500 filter.',options:[['free','Tuition-free'],['500','Published fee up to $500'],['aid','Tuition-free or financial aid'],['','Keep every option open']]},
  {key:'region',title:'Where would you like to explore?',hint:'Choose a broad region. This guide does not request your location.',options:[['northeast','Northeast US'],['midwest','Midwest US'],['south','Southern US'],['west','Western US'],['online','Online only'],['','Anywhere']]},
  {key:'season',title:'When do you have time?',hint:'Check the actual dates in each program’s details before planning.',options:[['summer','During the summer'],['year-round','During the school year'],['','I can be flexible']]},
  {key:'duration',title:'How much time can you set aside?',hint:'Choose a shorter experience or a deeper commitment. Unknown durations are excluded when you choose a limit.',options:[['short','Up to two weeks'],['long','More than two weeks'],['','Any duration']]},
  {key:'goal',title:'What would make it worthwhile?',hint:'We will bring programs with this focus toward the top of your shortlist.',options:[['build','Make or build something'],['research','Try real research'],['explore','Discover what I enjoy'],['college','Prepare for college']]},
  {key:'experience',title:'Where are you in your STEM journey?',hint:'This helps order your matches. It is not an assessment of your ability or your chances of admission.',options:[['beginner','Just getting started'],['exploring','I’ve tried a few things'],['advanced','Ready for a deeper challenge'],['','Let me explore everything']]}
];
let answers = {}, step = 0;
function showQuestion() {
  const q = questions[step]; $('question-number').textContent = `${String(step + 1).padStart(2,'0')} / 10`;
  $('finder-progress-bar').style.width = `${(step + 1)*10}%`;
  $('question-title').textContent = q.title; $('question-hint').textContent = q.hint;
  $('question-options').innerHTML = q.options.map(([value,label]) => `<button type="button" data-answer="${value}" aria-pressed="${q.multiple ? (answers[q.key] || []).includes(String(value)) : answers[q.key] === String(value)}">${label}</button>`).join('');
  $('finder-back').disabled = step === 0; $('finder-next').textContent = step === 9 ? 'Find my matches ↗' : 'Next →';
  $('question-title').focus({preventScroll:true});
}
function openFinder() {if (filters.finder) answers = {...filters, topics:[...filters.topics]}; step = 0; $('finder-dialog').showModal(); showQuestion();}
function finishFinder() {
  preferences = {...answers, topics:[...(answers.topics || [])]};
  filters = {...preferences, topics:preferences.topics, finder:true}; limit = 6;
  render(); $('finder-dialog').close(); $('explore').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'start'});
  $('program-search').focus({preventScroll:true});
}
document.querySelectorAll('[data-start-finder]').forEach(button => button.addEventListener('click',openFinder));
$('question-options').addEventListener('click', event => {const button = event.target.closest('[data-answer]'); if (!button) return; const q = questions[step], value = button.dataset.answer;
  if (q.multiple) {const current = answers[q.key] || []; answers[q.key] = current.includes(value) ? current.filter(v => v !== value) : [...current,value];} else answers[q.key] = value;
  document.querySelectorAll('[data-answer]').forEach(option => option.setAttribute('aria-pressed',String(q.multiple ? answers[q.key].includes(option.dataset.answer) : answers[q.key] === option.dataset.answer)));
});
$('finder-next').addEventListener('click', () => {if (step < 9) {step++; showQuestion();} else finishFinder();});
$('finder-skip').addEventListener('click', () => {delete answers[questions[step].key]; if (step < 9) {step++; showQuestion();} else finishFinder();});
$('finder-back').addEventListener('click', () => {if (step > 0) {step--; showQuestion();}});

let suggestionDraft = '';
$('opportunity-form').addEventListener('submit', event => {
  event.preventDefault(); const form = event.currentTarget; if (!form.reportValidity()) return;
  const linkInput = $('program-link'); let url;
  try {url = new URL(linkInput.value); if (!['https:','http:'].includes(url.protocol)) throw new Error('Unsupported protocol');} catch {linkInput.setCustomValidity('Enter a complete http:// or https:// program URL.'); linkInput.reportValidity(); return;}
  const fields = [['Program','program-name'],['Organization','org-name'],['Category','category'],['Age / grades','age-group'],['Location / format','location-name'],['Official link','program-link'],['Description','program-description'],['Cost','cost'],['Timing','format']];
  suggestionDraft = 'Hello STEM2Connect,\n\nI would like to suggest this opportunity for the directory:\n\n'+fields.map(([label,id]) => `${label}: ${$(id).value.trim() || 'Not specified'}`).join('\n\n');
  $('suggestion-text').textContent = suggestionDraft;
  $('send-suggestion').href = `mailto:stem4teens@gmail.com?subject=${encodeURIComponent('Opportunity suggestion: '+$('program-name').value.trim())}&body=${encodeURIComponent(suggestionDraft)}`;
  $('suggestion-preview').hidden = false;
  $('opp-announcement').textContent = 'Email draft prepared. It has not been submitted. Review and send it from your email app.';
  $('suggestion-preview').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'nearest'});
});
$('program-link').addEventListener('input', () => $('program-link').setCustomValidity(''));
$('opportunity-form').addEventListener('input', () => {$('suggestion-preview').hidden = true;});
$('download-suggestion').addEventListener('click', () => {const blob = new Blob([suggestionDraft],{type:'text/plain;charset=utf-8'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'STEM2Connect-opportunity-suggestion.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000);});

const navToggle = $('navToggle'), navLinks = $('navLinks');
function closeNav() {navLinks.classList.remove('active'); navToggle.classList.remove('active'); navToggle.setAttribute('aria-expanded','false'); navToggle.setAttribute('aria-label','Open navigation menu'); document.body.classList.remove('nav-open');}
navToggle.addEventListener('click', () => {const open = navLinks.classList.toggle('active'); navToggle.classList.toggle('active',open); navToggle.setAttribute('aria-expanded',String(open)); navToggle.setAttribute('aria-label',open ? 'Close navigation menu' : 'Open navigation menu'); document.body.classList.toggle('nav-open',open);});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click',closeNav));
document.addEventListener('keydown', event => {if (event.key === 'Escape' && navLinks.classList.contains('active')) {closeNav(); navToggle.focus();}});
matchMedia('(min-width:1121px)').addEventListener('change', event => {if (event.matches) closeNav();});
const mobileFilters = matchMedia('(max-width:800px)');
const disclosure = document.querySelector('.filter-disclosure'); disclosure.open = !mobileFilters.matches;
mobileFilters.addEventListener('change', event => {disclosure.open = !event.matches;});
$('year').textContent = new Date().getFullYear(); $('program-total').textContent = programs.length;
let needleTurn = 0, pointerFrame = 0, pointerX = 0, pointerY = 0;
$('spin-compass').addEventListener('click', () => {needleTurn += 270; $('spin-compass').style.setProperty('--needle-turn',`${needleTurn}deg`);});
const art = $('discovery-art');
art.addEventListener('pointermove', event => {
  if (!matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches) return;
  const bounds = art.getBoundingClientRect(); pointerX = (event.clientY-bounds.top)/bounds.height; pointerY = (event.clientX-bounds.left)/bounds.width;
  if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {art.style.setProperty('--tilt-x',`${(pointerX-.5)*-12}deg`); art.style.setProperty('--tilt-y',`${(pointerY-.5)*12}deg`); pointerFrame=0;});
});
art.addEventListener('pointerleave', () => {cancelAnimationFrame(pointerFrame); pointerFrame=0; art.style.setProperty('--tilt-x','0deg'); art.style.setProperty('--tilt-y','0deg');});
render();

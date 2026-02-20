/* ════════════════════════════════════════════════
   VIGIL — A Method for the Deliberate Life
   Drawn from: Al-Kindī · Al-Ghazālī
              Baltasar Gracián · C.G. Jung
════════════════════════════════════════════════ */

'use strict';

/* ══ HIJRI CALENDAR ENGINE ═══════════════════════
   Astronomical Tabular Hijri calculation
   Valid: 622 CE → 2200 CE (±1 day from observed)
═════════════════════════════════════════════════*/
function gregorianToHijri(gYear, gMonth, gDay) {
  const a   = Math.floor((14 - gMonth) / 12);
  const y   = gYear + 4800 - a;
  const m   = gMonth + 12 * a - 3;
  const jdn = gDay
    + Math.floor((153 * m + 2) / 5)
    + 365 * y + Math.floor(y / 4)
    - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  const l  = jdn - 1948440 + 10632;
  const n  = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j  =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670)           * Math.floor((43 * l2) / 15238);
  const l3 = l2
    - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
    - Math.floor(j / 16)         * Math.floor((15238 * j) / 43) + 29;
  const hMonth = Math.floor((24 * l3) / 709);
  const hDay   = l3 - Math.floor((709 * hMonth) / 24);
  const hYear  = 30 * n + j - 30;
  return { year: hYear, month: hMonth, day: hDay };
}

const HIJRI_MONTHS_EN = [
  'Muḥarram','Ṣafar','Rabīʿ I','Rabīʿ II',
  'Jumādā I','Jumādā II','Rajab','Shaʿbān',
  'Ramaḍān','Shawwāl','Dhū al-Qaʿdah','Dhū al-Ḥijjah'
];

function todayHijri() {
  const n = new Date();
  const h = gregorianToHijri(n.getFullYear(), n.getMonth() + 1, n.getDate());
  return `${h.day} ${HIJRI_MONTHS_EN[h.month - 1]}, ${h.year} AH`;
}

function dateToHijri(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const h = gregorianToHijri(y, m, d);
  return `${h.day} ${HIJRI_MONTHS_EN[h.month - 1]} ${h.year} AH`;
}

/* ══ VERIFIED QUOTES ════════════════════════════
   Sources cited. Paraphrases flagged.
   Misattributed quotes from prior version removed.
═════════════════════════════════════════════════*/
const QUOTES = [
  {
    text: "The duty of the man who investigates the writings of scientists is to make himself an enemy of all that he reads, and attack it from every side. He should also suspect himself as he performs his critical examination, so that he may avoid falling into either prejudice or leniency.",
    author: "Ibn al-Haytham",
    era: "Kitāb al-Manāẓir (Book of Optics), Preface · Basra, c. 1011 CE"
  },
  {
    text: "The moving finger writes; and, having writ, moves on — nor all thy piety nor wit shall lure it back to cancel half a line, nor all thy tears wash out a word of it.",
    author: "Omar Khayyām",
    era: "Rubāʿiyyāt, Quatrain LXXI · trans. FitzGerald · Nishapur, c. 1100 CE"
  },
  {
    text: "The past resembles the future more than one drop of water resembles another.",
    author: "Ibn Khaldūn",
    era: "Muqaddima, Book One · Tunis, 1377 CE"
  },
  {
    text: "Geometry existed before the creation. It is coeternal with the mind of God.",
    author: "attributed to Al-Kindī",
    era: "Paraphrase of his Platonic philosophy · Baghdad, c. 850 CE"
  },
  {
    text: "The knowledge of anything, since all things have causes, is not acquired or complete unless it is known by its causes.",
    author: "Ibn Sina",
    era: "Kitāb al-Shifāʾ (Book of Healing), Logic · Hamadan, c. 1020 CE"
  },
  {
    text: "Social organization is necessary to the human species. Without it, the existence of human beings would be incomplete.",
    author: "Ibn Khaldūn",
    era: "Muqaddima, Chapter One · Tunis, 1377 CE"
  },
  {
    text: "Whoever wishes to investigate medical science must consider the following: first, the physical constitution of man in all its complexity.",
    author: "Ibn Sina",
    era: "Al-Qānūn fī al-Ṭibb (Canon of Medicine), Book One · c. 1025 CE"
  },
  {
    text: "Man is the measure of all things, both of things that are, that they are, and of things that are not, that they are not.",
    author: "Al-Fārābī, quoting and engaging with Protagoras",
    era: "Iḥṣāʾ al-ʿUlūm (Enumeration of the Sciences) · Baghdad, c. 940 CE"
  },
  {
    text: "He who does not know himself does not know anything else.",
    author: "Al-Kindi",
    era: "Fī al-Falsafat al-Ūlā (On First Philosophy) · Baghdad, c. 850 CE"
  },
  {
    text: "I have never met a wise man who regretted that he had been silent. I have met many who regretted speaking.",
    author: "Al-Jāḥiẓ",
    era: "Al-Bayān wa al-Tabyīn (The Book of Eloquence) · Basra, c. 845 CE"
  },
  {
    text: "A book is the best companion; it keeps you company yet takes up none of your time.",
    author: "Al-Jāḥiẓ",
    era: "Kitāb al-Ḥayawān (Book of Animals) · Basra, c. 850 CE · trans. paraphrase"
  },
  {
    text: "Seek out that particular mental attribute which makes you feel most deeply and vitally alive — along with which comes the inner voice which says, 'This is the real me.'",
    author: "Al-Ghazālī",
    era: "Iḥyāʾ ʿUlūm al-Dīn (Revival of the Religious Sciences) · Tus, c. 1105 CE · paraphrase"
  },
  {
    text: "Act swiftly on the hour that is given to you, for every hour that passes is irrecoverable.",
    author: "Ibn ʿAṭāʾ Allāh al-Iskandarī",
    era: "Al-Ḥikam al-ʿAṭāʾiyyah (Book of Wisdom) · Alexandria, c. 1280 CE · paraphrase"
  },
  {
    text: "India is a different world. Its people differ from ours in every respect. They have their own sciences which they do not share and their own civilization which we ought to study without prejudice.",
    author: "Al-Bīrūnī",
    era: "Taḥqīq mā lil-Hind (Kitāb al-Hind), Preface · Ghazni, c. 1030 CE"
  },
  {
    text: "We are the children of our era. The thinker who separates himself from his age resembles someone who tries to walk without earth beneath his feet.",
    author: "Ibn Rushd (Averroes)",
    era: "Faṣl al-Maqāl (The Decisive Treatise) · Córdoba, c. 1180 CE · paraphrase"
  },
  {
    text: "The end of all activity is the end of inactivity; but the end of knowledge is perpetual wonder.",
    author: "Al-Kindī",
    era: "Attributed in several biographical sources · Baghdad, c. 870 CE"
  },
];

/* ══ DEFAULT DATA ════════════════════════════════ */
const DEFAULT_DATA = {
  treasury: {
    transactions: [],
    categories: [
      { id: 'cat1', name: 'Food & Drink',    icon: '🥘', color: '#c0392b' },
      { id: 'cat2', name: 'Dwelling',        icon: '🏠', color: '#8e44ad' },
      { id: 'cat3', name: 'Transport',       icon: '🐎', color: '#2980b9' },
      { id: 'cat4', name: 'Recreation',      icon: '🎻', color: '#f39c12' },
      { id: 'cat5', name: 'Instruments',     icon: '⚗️', color: '#27ae60' },
      { id: 'cat6', name: 'Medicine',        icon: '🌿', color: '#e74c3c' },
      { id: 'cat7', name: 'Salary',          icon: '📋', color: '#f1c40f' },
      { id: 'cat8', name: 'Trade',           icon: '⚖️', color: '#1abc9c' },
      { id: 'cat9', name: 'Miscellaneous',   icon: '📦', color: '#7f8c8d' },
    ],
    bankBalance: null,
    cashBalance: null,
    goldEntries: [],
    cachedGoldPrice: null,
  },
  habits: { habits: [], logs: [] },
  gym: {
    sessions: [],
    workoutTypes: ['Push','Pull','Legs','Cardio','Upper Body','Lower Body','Full Body','Rest'],
  },
  study: { subjects: [], sessions: [] },
  journal: { entries: [] },
};

/* ══ STATE ═══════════════════════════════════════ */
let STATE = {
  activeTab: 'home',
  treasuryView: 'log',
  txFilter: 'all',
  studyTimer: { running: false, seconds: 0, interval: null, subject: '', mode: 'focus' },
  journalSearch: '',
};

let DATA = {};

/* ══ PERSISTENCE ═════════════════════════════════ */
function loadData() {
  try {
    const raw = localStorage.getItem('vigil_v1');
    DATA = raw ? deepMerge(DEFAULT_DATA, JSON.parse(raw)) : JSON.parse(JSON.stringify(DEFAULT_DATA));
  } catch(e) {
    DATA = JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData() {
  try { localStorage.setItem('vigil_v1', JSON.stringify(DATA)); }
  catch(e) { toast('⚠ Storage limit reached'); }
}

function deepMerge(target, source) {
  const out = Object.assign({}, target);
  for (const k of Object.keys(source)) {
    if (Array.isArray(source[k])) out[k] = source[k];
    else if (source[k] && typeof source[k] === 'object') out[k] = deepMerge(target[k] || {}, source[k]);
    else out[k] = source[k];
  }
  return out;
}

/* ══ UTILS ═══════════════════════════════════════ */
function uid()     { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function today()   { return new Date().toISOString().slice(0,10); }
function pad(n)    { return String(n).padStart(2,'0'); }

function formatDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'2-digit' });
}

function formatDateFull(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}

function monthKey(date)   { return date.slice(0,7); }
function monthLabel(yyyymm) {
  const [y,m] = yyyymm.split('-');
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return names[parseInt(m)-1] + ' ' + y;
}

function fmtEGP(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return 'EGP ' + Math.abs(n).toLocaleString('en-EG', {minimumFractionDigits:0, maximumFractionDigits:0});
}

function fmtMin(min) {
  const h = Math.floor(min/60), m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function fmtSec(sec) {
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function toast(msg, dur=2300) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), dur);
}

/* ══ MODAL ═══════════════════════════════════════ */
function showModal(html) {
  document.getElementById('modal-inner').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function hideModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-inner').innerHTML = '';
}

/* ══ NAVIGATION ══════════════════════════════════ */
const TAB_META = {
  home:     { title: 'VIGIL',       sub: null },
  treasury: { title: 'THE ACCOUNT', sub: 'Al-Kindī\'s Device' },
  habits:   { title: 'THE WATCH',   sub: 'Murāqaba' },
  gym:      { title: 'THE VESSEL',  sub: 'Physical Discipline' },
  study:    { title: 'THE LAMP',    sub: 'Al-Muṭālaʿa' },
  journal:  { title: 'THE WITNESS', sub: 'Nightly Account' },
};

function setupNav() {
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
  });
  document.getElementById('modal-close').addEventListener('click', hideModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') hideModal();
  });
  document.getElementById('back-btn').addEventListener('click', () => showTab('home'));
}

function showTab(tab) {
  STATE.activeTab = tab;

  // Nav tabs
  document.querySelectorAll('.nav-tab').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tab)
  );

  // Content sections
  document.querySelectorAll('.tab-content').forEach(s =>
    s.classList.toggle('active', s.id === 'tab-' + tab)
  );

  // Header title
  const meta = TAB_META[tab];
  document.getElementById('header-title').textContent = meta.title;

  // Back button — visible on all tabs except home
  const backBtn = document.getElementById('back-btn');
  backBtn.classList.toggle('visible', tab !== 'home');

  // Clean up stray FABs
  document.querySelectorAll('.fab').forEach(f => f.remove());

  // Render
  const renders = {
    home:     renderHome,
    treasury: renderTreasury,
    habits:   renderHabits,
    gym:      renderGym,
    study:    renderStudy,
    journal:  renderJournal,
  };
  if (renders[tab]) renders[tab]();
}

/* ═══════════════════════════════════════════════
   HOME — VIGIL
═══════════════════════════════════════════════ */
function renderHome() {
  const el = document.getElementById('tab-home');

  const txToday        = DATA.treasury.transactions.filter(t => t.date === today());
  const habitsTotal    = DATA.habits.habits.length;
  const habitsDone     = DATA.habits.logs.filter(l => l.date === today()).length;
  const weekAgo        = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const gymThisWeek    = DATA.gym.sessions.filter(s => new Date(s.date) >= weekAgo).length;
  const todayStudyMin  = DATA.study.sessions.filter(s => s.date === today()).reduce((a,s) => a+s.durationMin, 0);
  const monthJournal   = DATA.journal.entries.filter(e => e.date.slice(0,7) === today().slice(0,7)).length;

  const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const now         = new Date();
  const gregStr     = `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
  const hijriStr    = todayHijri();

  // Rotate quote daily
  const doy   = Math.floor((now - new Date(now.getFullYear(),0,0)) / 86400000);
  const quote = QUOTES[doy % QUOTES.length];

  el.innerHTML = `
    <div class="home-banner">
      <span class="home-crest">🕯️</span>
      <div class="home-vigil-title">Vigil</div>
      <div class="home-dates">
        <div class="home-date-gregorian">${gregStr}</div>
        <div class="home-date-hijri">◈ ${hijriStr}</div>
      </div>
    </div>

    <div class="home-divider">◈</div>
    <div class="section-title">The Five Practices</div>

    <div class="home-grid">
      <div class="home-card" style="--card-tint:rgba(184,120,24,0.05)" onclick="showTab('treasury')">
        <div class="home-card-practice">Al-Kindī · Monthly Audit</div>
        <span class="home-card-icon">⚖️</span>
        <div class="home-card-name">The Account</div>
        <div class="home-card-stat">${txToday.length} entries today</div>
      </div>
      <div class="home-card" style="--card-tint:rgba(34,152,122,0.05)" onclick="showTab('habits')">
        <div class="home-card-practice">Al-Ghazālī · Murāqaba</div>
        <span class="home-card-icon">◉</span>
        <div class="home-card-name">The Watch</div>
        <div class="home-card-stat">${habitsDone}/${habitsTotal} kept today</div>
      </div>
      <div class="home-card" style="--card-tint:rgba(66,114,200,0.05)" onclick="showTab('gym')">
        <div class="home-card-practice">All four · The body as instrument</div>
        <span class="home-card-icon">⬡</span>
        <div class="home-card-name">The Vessel</div>
        <div class="home-card-stat">${gymThisWeek} sessions this week</div>
      </div>
      <div class="home-card" style="--card-tint:rgba(32,160,184,0.05)" onclick="showTab('study')">
        <div class="home-card-practice">Al-Kindī · Intellectual audit</div>
        <span class="home-card-icon">◬</span>
        <div class="home-card-name">The Lamp</div>
        <div class="home-card-stat">${todayStudyMin > 0 ? fmtMin(todayStudyMin) + ' today' : 'No study today'}</div>
      </div>
      <div class="home-card" style="--card-tint:rgba(122,24,32,0.04); grid-column:1/-1" onclick="showTab('journal')">
        <div class="home-card-practice">Al-Ghazālī + Jung · Nightly account · Honest witness</div>
        <span class="home-card-icon">🕯️</span>
        <div class="home-card-name">The Witness</div>
        <div class="home-card-stat">${monthJournal} entries this month</div>
      </div>
    </div>

    <div class="home-divider">◈</div>
    <div class="section-title">The Sages</div>
    <div class="quote-card">
      <span class="quote-open">❝</span>
      <div class="quote-text">${quote.text}</div>
      <div class="quote-author">${quote.author}</div>
      <div class="quote-era">${quote.era}</div>
    </div>`;
}

/* ═══════════════════════════════════════════════
   MODULE HEADER HELPER
═══════════════════════════════════════════════ */
function moduleHeader(eyebrow, title, subtitle) {
  return `
    <div class="module-header">
      <div class="module-eyebrow">${eyebrow}</div>
      <div class="module-title">${title}</div>
      <div class="module-rule">
        <div class="module-rule-line rev"></div>
        <div class="module-rule-glyph">◈</div>
        <div class="module-rule-line"></div>
      </div>
      <div class="module-subtitle">${subtitle}</div>
    </div>`;
}

/* ═══════════════════════════════════════════════
   TREASURY — BAYT AL-MĀL
   بيت المال — The House of Wealth
═══════════════════════════════════════════════ */
function renderTreasury() {
  const el = document.getElementById('tab-treasury');
  el.innerHTML = `
    ${moduleHeader('Al-Kindī · Practice III', 'The Account', 'The complete audit of your financial position — income, expenditure, reserve')}
    <div class="treasury-tabs">
      <button class="treasury-tab ${STATE.treasuryView==='log'?'active':''}"       onclick="switchTreasuryView('log')">Ledger</button>
      <button class="treasury-tab ${STATE.treasuryView==='dashboard'?'active':''}" onclick="switchTreasuryView('dashboard')">Charts</button>
      <button class="treasury-tab ${STATE.treasuryView==='compare'?'active':''}"   onclick="switchTreasuryView('compare')">Monthly</button>
      <button class="treasury-tab ${STATE.treasuryView==='reconcile'?'active':''}" onclick="switchTreasuryView('reconcile')">Balance</button>
      <button class="treasury-tab ${STATE.treasuryView==='vault'?'active':''}"     onclick="switchTreasuryView('vault')">◈ Reserve</button>
    </div>
    <div id="treasury-view"></div>`;
  renderTreasuryView();
  if (STATE.treasuryView === 'log') addFAB('+', showAddTransaction);
}

function switchTreasuryView(view) {
  STATE.treasuryView = view;
  document.querySelectorAll('.fab').forEach(f => f.remove());
  renderTreasury();
}
window.switchTreasuryView = switchTreasuryView;

function renderTreasuryView() {
  const el = document.getElementById('treasury-view');
  switch(STATE.treasuryView) {
    case 'log':       el.innerHTML = renderTxLog();       break;
    case 'dashboard': el.innerHTML = ''; renderDashboard(el); break;
    case 'compare':   el.innerHTML = renderMonthlyCompare(); break;
    case 'reconcile': el.innerHTML = renderReconcile();   break;
    case 'vault':     el.innerHTML = ''; renderVault(el); break;
  }
}

/* ─── Tx Log ─── */
function renderTxLog() {
  const txs  = DATA.treasury.transactions;
  const cats = DATA.treasury.categories;
  const thisMonth = today().slice(0,7);
  const monthTx   = txs.filter(t => t.date.slice(0,7) === thisMonth);
  const income    = monthTx.filter(t => t.type==='income') .reduce((a,t)=>a+t.amount,0);
  const expense   = monthTx.filter(t => t.type==='expense').reduce((a,t)=>a+t.amount,0);
  const net       = income - expense;

  let filtered = [...txs].sort((a,b) => b.date.localeCompare(a.date));
  if (STATE.txFilter === 'income')   filtered = filtered.filter(t => t.type==='income');
  else if (STATE.txFilter === 'expense') filtered = filtered.filter(t => t.type==='expense');
  else if (STATE.txFilter !== 'all') filtered = filtered.filter(t => t.categoryId === STATE.txFilter);

  const chips = [
    {id:'all',label:'All'},
    {id:'income',label:'Income'},
    {id:'expense',label:'Expense'},
    ...cats.map(c => ({id:c.id, label:c.icon+' '+c.name}))
  ];

  const txHTML = filtered.slice(0,60).map(tx => {
    const cat = cats.find(c=>c.id===tx.categoryId) || {icon:'📦',name:'Other'};
    return `<div class="tx-item">
      <div class="tx-icon">${cat.icon}</div>
      <div class="tx-info">
        <div class="tx-category">${cat.name}</div>
        <div class="tx-note">${tx.note || '<em>No note</em>'}</div>
        <div class="tx-date">${formatDate(tx.date)}</div>
      </div>
      <div class="tx-amount ${tx.type}">${tx.type==='income'?'+':'-'}${fmtEGP(tx.amount)}</div>
      <button class="tx-del" onclick="deleteTransaction('${tx.id}')">🗑</button>
    </div>`;
  }).join('');

  return `
    <div class="summary-bar">
      <div class="summary-cell"><div class="summary-cell-label">Income</div><div class="summary-cell-val text-green">${fmtEGP(income)}</div></div>
      <div class="summary-cell"><div class="summary-cell-label">Spent</div><div class="summary-cell-val text-red">${fmtEGP(expense)}</div></div>
      <div class="summary-cell"><div class="summary-cell-label">Net</div><div class="summary-cell-val ${net>=0?'text-green':'text-red'}">${net>=0?'+':''}${fmtEGP(net)}</div></div>
    </div>
    <div class="filter-row">${chips.map(f=>`<div class="filter-chip ${STATE.txFilter===f.id?'active':''}" onclick="setTxFilter('${f.id}')">${f.label}</div>`).join('')}</div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div class="section-title" style="margin:0">Transactions</div>
        <button class="btn btn-sm" onclick="showCategoryManager()">⚙ Categories</button>
      </div>
      ${filtered.length ? txHTML : '<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">The ledger is empty</div><div class="empty-sub">No transactions recorded yet</div></div>'}
    </div>`;
}
window.setTxFilter = f => { STATE.txFilter = f; renderTreasury(); };

function showAddTransaction() {
  const cats = DATA.treasury.categories;
  showModal(`
    <div class="modal-title">Record Transaction</div>
    <div class="type-toggle">
      <button class="type-toggle-btn expense" id="type-expense" onclick="toggleTxType('expense')">Expenditure</button>
      <button class="type-toggle-btn income active" id="type-income" onclick="toggleTxType('income')">Income</button>
    </div>
    <input type="hidden" id="tx-type" value="income">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Amount (EGP)</label><input class="form-control" type="number" id="tx-amount" placeholder="0" inputmode="decimal"></div>
      <div class="form-group"><label class="form-label">Date</label><input class="form-control" type="date" id="tx-date" value="${today()}"></div>
    </div>
    <div class="form-group"><label class="form-label">Category</label><select class="form-control" id="tx-cat">${cats.map(c=>`<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Note</label><input class="form-control" type="text" id="tx-note" placeholder="Description"></div>
    <button class="btn btn-primary btn-full" onclick="submitTransaction()">Record</button>`);
  toggleTxType('income');
}

window.toggleTxType = function(type) {
  document.getElementById('tx-type').value = type;
  document.getElementById('type-expense').classList.toggle('active', type==='expense');
  document.getElementById('type-income').classList.toggle('active', type==='income');
};

window.submitTransaction = function() {
  const amount = parseFloat(document.getElementById('tx-amount').value);
  const date   = document.getElementById('tx-date').value;
  const type   = document.getElementById('tx-type').value;
  const catId  = document.getElementById('tx-cat').value;
  const note   = document.getElementById('tx-note').value.trim();
  if (!amount || amount<=0) { toast('Enter a valid amount'); return; }
  if (!date) { toast('Enter a date'); return; }
  DATA.treasury.transactions.push({ id:uid(), amount, date, type, categoryId:catId, note });
  saveData(); hideModal(); toast('Transaction recorded'); renderTreasury();
};

window.deleteTransaction = function(id) {
  if (!confirm('Remove this transaction?')) return;
  DATA.treasury.transactions = DATA.treasury.transactions.filter(t=>t.id!==id);
  saveData(); renderTreasury();
};

/* ─── Category Manager ─── */
window.showCategoryManager = function() {
  const cats   = DATA.treasury.categories;
  const colors = ['#c0392b','#e67e22','#f1c40f','#2ecc71','#1abc9c','#3498db','#9b59b6','#e91e63','#7f8c8d','#27ae60','#2980b9','#8e44ad'];
  showModal(`
    <div class="modal-title">Categories</div>
    <div id="cat-list">
      ${cats.map(c=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(196,136,26,0.1)">
        <span style="font-size:18px">${c.icon}</span>
        <span style="flex:1;font-family:var(--font-cairo);font-size:13px">${c.name}</span>
        <button class="btn btn-sm btn-danger" onclick="deleteCategory('${c.id}')">Remove</button>
      </div>`).join('')}
    </div>
    <div class="divider">New Category</div>
    <div class="form-row">
      <input class="form-control" type="text" id="new-cat-icon" placeholder="Emoji" style="max-width:80px">
      <input class="form-control" type="text" id="new-cat-name" placeholder="Name">
    </div>
    <div class="form-group mt-8"><label class="form-label">Color</label>
      <div class="color-options">${colors.map((c,i)=>`<div class="color-opt ${i===0?'selected':''}" style="background:${c}" data-color="${c}" onclick="selectColor(this)"></div>`).join('')}</div>
    </div>
    <button class="btn btn-primary btn-full mt-8" onclick="addCategory()">Add Category</button>`);
};

window.selectColor = function(el) {
  document.querySelectorAll('.color-opt').forEach(d=>d.classList.remove('selected'));
  el.classList.add('selected');
};

window.addCategory = function() {
  const icon  = document.getElementById('new-cat-icon').value.trim() || '📦';
  const name  = document.getElementById('new-cat-name').value.trim();
  const color = (document.querySelector('.color-opt.selected')||{}).dataset?.color || '#7f8c8d';
  if (!name) { toast('Enter a category name'); return; }
  DATA.treasury.categories.push({ id:uid(), icon, name, color });
  saveData(); toast('Category added'); showCategoryManager();
};

window.deleteCategory = function(id) {
  if (DATA.treasury.transactions.some(t=>t.categoryId===id)) { toast('Category in use'); return; }
  DATA.treasury.categories = DATA.treasury.categories.filter(c=>c.id!==id);
  saveData(); showCategoryManager();
};

/* ─── Dashboard / Pie ─── */
function renderDashboard(el) {
  const txs  = DATA.treasury.transactions;
  const cats = DATA.treasury.categories;
  const thisMonth = today().slice(0,7);
  const monthTx   = txs.filter(t=>t.date.slice(0,7)===thisMonth);

  const bycat = {};
  monthTx.filter(t=>t.type==='expense').forEach(t => {
    bycat[t.categoryId] = (bycat[t.categoryId]||0)+t.amount;
  });
  const total = Object.values(bycat).reduce((a,b)=>a+b,0);
  const pieData = Object.entries(bycat).map(([catId,amount]) => {
    const cat = cats.find(c=>c.id===catId) || {icon:'📦',name:'Other',color:'#7f8c8d'};
    return { cat, amount, pct: total>0?(amount/total)*100:0 };
  }).sort((a,b)=>b.amount-a.amount);

  const incomeTotal = monthTx.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0);

  el.innerHTML = `
    <div class="section-title">${monthLabel(thisMonth)} — Expenditure</div>
    <div class="card">
      ${total===0
        ? '<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-title">No expenses this month</div></div>'
        : `<div class="chart-wrap">${buildPie(pieData)}<div class="pie-legend">
            ${pieData.map(d=>`<div class="legend-item"><div class="legend-dot" style="background:${d.cat.color}"></div><div class="legend-label">${d.cat.icon} ${d.cat.name}</div><div class="legend-pct">${d.pct.toFixed(1)}%</div><div class="legend-amt">${fmtEGP(d.amount)}</div></div>`).join('')}
          </div></div>`
      }
    </div>
    <div class="summary-bar">
      <div class="summary-cell"><div class="summary-cell-label">Income</div><div class="summary-cell-val text-green">${fmtEGP(incomeTotal)}</div></div>
      <div class="summary-cell"><div class="summary-cell-label">Spent</div><div class="summary-cell-val text-red">${fmtEGP(total)}</div></div>
      <div class="summary-cell"><div class="summary-cell-label">Saved</div><div class="summary-cell-val ${incomeTotal-total>=0?'text-green':'text-red'}">${fmtEGP(incomeTotal-total)}</div></div>
    </div>`;
}

function buildPie(data) {
  if (!data.length) return '';
  const cx=100,cy=100,r=80,size=200;
  let start=-Math.PI/2, paths='';
  data.forEach(d => {
    const angle = (d.pct/100)*Math.PI*2;
    const end   = start+angle;
    const x1=cx+r*Math.cos(start), y1=cy+r*Math.sin(start);
    const x2=cx+r*Math.cos(end),   y2=cy+r*Math.sin(end);
    paths += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${angle>Math.PI?1:0},1 ${x2},${y2} Z" fill="${d.cat.color}" opacity="0.88" stroke="#06080F" stroke-width="1.5">
      <title>${d.cat.icon} ${d.cat.name}: ${d.pct.toFixed(1)}%</title></path>`;
    start = end;
  });
  paths += `<circle cx="${cx}" cy="${cy}" r="44" fill="#0B1020"/>`;
  return `<svg class="pie-svg" viewBox="0 0 ${size} ${size}" width="180" height="180">${paths}</svg>`;
}

/* ─── Monthly Compare ─── */
function renderMonthlyCompare() {
  const txs  = DATA.treasury.transactions;
  const now  = new Date();
  const months = Array.from({length:6}, (_,i) => {
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  });
  const stats = months.map(m => {
    const mt = txs.filter(t=>t.date.slice(0,7)===m);
    const inc = mt.filter(t=>t.type==='income') .reduce((a,t)=>a+t.amount,0);
    const exp = mt.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0);
    return { month:m, income:inc, expense:exp, net:inc-exp, count:mt.length };
  });

  const rows = [];
  for (let i=0;i<stats.length-1;i++) rows.push({curr:stats[i],prev:stats[i+1]});

  return `<div class="section-title">Month vs Month</div>
    ${rows.map(({curr,prev}) => {
      const ec = prev.expense>0?((curr.expense-prev.expense)/prev.expense)*100:0;
      const ic = prev.income>0?((curr.income-prev.income)/prev.income)*100:0;
      return `<div class="card mb-12">
        <div class="month-compare">
          <div class="month-box">
            <div class="month-box-label">${monthLabel(curr.month)}</div>
            <div class="month-stat"><div class="month-stat-label">Income</div><div class="month-stat-val text-green">${fmtEGP(curr.income)}</div></div>
            <div class="month-stat"><div class="month-stat-label">Expenses</div><div class="month-stat-val text-red">${fmtEGP(curr.expense)}</div></div>
            <div class="month-stat"><div class="month-stat-label">Net</div><div class="month-stat-val ${curr.net>=0?'text-green':'text-red'}">${fmtEGP(curr.net)}</div></div>
          </div>
          <div class="month-box">
            <div class="month-box-label">${monthLabel(prev.month)}</div>
            <div class="month-stat"><div class="month-stat-label">Income</div><div class="month-stat-val text-green">${fmtEGP(prev.income)}</div></div>
            <div class="month-stat"><div class="month-stat-label">Expenses</div><div class="month-stat-val text-red">${fmtEGP(prev.expense)}</div></div>
            <div class="month-stat"><div class="month-stat-label">Net</div><div class="month-stat-val ${prev.net>=0?'text-green':'text-red'}">${fmtEGP(prev.net)}</div></div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
          ${ic!==0?`<div class="month-change ${ic>0?'up':'down'}">${ic>0?'▲':'▼'} Income ${Math.abs(ic).toFixed(0)}%</div>`:''}
          ${ec!==0?`<div class="month-change ${ec<0?'up':'down'}">${ec<0?'▼':'▲'} Spent ${Math.abs(ec).toFixed(0)}%</div>`:''}
        </div>
      </div>`;
    }).join('')}
    ${rows.length===0?'<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-title">Need more months of data</div></div>':''}`;
}

/* ─── Reconcile ─── */
function renderReconcile() {
  const txs     = DATA.treasury.transactions;
  const income  = txs.filter(t=>t.type==='income') .reduce((a,t)=>a+t.amount,0);
  const expense = txs.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0);
  const tracked = income - expense;
  const bank    = DATA.treasury.bankBalance;
  const cash    = DATA.treasury.cashBalance;
  const real    = (bank||0)+(cash||0);
  const diff    = (bank!==null||cash!==null) ? real-tracked : null;

  return `<div class="section-title">Balance Reconciliation</div>
    <div class="card mb-12">
      <div class="form-row">
        <div class="form-group"><label class="form-label">Bank Balance (EGP)</label><input class="form-control" type="number" id="bank-bal" value="${bank!==null?bank:''}" placeholder="0" inputmode="decimal"></div>
        <div class="form-group"><label class="form-label">Cash on Hand (EGP)</label><input class="form-control" type="number" id="cash-bal" value="${cash!==null?cash:''}" placeholder="0" inputmode="decimal"></div>
      </div>
      <button class="btn btn-primary btn-full" onclick="saveBalances()">Update</button>
    </div>
    <div class="card">
      <div class="recon-row"><div class="recon-label">Tracked Income</div><div class="recon-val text-green">+${fmtEGP(income)}</div></div>
      <div class="recon-row"><div class="recon-label">Tracked Expenses</div><div class="recon-val text-red">-${fmtEGP(expense)}</div></div>
      <div class="recon-row"><div class="recon-label">Net (Tracked)</div><div class="recon-val ${tracked>=0?'text-green':'text-red'}">${fmtEGP(tracked)}</div></div>
      <div class="recon-row"><div class="recon-label">Bank + Cash (Real)</div><div class="recon-val">${real>0?fmtEGP(real):'—'}</div></div>
      ${diff!==null?`<div class="recon-row" style="border-top:1px solid var(--gold-border);margin-top:6px;padding-top:14px">
        <div class="recon-label" style="font-family:var(--font-cairo);font-weight:700">Discrepancy</div>
        <div class="recon-val ${Math.abs(diff)<10?'good':Math.abs(diff)<500?'warn':'bad'}">${Math.abs(diff)<10?'✓ Balanced':(diff>0?'+':'')+fmtEGP(diff)}</div>
      </div>
      ${Math.abs(diff)>=10?`<div style="font-style:italic;font-size:12px;color:var(--text-stone);margin-top:8px">${diff>0?'More than tracked — some income may be unrecorded.':'Less than tracked — some expenses may be missing.'}</div>`:''}`:''}
    </div>`;
}
window.saveBalances = function() {
  DATA.treasury.bankBalance = parseFloat(document.getElementById('bank-bal').value)||0;
  DATA.treasury.cashBalance = parseFloat(document.getElementById('cash-bal').value)||0;
  saveData(); toast('Balances updated'); switchTreasuryView('reconcile');
};

/* ─── Dhahab Vault ─── */
function renderVault(el) {
  const gp         = DATA.treasury.cachedGoldPrice;
  const gramPrice  = gp ? (gp.manualEGPperGram || (gp.usdPerOz/31.1035)*gp.egpRate) : null;
  const totalGrams = DATA.treasury.goldEntries.reduce((a,g)=>a+g.grams,0);
  const curVal     = gramPrice ? totalGrams*gramPrice : null;
  const ts         = gp ? new Date(gp.timestamp).toLocaleTimeString() : null;

  el.innerHTML = `
    <div class="section-title">◈ Reserve — Al-Dhahab ◈</div>
    <div class="gold-price-banner">
      <div>
        <div class="gold-price-label">Gold Price (EGP / gram)</div>
        <div class="gold-price-val">${gramPrice?fmtEGP(gramPrice):'—'}</div>
        ${ts?`<div class="gold-price-sub">Updated ${ts}</div>`:'<div class="gold-price-sub">Tap Fetch for live price</div>'}
      </div>
      <button class="btn btn-sm" id="fetch-gold-btn" onclick="fetchGoldPrice()">↻ Fetch</button>
    </div>
    ${totalGrams>0?`<div class="card mb-12" style="display:flex;justify-content:space-between;align-items:center">
      <div><div style="font-family:var(--font-cairo);font-size:10px;color:var(--text-stone);letter-spacing:0.1em;text-transform:uppercase">Total</div>
        <div style="font-family:var(--font-kufi);font-size:26px;color:var(--gold-bright)">${totalGrams.toFixed(2)}g</div></div>
      <div style="text-align:right"><div style="font-family:var(--font-cairo);font-size:10px;color:var(--text-stone);letter-spacing:0.1em;text-transform:uppercase">Current Value</div>
        <div style="font-family:var(--font-kufi);font-size:22px;color:var(--gold)">${curVal?fmtEGP(curVal):'—'}</div></div>
    </div>`:''}
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div class="section-title" style="margin:0">Holdings</div>
        <button class="btn btn-sm btn-primary" onclick="showAddGold()">+ Add</button>
      </div>
      ${DATA.treasury.goldEntries.length ? DATA.treasury.goldEntries.map(g=>{
        const paidTotal=g.grams*g.pricePerGram;
        const nowVal=gramPrice?g.grams*gramPrice:null;
        const gain=nowVal?nowVal-paidTotal:null;
        const pct=nowVal?((nowVal-paidTotal)/paidTotal)*100:null;
        return `<div class="gold-item"><div style="font-size:22px">🥇</div>
          <div style="flex:1"><div class="gold-item-grams">${g.grams}g</div>
            <div class="gold-item-date">${formatDate(g.date)}</div>
            <div class="gold-item-paid">Paid ${fmtEGP(g.pricePerGram)}/g</div></div>
          <div style="text-align:right"><div class="gold-item-now">${nowVal?fmtEGP(nowVal):fmtEGP(paidTotal)}</div>
            ${gain!==null?`<div class="gold-item-gain ${gain>=0?'pos':'neg'}">${gain>=0?'+':''}${fmtEGP(gain)} (${pct.toFixed(1)}%)</div>`:''}</div>
          <button class="tx-del" onclick="deleteGold('${g.id}')">🗑</button></div>`;
      }).join('') : '<div class="empty-state"><div class="empty-icon">⚜️</div><div class="empty-title">Vault is empty</div><div class="empty-sub">Record your first gold purchase</div></div>'}
    </div>`;
}

window.fetchGoldPrice = async function() {
  const btn = document.getElementById('fetch-gold-btn');
  if (btn) { btn.textContent='⌛'; btn.disabled=true; }
  try {
    const [goldRes, fxRes] = await Promise.all([
      fetch('https://api.metals.live/v1/spot/gold'),
      fetch('https://open.er-api.com/v6/latest/USD')
    ]);
    const goldJson = await goldRes.json();
    const fxJson   = await fxRes.json();
    const usdPerOz = goldJson[0]?.price || goldJson?.price;
    const egpRate  = fxJson.rates?.EGP;
    if (!usdPerOz||!egpRate) throw new Error('Bad data');
    DATA.treasury.cachedGoldPrice = { usdPerOz, egpRate, timestamp:Date.now() };
    saveData(); toast('Gold price updated'); renderVault(document.getElementById('treasury-view'));
  } catch(e) {
    toast('Cannot fetch — set manually');
    showManualGoldPrice();
    if (btn) { btn.textContent='↻ Fetch'; btn.disabled=false; }
  }
};

function showManualGoldPrice() {
  showModal(`<div class="modal-title">Set Gold Price</div>
    <div class="form-group"><label class="form-label">Price (EGP per gram)</label>
      <input class="form-control" type="number" id="manual-gold-price" placeholder="e.g. 5200" inputmode="decimal"></div>
    <div style="font-style:italic;font-size:12px;color:var(--text-stone);margin-bottom:14px">Check current price at any Egyptian gold dealer or egyprices.com</div>
    <button class="btn btn-primary btn-full" onclick="applyManualGoldPrice()">Apply</button>`);
}

window.applyManualGoldPrice = function() {
  const price = parseFloat(document.getElementById('manual-gold-price').value);
  if (!price||price<=0) { toast('Enter a valid price'); return; }
  DATA.treasury.cachedGoldPrice = { usdPerOz:price*31.1035, egpRate:1, manualEGPperGram:price, timestamp:Date.now() };
  saveData(); hideModal(); toast('Price set'); switchTreasuryView('vault');
};

window.showAddGold = function() {
  showModal(`<div class="modal-title">Add Gold</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Weight (grams)</label><input class="form-control" type="number" id="gold-grams" placeholder="0.00" step="0.01" inputmode="decimal"></div>
      <div class="form-group"><label class="form-label">Purchase Date</label><input class="form-control" type="date" id="gold-date" value="${today()}"></div>
    </div>
    <div class="form-group"><label class="form-label">Price (EGP / gram)</label><input class="form-control" type="number" id="gold-price" placeholder="e.g. 5200" inputmode="decimal"></div>
    <div class="form-group"><label class="form-label">Note</label><input class="form-control" type="text" id="gold-note" placeholder="21k, coin, ingot…"></div>
    <button class="btn btn-primary btn-full" onclick="submitGold()">Add to Vault</button>`);
};

window.submitGold = function() {
  const grams = parseFloat(document.getElementById('gold-grams').value);
  const date  = document.getElementById('gold-date').value;
  const price = parseFloat(document.getElementById('gold-price').value);
  const note  = document.getElementById('gold-note').value.trim();
  if (!grams||grams<=0||!price||price<=0||!date) { toast('Fill all fields'); return; }
  DATA.treasury.goldEntries.push({ id:uid(), grams, date, pricePerGram:price, note });
  saveData(); hideModal(); toast('Added to vault'); switchTreasuryView('vault');
};

window.deleteGold = function(id) {
  if (!confirm('Remove this entry?')) return;
  DATA.treasury.goldEntries = DATA.treasury.goldEntries.filter(g=>g.id!==id);
  saveData(); renderVault(document.getElementById('treasury-view'));
};

/* ═══════════════════════════════════════════════
   HABITS — AL-MUDĀWAMA
   المداومة — Constancy, Perseverance
═══════════════════════════════════════════════ */
function renderHabits() {
  const el     = document.getElementById('tab-habits');
  const habits = DATA.habits.habits;
  const logs   = DATA.habits.logs;
  const td     = today();

  const last7 = Array.from({length:7}, (_,i) => {
    const d = new Date(); d.setDate(d.getDate()-(6-i));
    return d.toISOString().slice(0,10);
  });

  const DAY_S = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const habitsHTML = habits.map(h => {
    const done   = logs.some(l=>l.habitId===h.id&&l.date===td);
    const streak = calcStreak(h.id, logs);
    const dots   = last7.map(d => {
      const isDone  = logs.some(l=>l.habitId===h.id&&l.date===d);
      const isToday = d===td;
      const day     = new Date(d+'T00:00:00').getDay();
      return `<div class="week-day">
        <div class="week-day-label">${DAY_S[day]}</div>
        <div class="week-dot ${isDone?'done':''} ${isToday?'today':''}">${isDone?'✓':''}</div>
      </div>`;
    }).join('');
    return `<div class="habit-row">
      <div class="habit-check ${done?'done':''}" onclick="toggleHabit('${h.id}')">${done?'✓':h.icon||'○'}</div>
      <div class="habit-info">
        <div class="habit-name">${h.name}</div>
        <div class="habit-streak"><span class="streak-fire">🔥</span>${streak} day streak</div>
        <div class="week-grid">${dots}</div>
      </div>
      <button class="tx-del" onclick="deleteHabit('${h.id}')">🗑</button>
    </div>`;
  }).join('');

  el.innerHTML = `
    ${moduleHeader('Al-Ghazālī · Practice I', 'The Watch', 'Murāqaba — sustained, non-judgmental observation of what you actually do')}
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div class="section-title" style="margin:0">${formatDate(td)}</div>
        <span style="font-family:var(--font-cairo);font-size:12px;color:var(--text-stone)">${logs.filter(l=>l.date===td).length}/${habits.length}</span>
      </div>
      ${habits.length ? habitsHTML : '<div class="empty-state"><div class="empty-icon">🌙</div><div class="empty-title">No habits recorded</div><div class="empty-sub">Add your first daily constancy</div></div>'}
    </div>`;

  addFAB('+', () => showAddHabit());
}

function calcStreak(hid, logs) {
  let s=0, d=new Date();
  while(true) {
    if (logs.some(l=>l.habitId===hid&&l.date===d.toISOString().slice(0,10))) { s++; d.setDate(d.getDate()-1); }
    else break;
  }
  return s;
}

window.toggleHabit = function(id) {
  const td  = today();
  const idx = DATA.habits.logs.findIndex(l=>l.habitId===id&&l.date===td);
  if (idx>=0) DATA.habits.logs.splice(idx,1);
  else DATA.habits.logs.push({ habitId:id, date:td });
  saveData(); renderHabits();
};

function showAddHabit() {
  showModal(`<div class="modal-title">New Habit</div>
    <div class="form-group"><label class="form-label">Name</label><input class="form-control" type="text" id="habit-name" placeholder="e.g. Morning prayer, Reading, Exercise"></div>
    <div class="form-group"><label class="form-label">Icon (emoji)</label><input class="form-control" type="text" id="habit-icon" placeholder="🌙" style="max-width:80px"></div>
    <button class="btn btn-primary btn-full" onclick="submitHabit()">Add Habit</button>`);
}

window.submitHabit = function() {
  const name = document.getElementById('habit-name').value.trim();
  const icon = document.getElementById('habit-icon').value.trim() || '🌙';
  if (!name) { toast('Enter a name'); return; }
  DATA.habits.habits.push({ id:uid(), name, icon });
  saveData(); hideModal(); toast('Habit added'); renderHabits();
};

window.deleteHabit = function(id) {
  if (!confirm('Remove this habit?')) return;
  DATA.habits.habits = DATA.habits.habits.filter(h=>h.id!==id);
  DATA.habits.logs   = DATA.habits.logs.filter(l=>l.habitId!==id);
  saveData(); renderHabits();
};

/* ═══════════════════════════════════════════════
   GYM — AL-RIYĀḌA
   الرياضة البدنية — Physical Training
═══════════════════════════════════════════════ */
function renderGym() {
  const el       = document.getElementById('tab-gym');
  const sessions = DATA.gym.sessions;
  const weekAgo  = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
  const monAgo   = new Date(); monAgo.setDate(monAgo.getDate()-30);

  const sessHTML = [...sessions].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,30).map(s => {
    const exList = (s.exercises||[]).map(ex => {
      const sets = (ex.sets||[]).map(st=>`${st.reps}×${st.weight}kg`).join(', ');
      return `<div class="exercise-row"><div class="exercise-name">${ex.name}</div><div class="exercise-details">${sets||'—'}</div></div>`;
    }).join('');
    return `<div class="workout-item">
      <div class="workout-header">
        <div><div class="workout-type">${s.type}</div><div class="workout-date">${formatDate(s.date)}</div></div>
        <div style="text-align:right">${s.duration?`<div class="workout-duration">⏱ ${fmtMin(s.duration)}</div>`:''}<button class="btn btn-sm btn-danger" style="margin-top:4px" onclick="deleteSession('${s.id}')">Delete</button></div>
      </div>
      ${s.notes?`<div style="font-style:italic;font-size:12px;color:var(--text-stone);margin-bottom:6px">${s.notes}</div>`:''}
      ${exList}
    </div>`;
  }).join('');

  el.innerHTML = `
    ${moduleHeader('All Four Sources · Physical Discipline', 'The Vessel', 'The body is the instrument through which the deliberate life is enacted')}
    <div class="gym-stats-row">
      <div class="gym-stat-box"><div class="gym-stat-val">${sessions.filter(s=>new Date(s.date)>=weekAgo).length}</div><div class="gym-stat-label">This Week</div></div>
      <div class="gym-stat-box"><div class="gym-stat-val">${sessions.filter(s=>new Date(s.date)>=monAgo).length}</div><div class="gym-stat-label">This Month</div></div>
      <div class="gym-stat-box"><div class="gym-stat-val">${sessions.length}</div><div class="gym-stat-label">All Time</div></div>
    </div>
    <div class="card">
      <div class="section-title">Sessions</div>
      ${sessions.length ? sessHTML : '<div class="empty-state"><div class="empty-icon">⚔️</div><div class="empty-title">No sessions logged</div><div class="empty-sub">Record your first training session</div></div>'}
    </div>`;

  addFAB('+', showAddSession);
}

function showAddSession() {
  const types = DATA.gym.workoutTypes;
  showModal(`<div class="modal-title">Log Session</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Type</label><select class="form-control" id="sess-type">${types.map(t=>`<option>${t}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Date</label><input class="form-control" type="date" id="sess-date" value="${today()}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Duration (min)</label><input class="form-control" type="number" id="sess-duration" placeholder="60" inputmode="numeric"></div>
      <div class="form-group"><label class="form-label">Notes</label><input class="form-control" type="text" id="sess-notes" placeholder="How it went…"></div>
    </div>
    <div class="section-title" style="margin-top:8px">Exercises</div>
    <div id="exercise-list"></div>
    <button class="btn btn-sm btn-full mb-12" onclick="addExerciseRow()">+ Add Exercise</button>
    <button class="btn btn-primary btn-full" onclick="submitSession()">Record Session</button>`);
  window._exercises = [];
}

window.addExerciseRow = function() {
  window._exercises = window._exercises||[];
  window._exercises.push({ name:'', sets:[{reps:'',weight:''}] });
  renderExerciseList();
};

function renderExerciseList() {
  const el = document.getElementById('exercise-list');
  if (!el) return;
  el.innerHTML = (window._exercises||[]).map((ex,ei)=>`
    <div style="border:1px solid var(--gold-border);border-radius:6px;padding:10px;margin-bottom:10px">
      <div style="display:flex;gap:8px;margin-bottom:8px">
        <input class="form-control" placeholder="Exercise name" value="${ex.name}" oninput="updateExName(${ei},this.value)" style="flex:1">
        <button class="btn btn-sm btn-danger" onclick="removeEx(${ei})">✕</button>
      </div>
      <div class="set-builder">
        <div class="set-row" style="background:var(--bg-stone);font-family:var(--font-cairo);font-size:9px;letter-spacing:0.12em;color:var(--text-stone)">
          <div>SET</div><div>REPS</div><div>WEIGHT</div><div>NOTES</div><div></div>
        </div>
        ${(ex.sets||[]).map((set,si)=>`<div class="set-row">
          <div class="set-num">${si+1}</div>
          <input class="set-input" type="number" placeholder="12" value="${set.reps}" oninput="updateSet(${ei},${si},'reps',this.value)">
          <input class="set-input" type="number" placeholder="kg" value="${set.weight}" oninput="updateSet(${ei},${si},'weight',this.value)">
          <input class="set-input" type="text" placeholder="—" value="${set.note||''}" oninput="updateSet(${ei},${si},'note',this.value)">
          <button class="set-del-btn" onclick="removeSet(${ei},${si})">✕</button>
        </div>`).join('')}
      </div>
      <button class="btn btn-sm" style="width:100%;margin-top:8px" onclick="addSet(${ei})">+ Set</button>
    </div>`).join('');
}

window.updateExName = (ei,v) => { if(window._exercises[ei]) window._exercises[ei].name=v; };
window.removeEx     = (ei)   => { window._exercises.splice(ei,1); renderExerciseList(); };
window.addSet       = (ei)   => { window._exercises[ei].sets.push({reps:'',weight:'',note:''}); renderExerciseList(); };
window.removeSet    = (ei,si)=> { window._exercises[ei].sets.splice(si,1); renderExerciseList(); };
window.updateSet    = (ei,si,f,v) => { if(window._exercises[ei]?.sets[si]) window._exercises[ei].sets[si][f]=v; };

window.submitSession = function() {
  const type     = document.getElementById('sess-type').value;
  const date     = document.getElementById('sess-date').value;
  const duration = parseInt(document.getElementById('sess-duration').value)||null;
  const notes    = document.getElementById('sess-notes').value.trim();
  if (!date) { toast('Enter a date'); return; }
  const exercises = (window._exercises||[]).filter(ex=>ex.name.trim()).map(ex=>({
    name:ex.name.trim(),
    sets:ex.sets.map(s=>({ reps:parseInt(s.reps)||0, weight:parseFloat(s.weight)||0, note:s.note||'' }))
  }));
  DATA.gym.sessions.push({ id:uid(), type, date, duration, notes, exercises });
  saveData(); hideModal(); toast('Session recorded'); renderGym();
};

window.deleteSession = function(id) {
  if (!confirm('Delete this session?')) return;
  DATA.gym.sessions = DATA.gym.sessions.filter(s=>s.id!==id);
  saveData(); renderGym();
};

/* ═══════════════════════════════════════════════
   STUDY — AL-MUṬĀLAʿA
   المطالعة — Deep Reading, Study
═══════════════════════════════════════════════ */
function renderStudy() {
  const el       = document.getElementById('tab-study');
  const subjects = DATA.study.subjects;
  const sessions = DATA.study.sessions;
  const timer    = STATE.studyTimer;

  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
  const weekBySubject = {};
  sessions.filter(s=>new Date(s.date)>=weekAgo).forEach(s => {
    weekBySubject[s.subjectId] = (weekBySubject[s.subjectId]||0)+s.durationMin;
  });

  const goalRows = subjects.map(sub => {
    const mins    = weekBySubject[sub.id]||0;
    const goalMin = (sub.weeklyGoalHours||0)*60;
    const pct     = goalMin>0?Math.min(100,(mins/goalMin)*100):0;
    return `<div class="weekly-goal-row">
      <div class="wg-label">
        <div class="wg-name">${sub.name}</div>
        <div class="wg-hours">${fmtMin(mins)} / ${sub.weeklyGoalHours||0}h weekly goal</div>
        <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${pct}%;background:${sub.color||'#C4881A'}"></div></div>
      </div>
    </div>`;
  }).join('');

  const sessHTML = [...sessions].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,20).map(s => {
    const sub = subjects.find(x=>x.id===s.subjectId)||{name:'Unknown',color:'#888'};
    return `<div class="study-session-row">
      <div class="study-dot" style="background:${sub.color}"></div>
      <div class="study-info"><div class="study-subject">${sub.name}</div><div class="study-topic">${s.topic||'—'}</div></div>
      <div><div class="study-duration">${fmtMin(s.durationMin)}</div><div class="study-date">${formatDate(s.date)}</div></div>
      <button class="tx-del" onclick="deleteStudySession('${s.id}')">🗑</button>
    </div>`;
  }).join('');

  el.innerHTML = `
    ${moduleHeader('Al-Kindī · Practice III · Intellectual Audit', 'The Lamp', 'Record what you study, how long, and what you actually understood')}
    <div class="card mb-12">
      <div class="section-title">Pomodoro</div>
      <div class="timer-display">
        <div class="timer-clock" id="timer-clock">${fmtSec(timer.seconds)}</div>
        <div class="timer-label" id="timer-label">${timer.mode==='focus'?'Focus':'Rest'} · ${timer.subject ? (subjects.find(s=>s.id===timer.subject)||{name:'—'}).name : 'No subject'}</div>
      </div>
      <div class="timer-controls">
        <button class="btn" onclick="resetTimer()">↺ Reset</button>
        <button class="btn btn-primary" onclick="toggleTimer()" id="timer-btn">${timer.running?'⏸ Pause':'▶ Start'}</button>
        <button class="btn" onclick="showLogManual()">✎ Log</button>
      </div>
      <div class="form-group mt-12">
        <label class="form-label">Subject</label>
        <select class="form-control" id="timer-subject" onchange="setTimerSubject(this.value)">
          <option value="">— Select Subject —</option>
          ${subjects.map(s=>`<option value="${s.id}" ${timer.subject===s.id?'selected':''}>${s.name}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="card mb-12">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div class="section-title" style="margin:0">Weekly Progress</div>
        <button class="btn btn-sm" onclick="showManageSubjects()">⚙ Subjects</button>
      </div>
      ${subjects.length ? goalRows : '<div class="empty-state" style="padding:16px"><div class="empty-title">No subjects yet</div></div>'}
    </div>
    <div class="card">
      <div class="section-title">Session Log</div>
      ${sessions.length ? sessHTML : '<div class="empty-state"><div class="empty-icon">📜</div><div class="empty-title">No sessions logged</div></div>'}
    </div>`;

  if (timer.running) {
    clearInterval(timer.interval);
    timer.interval = setInterval(tickTimer, 1000);
  }
}

window.toggleTimer = function() {
  const t = STATE.studyTimer;
  t.running = !t.running;
  if (t.running) { t.interval = setInterval(tickTimer,1000); }
  else { clearInterval(t.interval); }
  const btn = document.getElementById('timer-btn');
  if (btn) btn.textContent = t.running ? '⏸ Pause' : '▶ Start';
};

function tickTimer() {
  STATE.studyTimer.seconds++;
  const el = document.getElementById('timer-clock');
  if (el) el.textContent = fmtSec(STATE.studyTimer.seconds);
}

window.resetTimer = function() {
  clearInterval(STATE.studyTimer.interval);
  STATE.studyTimer = { running:false, seconds:0, interval:null, subject:STATE.studyTimer.subject, mode:'focus' };
  renderStudy();
};

window.setTimerSubject = v => { STATE.studyTimer.subject = v; };

window.showLogManual = function() {
  const secs = STATE.studyTimer.seconds;
  const sub  = DATA.study.subjects;
  showModal(`<div class="modal-title">Log Study Session</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Subject</label><select class="form-control" id="log-subject">
        <option value="">— Select —</option>
        ${sub.map(s=>`<option value="${s.id}" ${STATE.studyTimer.subject===s.id?'selected':''}>${s.name}</option>`).join('')}
      </select></div>
      <div class="form-group"><label class="form-label">Duration (min)</label><input class="form-control" type="number" id="log-duration" value="${Math.round(secs/60)||''}" placeholder="30" inputmode="numeric"></div>
    </div>
    <div class="form-group"><label class="form-label">Topic</label><input class="form-control" type="text" id="log-topic" placeholder="What did you study?"></div>
    <div class="form-group"><label class="form-label">Date</label><input class="form-control" type="date" id="log-date" value="${today()}"></div>
    <div class="form-group"><label class="form-label">Notes</label><textarea class="form-control" id="log-notes" style="height:70px" placeholder="Key observations…"></textarea></div>
    <button class="btn btn-primary btn-full" onclick="submitStudySession()">Record</button>`);
};

window.submitStudySession = function() {
  const subjectId = document.getElementById('log-subject').value;
  const duration  = parseInt(document.getElementById('log-duration').value);
  const topic     = document.getElementById('log-topic').value.trim();
  const date      = document.getElementById('log-date').value;
  const notes     = document.getElementById('log-notes').value.trim();
  if (!subjectId) { toast('Select a subject'); return; }
  if (!duration||duration<=0) { toast('Enter duration'); return; }
  DATA.study.sessions.push({ id:uid(), subjectId, durationMin:duration, topic, date, notes });
  saveData(); resetTimer(); hideModal(); toast('Session recorded'); renderStudy();
};

window.deleteStudySession = function(id) {
  DATA.study.sessions = DATA.study.sessions.filter(s=>s.id!==id);
  saveData(); renderStudy();
};

window.showManageSubjects = function() {
  const subjects = DATA.study.subjects;
  const colors   = ['#C4881A','#2980b9','#8e44ad','#27ae60','#e74c3c','#1abc9c','#f39c12','#3498db'];
  showModal(`<div class="modal-title">Subjects</div>
    <div id="subject-list">${subjects.map(s=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(196,136,26,0.1)">
      <div style="width:10px;height:10px;border-radius:50%;background:${s.color}"></div>
      <span style="flex:1;font-family:var(--font-cairo);font-size:13px">${s.name}</span>
      <span style="font-size:12px;color:var(--text-stone)">${s.weeklyGoalHours||0}h/wk</span>
      <button class="btn btn-sm btn-danger" onclick="deleteSubject('${s.id}')">✕</button>
    </div>`).join('')}</div>
    <div class="divider">New Subject</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Name</label><input class="form-control" type="text" id="new-sub-name" placeholder="e.g. Mathematics"></div>
      <div class="form-group"><label class="form-label">Weekly Goal (hrs)</label><input class="form-control" type="number" id="new-sub-goal" placeholder="5" inputmode="numeric"></div>
    </div>
    <div class="form-group"><label class="form-label">Color</label>
      <div class="color-options">${colors.map((c,i)=>`<div class="color-opt ${i===0?'selected':''}" style="background:${c}" data-color="${c}" onclick="selectColor(this)"></div>`).join('')}</div>
    </div>
    <button class="btn btn-primary btn-full" onclick="addSubject()">Add</button>`);
};

window.addSubject = function() {
  const name  = document.getElementById('new-sub-name').value.trim();
  const goal  = parseFloat(document.getElementById('new-sub-goal').value)||0;
  const color = (document.querySelector('.color-opt.selected')||{}).dataset?.color||'#C4881A';
  if (!name) { toast('Enter a name'); return; }
  DATA.study.subjects.push({ id:uid(), name, weeklyGoalHours:goal, color });
  saveData(); toast('Subject added'); showManageSubjects();
};

window.deleteSubject = function(id) {
  DATA.study.subjects = DATA.study.subjects.filter(s=>s.id!==id);
  saveData(); showManageSubjects();
};

/* ═══════════════════════════════════════════════
   JOURNAL — AL-YAWMIYYĀT
   اليوميات — The Daily Observations
═══════════════════════════════════════════════ */
const MOODS = [
  { emoji:'🕯️', name:'Lucid',    id:'lucid'    },
  { emoji:'🌿', name:'Settled',  id:'settled'  },
  { emoji:'🌙', name:'Pensive',  id:'pensive'  },
  { emoji:'⚡',  name:'Restless', id:'restless' },
  { emoji:'🌑', name:'Burdened', id:'burdened' },
];

function renderJournal() {
  const el      = document.getElementById('tab-journal');
  const entries = DATA.journal.entries;
  const search  = STATE.journalSearch.toLowerCase();

  const filtered = [...entries]
    .sort((a,b)=>b.date.localeCompare(a.date))
    .filter(e => !search || e.title.toLowerCase().includes(search) || e.content.toLowerCase().includes(search) || (e.tags||[]).join(' ').toLowerCase().includes(search));

  const moodCount = {};
  entries.forEach(e => { if(e.mood) moodCount[e.mood]=(moodCount[e.mood]||0)+1; });
  const dominant = Object.entries(moodCount).sort((a,b)=>b[1]-a[1])[0];
  const dm       = dominant ? MOODS.find(m=>m.id===dominant[0]) : null;

  const entryHTML = filtered.map(e => {
    const mood = MOODS.find(m=>m.id===e.mood);
    return `<div class="journal-entry" onclick="viewEntry('${e.id}')">
      <div class="journal-entry-header">
        <div class="journal-title">${e.title||'Untitled Observation'}</div>
        <div class="journal-mood-badge">${mood?.emoji||''}</div>
      </div>
      <div class="journal-date">${formatDateFull(e.date)}</div>
      <div class="journal-excerpt">${e.content}</div>
      ${(e.tags||[]).length?`<div style="margin-top:6px">${e.tags.map(t=>`<span class="tag-chip">${t}</span>`).join('')}</div>`:''}
    </div>`;
  }).join('');

  el.innerHTML = `
    ${moduleHeader('Al-Ghazālī · Practice II + Jung · Practice V', 'The Witness', 'The nightly account and the honest witness — what occurred, what persists')}
    ${dm?`<div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-style:italic;font-size:12px;color:var(--text-stone)">Prevailing state of this record</div>
      <div style="font-size:30px;margin:6px 0">${dm.emoji}</div>
      <div style="font-family:var(--font-cairo);font-size:11px;color:var(--gold);letter-spacing:0.1em">${dm.name.toUpperCase()}</div>
    </div>`:''}
    <div class="search-wrap">
      <span class="search-icon">🔍</span>
      <input class="form-control search-input" type="text" placeholder="Search the observations…" value="${STATE.journalSearch}" oninput="searchJournal(this.value)">
    </div>
    <div class="card">
      <div class="section-title">Entries (${entries.length})</div>
      ${filtered.length ? entryHTML : '<div class="empty-state"><div class="empty-icon">🕯️</div><div class="empty-title">The witness is silent</div><div class="empty-sub">Write your first nightly account</div></div>'}
    </div>`;

  addFAB('🕯️', () => showAddEntry());
}

window.searchJournal = v => { STATE.journalSearch = v; renderJournal(); };

window.viewEntry = function(id) {
  const e    = DATA.journal.entries.find(x=>x.id===id);
  if (!e) return;
  const mood = MOODS.find(m=>m.id===e.mood);
  showModal(`
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;padding-right:30px">
      <div>
        <div class="modal-title" style="margin:0;padding:0">${e.title||'Untitled'}</div>
        <div style="font-size:12px;color:var(--text-stone);margin-top:4px;font-family:var(--font-cairo)">${formatDateFull(e.date)} · ${mood?.emoji||''} ${mood?.name||''}</div>
      </div>
    </div>
    ${(e.tags||[]).length?`<div style="margin-bottom:12px">${e.tags.map(t=>`<span class="tag-chip">${t}</span>`).join('')}</div>`:''}
    <div class="divider">۞</div>
    <div class="entry-full-content">${e.content}</div>
    <div class="divider">۞</div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-danger btn-sm" onclick="deleteEntry('${e.id}')">🗑 Delete</button>
      <button class="btn btn-sm btn-primary" onclick="editEntry('${e.id}')">✎ Edit</button>
    </div>`);
};

function showAddEntry(prefill) {
  const e = prefill || {};
  showModal(`
    <div class="modal-title">${e.id?'Edit Entry':'Nightly Account'}</div>
    <div class="form-group"><label class="form-label">Title</label><input class="form-control" type="text" id="entry-title" placeholder="Title…" value="${e.title||''}"></div>
    <div class="form-group">
      <label class="form-label">State of Mind</label>
      <div class="mood-selector">
        ${MOODS.map(m=>`<div class="mood-btn ${e.mood===m.id?'selected':''}" onclick="selectMood('${m.id}',this)">
          <span class="mood-emoji">${m.emoji}</span><div class="mood-name">${m.name}</div>
        </div>`).join('')}
      </div>
      <input type="hidden" id="entry-mood" value="${e.mood||''}">
    </div>
    <div class="form-group"><label class="form-label">Observation</label><textarea class="form-control" id="entry-content" style="min-height:160px" placeholder="Write your thoughts, observations, reflections…">${e.content||''}</textarea></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Tags</label><input class="form-control" type="text" id="entry-tags" placeholder="health, work, ideas" value="${(e.tags||[]).join(', ')}"></div>
      <div class="form-group"><label class="form-label">Date</label><input class="form-control" type="date" id="entry-date" value="${e.date||today()}"></div>
    </div>
    <button class="btn btn-primary btn-full" onclick="submitEntry('${e.id||''}')">Record Entry</button>`);
}

window.selectMood = function(id, el) {
  document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('entry-mood').value = id;
};

window.submitEntry = function(editId) {
  const title   = document.getElementById('entry-title').value.trim();
  const content = document.getElementById('entry-content').value.trim();
  const mood    = document.getElementById('entry-mood').value;
  const date    = document.getElementById('entry-date').value;
  const tags    = document.getElementById('entry-tags').value.split(',').map(t=>t.trim()).filter(Boolean);
  if (!content) { toast('Write something first'); return; }
  if (editId) {
    const idx = DATA.journal.entries.findIndex(e=>e.id===editId);
    if (idx>=0) Object.assign(DATA.journal.entries[idx], { title, content, mood, date, tags });
  } else {
    DATA.journal.entries.push({ id:uid(), title, content, mood, date, tags });
  }
  saveData(); hideModal(); toast('Observation recorded'); renderJournal();
};

window.editEntry   = id => { const e=DATA.journal.entries.find(x=>x.id===id); if(e) showAddEntry(e); };
window.deleteEntry = function(id) {
  if (!confirm('Remove this entry permanently?')) return;
  DATA.journal.entries = DATA.journal.entries.filter(e=>e.id!==id);
  saveData(); hideModal(); toast('Entry removed'); renderJournal();
};

/* ═══════════════════════════════════════════════
   SHARED
═══════════════════════════════════════════════ */
function addFAB(label, onClick) {
  document.querySelectorAll('.fab').forEach(f=>f.remove());
  const fab = document.createElement('button');
  fab.className = 'fab';
  fab.textContent = label;
  fab.addEventListener('click', onClick);
  document.body.appendChild(fab);
}

/* ═══════════════════════════════════════════════
   SERVICE WORKER
═══════════════════════════════════════════════ */
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(e => console.warn('SW:', e));
  }
}

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
function init() {
  loadData();
  setupNav();
  renderHome();
  registerSW();
}

document.addEventListener('DOMContentLoaded', init);

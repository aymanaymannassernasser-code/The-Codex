/* ════════════════════════════════════════════════
   VIGIL — The Inner Castle
   Five Counselors. One System.
════════════════════════════════════════════════ */
'use strict';

/* ══ HIJRI CALENDAR ENGINE ═══════════════════════
   Tabular Hijri (Kuwaiti algorithm) ±1 day.
   User offset corrects for local moon-sighting authority.
═════════════════════════════════════════════════*/
function gregorianToHijri(gYear, gMonth, gDay) {
  const a   = Math.floor((14 - gMonth) / 12);
  const y   = gYear + 4800 - a;
  const m   = gMonth + 12 * a - 3;
  const jdn = gDay + Math.floor((153*m+2)/5) + 365*y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045;
  const l   = jdn - 1948440 + 10632;
  const n   = Math.floor((l-1)/10631);
  const l2  = l - 10631*n + 354;
  const j   = Math.floor((10985-l2)/5316)*Math.floor((50*l2)/17719) + Math.floor(l2/5670)*Math.floor((43*l2)/15238);
  const l3  = l2 - Math.floor((30-j)/15)*Math.floor((17719*j)/50) - Math.floor(j/16)*Math.floor((15238*j)/43) + 29;
  return { year: 30*n+j-30, month: Math.floor((24*l3)/709), day: l3 - Math.floor((709*Math.floor((24*l3)/709))/24) };
}
const HIJRI_MONTHS = ['Muḥarram','Ṣafar','Rabīʿ I','Rabīʿ II','Jumādā I','Jumādā II','Rajab','Shaʿbān','Ramaḍān','Shawwāl','Dhū al-Qaʿdah','Dhū al-Ḥijjah'];

function hijriString(dateStr, offsetDays) {
  const [y,m,d] = (dateStr||today()).split('-').map(Number);
  const base = new Date(y, m-1, d);
  base.setDate(base.getDate() + (offsetDays||0));
  const h = gregorianToHijri(base.getFullYear(), base.getMonth()+1, base.getDate());
  return `${h.day} ${HIJRI_MONTHS[h.month-1]}, ${h.year} AH`;
}
function todayHijri() { return hijriString(today(), CONFIG.hijriOffset||0); }

/* ══ QUOTES ══════════════════════════════════════ */
const QUOTES = [
  { text:"The duty of the man who investigates the writings of scientists is to make himself an enemy of all that he reads, and attack it from every side.",author:"Ibn al-Haytham",era:"Kitāb al-Manāẓir, Preface · Basra, c. 1011 CE" },
  { text:"The moving finger writes; and, having writ, moves on — nor all thy piety nor wit shall lure it back to cancel half a line, nor all thy tears wash out a word of it.",author:"Omar Khayyām",era:"Rubāʿiyyāt, LXXI · trans. FitzGerald · Nishapur, c. 1100 CE" },
  { text:"The past resembles the future more than one drop of water resembles another.",author:"Ibn Khaldūn",era:"Muqaddima, Book One · Tunis, 1377 CE" },
  { text:"The knowledge of anything is not acquired or complete unless it is known by its causes.",author:"Ibn Sina",era:"Kitāb al-Shifāʾ, Logic · Hamadan, c. 1020 CE" },
  { text:"He who does not know himself does not know anything else.",author:"Al-Kindī",era:"Fī al-Falsafat al-Ūlā · Baghdad, c. 850 CE" },
  { text:"I have never met a wise man who regretted that he had been silent.",author:"Al-Jāḥiẓ",era:"Al-Bayān wa al-Tabyīn · Basra, c. 845 CE" },
  { text:"Social organization is necessary to the human species. Without it, the existence of human beings would be incomplete.",author:"Ibn Khaldūn",era:"Muqaddima · Tunis, 1377 CE" },
  { text:"Act swiftly on the hour that is given to you, for every hour that passes is irrecoverable.",author:"Ibn ʿAṭāʾ Allāh al-Iskandarī",era:"Al-Ḥikam · Alexandria, c. 1280 CE · paraphrase" },
  { text:"India is a different world. We ought to study it without prejudice, if we wish to understand it.",author:"Al-Bīrūnī",era:"Taḥqīq mā lil-Hind, Preface · Ghazni, c. 1030 CE" },
  { text:"Know yourself in talents and capacity, in judgment and inclination. You cannot master yourself unless you know yourself.",author:"Baltasar Gracián",era:"Oráculo Manual, Maxim I · Zaragoza, 1647" },
  { text:"Never act from passion. If you do so, set yourself to oppose your first impulse and you will correct your course in time.",author:"Baltasar Gracián",era:"Oráculo Manual, Maxim 8 · Zaragoza, 1647" },
  { text:"Never spend your full capacity. The wise man does not display all he has, for tomorrow he may need it.",author:"Baltasar Gracián",era:"Oráculo Manual, Maxim 130 · Zaragoza, 1647" },
  { text:"The end of all activity is the end of inactivity; but the end of knowledge is perpetual wonder.",author:"Al-Kindī",era:"Attributed in biographical sources · Baghdad, c. 870 CE" },
  { text:"I was living in a constant state of tension; often I felt as if gigantic blocks of stone were tumbling down upon me. Yet there was a demonic strength in me.",author:"C.G. Jung",era:"Memories, Dreams, Reflections · Zurich, 1962" },
  { text:"The most terrifying thing is to accept oneself completely.",author:"C.G. Jung",era:"Attributed · Collected Works, Vol. 12" },
  { text:"Whoever wishes to investigate must consider the following: first, the physical constitution in all its complexity.",author:"Ibn Sina",era:"Al-Qānūn fī al-Ṭibb, Book One · c. 1025 CE" },
];

/* ══ DEFAULT DATA ════════════════════════════════ */
const DEFAULT_DATA = {
  treasury: {
    transactions: [], categories: [
      {id:'cat1',name:'Food & Drink',icon:'🥘',color:'#c0392b'},
      {id:'cat2',name:'Dwelling',    icon:'🏠',color:'#8e44ad'},
      {id:'cat3',name:'Transport',   icon:'🚗',color:'#2980b9'},
      {id:'cat4',name:'Recreation',  icon:'🎵',color:'#f39c12'},
      {id:'cat5',name:'Instruments', icon:'⚗️',color:'#27ae60'},
      {id:'cat6',name:'Medicine',    icon:'🌿',color:'#e74c3c'},
      {id:'cat7',name:'Salary',      icon:'📋',color:'#f1c40f'},
      {id:'cat8',name:'Trade',       icon:'⚖️',color:'#1abc9c'},
      {id:'cat9',name:'Other',       icon:'📦',color:'#7f8c8d'},
    ],
    bankBalance: null, cashBalance: null, goldEntries: [],
    cachedGoldPrice: null, cachedGoldTs: null, cachedEgpRate: null,
    budgets: [], goals: [],
  },
  habits: { habits: [], logs: [] },
  gym: {
    sessions: [], templates: [],
    workoutTypes: ['Push','Pull','Legs','Cardio','Upper Body','Lower Body','Full Body','Rest'],
    bodyLogs: [],
  },
  study: { subjects: [], sessions: [], books: [], spacedItems: [] },
  journal: { entries: [] },
};

/* ══ CONFIG (persisted separately) ══════════════ */
let CONFIG = {
  hijriOffset: -1,
  notificationsEnabled: false,
  habitReminderTimes: {},
  studyReminderEnabled: false,
  dailyBriefingEnabled: false,
  dailyBriefingTime: '07:00',
  pomodoroFocus: 25,
  pomodoroShortBreak: 5,
  pomodoroLongBreak: 15,
  restTimerDuration: 90,
  wakeLockEnabled: true,
};

/* ══ STATE ═══════════════════════════════════════ */
let STATE = {
  activeTab: 'home',
  treasuryView: 'log', txFilter: 'all',
  studyTimer: { running: false, seconds: 0, interval: null, subject: '', mode: 'focus', cycle: 0, totalCycles: 4 },
  restTimer: { running: false, seconds: 0, interval: null, exercise: '' },
  journalSearch: '', journalFilter: 'all',
  habitView: 'today',
  gymView: 'log',
  studyView: 'timer',
  whisperView: 'entries',
  coinView: 'log',
  wakeLock: null,
  deferredInstall: null,
};

let DATA = {};

/* ══ PERSISTENCE ═════════════════════════════════ */
function loadData() {
  try {
    const raw = localStorage.getItem('vigil_v2');
    DATA = raw ? deepMerge(DEFAULT_DATA, JSON.parse(raw)) : JSON.parse(JSON.stringify(DEFAULT_DATA));
  } catch(e) { DATA = JSON.parse(JSON.stringify(DEFAULT_DATA)); }
  try {
    const rc = localStorage.getItem('vigil_cfg');
    if (rc) CONFIG = Object.assign({}, CONFIG, JSON.parse(rc));
  } catch(e) {}
}
function saveData()   { try { localStorage.setItem('vigil_v2', JSON.stringify(DATA)); } catch(e) { toast('⚠ Storage limit reached'); } }
function saveConfig() { try { localStorage.setItem('vigil_cfg', JSON.stringify(CONFIG)); } catch(e) {} }

function deepMerge(target, source) {
  const out = Object.assign({}, target);
  for (const k of Object.keys(source)) {
    if (Array.isArray(source[k])) out[k] = source[k];
    else if (source[k] && typeof source[k] === 'object') out[k] = deepMerge(target[k]||{}, source[k]);
    else out[k] = source[k];
  }
  return out;
}

/* ══ UTILS ═══════════════════════════════════════ */
function uid()   { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function today() { return new Date().toISOString().slice(0,10); }
function pad(n)  { return String(n).padStart(2,'0'); }
function monthKey(d) { return d.slice(0,7); }
function monthLabel(yyyymm) { const [y,m]=yyyymm.split('-'); return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1]+' '+y; }
function formatDate(d) { return new Date(d+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'2-digit'}); }
function formatDateFull(d) { return new Date(d+'T00:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}); }
function fmtEGP(n) { if(n==null||isNaN(n))return'—'; return'EGP '+Math.abs(n).toLocaleString('en-EG',{minimumFractionDigits:0,maximumFractionDigits:0}); }
function fmtMin(m) { const h=Math.floor(m/60),mn=m%60; return h>0?`${h}h ${mn}m`:`${mn}m`; }
function fmtSec(s) { const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60; return h>0?`${pad(h)}:${pad(m)}:${pad(sc)}`:`${pad(m)}:${pad(sc)}`; }
function vibrate(pattern) { if(navigator.vibrate) navigator.vibrate(pattern); }
function toast(msg, dur=2300) { const el=document.getElementById('toast'); el.textContent=msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),dur); }
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

/* ══ MODAL ═══════════════════════════════════════ */
function showModal(html) { document.getElementById('modal-inner').innerHTML=html; document.getElementById('modal-overlay').classList.remove('hidden'); }
function hideModal()     { document.getElementById('modal-overlay').classList.add('hidden'); document.getElementById('modal-inner').innerHTML=''; }

/* ══ FAB ═════════════════════════════════════════ */
function addFAB(icon, fn) {
  document.querySelectorAll('.fab').forEach(f=>f.remove());
  const b=document.createElement('button'); b.className='fab'; b.innerHTML=icon; b.onclick=fn;
  document.getElementById('app').appendChild(b);
}

/* ══ WAKE LOCK ═══════════════════════════════════ */
async function requestWakeLock() {
  if (!CONFIG.wakeLockEnabled) return;
  if (!('wakeLock' in navigator)) return;
  try { STATE.wakeLock = await navigator.wakeLock.request('screen'); } catch(e){}
}
async function releaseWakeLock() {
  if (STATE.wakeLock) { try { await STATE.wakeLock.release(); } catch(e){} STATE.wakeLock=null; }
}

/* ══ NOTIFICATIONS ═══════════════════════════════ */
async function requestNotificationPermission() {
  if (!('Notification' in window)) { toast('Notifications not supported'); return false; }
  const p = await Notification.requestPermission();
  CONFIG.notificationsEnabled = p === 'granted';
  saveConfig();
  if (p === 'granted') { toast('◈ Notifications granted'); return true; }
  toast('Notifications denied'); return false;
}

function scheduleNotification(title, body, tag, tab, delayMs) {
  if (!CONFIG.notificationsEnabled) return;
  setTimeout(() => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type:'SHOW_NOTIFICATION', title, body, tag, tab });
    }
  }, delayMs);
}

function updateBadge(count) {
  if ('setAppBadge' in navigator) navigator.setAppBadge(count).catch(()=>{});
}

/* ══ NAVIGATION ══════════════════════════════════ */
const TAB_META = {
  home:      { title: 'THE RED KEEP',        sub: null },
  coin:      { title: 'MASTER OF COIN',      sub: 'The Treasurer' },
  hand:      { title: 'THE HAND',            sub: 'Daily Disciplines' },
  commander: { title: 'LORD COMMANDER',      sub: 'Physical Readiness' },
  maester:   { title: 'GRAND MAESTER',       sub: 'Knowledge & Study' },
  whispers:  { title: 'MASTER OF WHISPERS',  sub: 'The Private Chronicle' },
};

function setupNav() {
  document.querySelectorAll('.nav-tab').forEach(btn => btn.addEventListener('click', () => showTab(btn.dataset.tab)));
  document.getElementById('modal-close').addEventListener('click', hideModal);
  document.getElementById('modal-overlay').addEventListener('click', e => { if(e.target.id==='modal-overlay') hideModal(); });
  document.getElementById('back-btn').addEventListener('click', () => showTab('home'));
  document.getElementById('settings-btn').addEventListener('click', openSettings);
  document.getElementById('settings-close').addEventListener('click', closeSettings);
  document.getElementById('settings-overlay').addEventListener('click', e => { if(e.target.id==='settings-overlay') closeSettings(); });
}

function showTab(tab) {
  STATE.activeTab = tab;
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.toggle('active', b.dataset.tab===tab));
  document.querySelectorAll('.tab-content').forEach(s => s.classList.toggle('active', s.id==='tab-'+tab));
  document.getElementById('header-title').textContent = TAB_META[tab].title;
  document.getElementById('back-btn').classList.toggle('visible', tab!=='home');
  document.querySelectorAll('.fab').forEach(f=>f.remove());
  if (tab !== 'commander') releaseWakeLock();
  const renders = { home:renderHome, coin:renderCoin, hand:renderHand, commander:renderCommander, maester:renderMaester, whispers:renderWhispers };
  if (renders[tab]) renders[tab]();
}

function modHeader(eyebrow, title, subtitle) {
  return `<div class="mod-header">
    <div class="mod-eyebrow">${eyebrow}</div>
    <div class="mod-title">${title}</div>
    <div class="mod-rule"><div class="mod-rule-line rev"></div><div class="mod-rule-glyph">◈</div><div class="mod-rule-line"></div></div>
    <div class="mod-sub">${subtitle}</div>
  </div>`;
}

/* ══════════════════════════════════════════════════
   THE RED KEEP — Home
══════════════════════════════════════════════════ */
function renderHome() {
  const el = document.getElementById('tab-home');
  const txToday    = DATA.treasury.transactions.filter(t=>t.date===today());
  const hTotal     = DATA.habits.habits.length;
  const hDone      = DATA.habits.logs.filter(l=>l.date===today()).length;
  const weekAgo    = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
  const gymWeek    = DATA.gym.sessions.filter(s=>new Date(s.date)>=weekAgo).length;
  const studyToday = DATA.study.sessions.filter(s=>s.date===today()).reduce((a,s)=>a+s.durationMin,0);
  const moJournal  = DATA.journal.entries.filter(e=>e.date.slice(0,7)===today().slice(0,7)).length;
  const now = new Date();
  const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONS=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const doy = Math.floor((now - new Date(now.getFullYear(),0,0))/86400000);
  const q   = QUOTES[doy % QUOTES.length];
  const undoneBadge = hTotal - hDone;
  if (undoneBadge > 0) updateBadge(undoneBadge); else if ('clearAppBadge' in navigator) navigator.clearAppBadge().catch(()=>{});

  el.innerHTML = `
    <div class="home-banner">
      <span class="home-crest">🕯️</span>
      <div class="home-name">Vigil</div>
      <div class="home-dates">
        <div class="home-greg">${DAYS[now.getDay()]}, ${now.getDate()} ${MONS[now.getMonth()]} ${now.getFullYear()}</div>
        <div class="home-hijri">◈ ${todayHijri()}</div>
      </div>
    </div>
    <div class="home-divider">◈</div>
    <div class="section-title">The Small Council</div>
    <div class="home-grid">
      <div class="home-card" style="--card-tint:rgba(184,120,24,0.05)" onclick="showTab('coin')">
        <div class="home-card-counsel">Master of Coin</div>
        <span class="home-card-icon">⚖️</span>
        <div class="home-card-name">The Treasurer</div>
        <div class="home-card-stat">${txToday.length} entries today</div>
      </div>
      <div class="home-card" style="--card-tint:rgba(34,152,122,0.05)" onclick="showTab('hand')">
        <div class="home-card-counsel">The Hand</div>
        <span class="home-card-icon">✦</span>
        <div class="home-card-name">Disciplines</div>
        <div class="home-card-stat">${hDone}/${hTotal} kept${undoneBadge>0?' — '+undoneBadge+' remain':''}</div>
      </div>
      <div class="home-card" style="--card-tint:rgba(66,114,200,0.05)" onclick="showTab('commander')">
        <div class="home-card-counsel">Lord Commander</div>
        <span class="home-card-icon">⚔️</span>
        <div class="home-card-name">The Yard</div>
        <div class="home-card-stat">${gymWeek} session${gymWeek!==1?'s':''} this week</div>
      </div>
      <div class="home-card" style="--card-tint:rgba(32,160,184,0.05)" onclick="showTab('maester')">
        <div class="home-card-counsel">Grand Maester</div>
        <span class="home-card-icon">⊕</span>
        <div class="home-card-name">The Library</div>
        <div class="home-card-stat">${studyToday>0?fmtMin(studyToday)+' today':'No study today'}</div>
      </div>
      <div class="home-card" style="--card-tint:rgba(122,24,32,0.04);grid-column:1/-1" onclick="showTab('whispers')">
        <div class="home-card-counsel">Master of Whispers</div>
        <span class="home-card-icon">◈</span>
        <div class="home-card-name">The Chronicle</div>
        <div class="home-card-stat">${moJournal} entr${moJournal!==1?'ies':'y'} this month</div>
      </div>
    </div>
    <div class="home-divider">◈</div>
    <div class="section-title">The Sages</div>
    <div class="quote-card">
      <span class="quote-open">❝</span>
      <div class="quote-text">${esc(q.text)}</div>
      <div class="quote-author">${esc(q.author)}</div>
      <div class="quote-era">${esc(q.era)}</div>
    </div>`;
}

/* ══════════════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════════════ */
function openSettings() {
  renderSettings();
  document.getElementById('settings-overlay').classList.remove('hidden');
}
function closeSettings() {
  document.getElementById('settings-overlay').classList.add('hidden');
}

function renderSettings() {
  const body = document.getElementById('settings-body');
  const nPerm = 'Notification' in window ? Notification.permission : 'unsupported';
  body.innerHTML = `
    <div class="settings-section">
      <div class="settings-section-title">Hijri Calendar</div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Moon-sighting offset</div>
          <div class="settings-sub">Tabular calc ±days. Egypt: −1. Today: ${todayHijri()}</div>
        </div>
        <div class="offset-control">
          <button class="offset-btn" onclick="adjustHijri(-1)">−</button>
          <div class="offset-val" id="offset-display">${CONFIG.hijriOffset>0?'+':''}${CONFIG.hijriOffset}</div>
          <button class="offset-btn" onclick="adjustHijri(1)">+</button>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Notifications</div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Permission</div>
          <div class="settings-sub">${nPerm}</div>
        </div>
        <button class="btn btn-sm btn-primary" onclick="requestNotificationPermission().then(renderSettings)">
          ${nPerm==='granted'?'Granted ✓':'Request'}
        </button>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Daily briefing</div>
          <div class="settings-sub">Morning summary notification</div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" ${CONFIG.dailyBriefingEnabled?'checked':''} onchange="toggleConfig('dailyBriefingEnabled',this.checked)">
          <span class="toggle-track"></span>
        </label>
      </div>
      <div class="settings-row">
        <div><div class="settings-label">Briefing time</div></div>
        <input type="time" class="form-control" style="width:120px" value="${CONFIG.dailyBriefingTime}" onchange="CONFIG.dailyBriefingTime=this.value;saveConfig()">
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Training</div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Keep screen awake</div>
          <div class="settings-sub">During active training sessions</div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" ${CONFIG.wakeLockEnabled?'checked':''} onchange="toggleConfig('wakeLockEnabled',this.checked)">
          <span class="toggle-track"></span>
        </label>
      </div>
      <div class="settings-row">
        <div><div class="settings-label">Rest timer duration</div></div>
        <select class="form-control" style="width:100px" onchange="CONFIG.restTimerDuration=+this.value;saveConfig()">
          ${[30,60,90,120,180,240].map(s=>`<option value="${s}" ${CONFIG.restTimerDuration===s?'selected':''}>${s}s</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Pomodoro</div>
      <div class="settings-row">
        <div><div class="settings-label">Focus duration</div></div>
        <select class="form-control" style="width:90px" onchange="CONFIG.pomodoroFocus=+this.value;saveConfig()">
          ${[15,20,25,30,45,50].map(m=>`<option value="${m}" ${CONFIG.pomodoroFocus===m?'selected':''}>${m} min</option>`).join('')}
        </select>
      </div>
      <div class="settings-row">
        <div><div class="settings-label">Short break</div></div>
        <select class="form-control" style="width:90px" onchange="CONFIG.pomodoroShortBreak=+this.value;saveConfig()">
          ${[3,5,10].map(m=>`<option value="${m}" ${CONFIG.pomodoroShortBreak===m?'selected':''}>${m} min</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Data</div>
      <div class="settings-row">
        <div><div class="settings-label">Export all data</div></div>
        <button class="btn btn-sm" onclick="exportData()">Export JSON</button>
      </div>
      <div class="settings-row">
        <div><div class="settings-label">Import data</div></div>
        <button class="btn btn-sm" onclick="importDataPrompt()">Import</button>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label" style="color:var(--cinnabar-bright)">Reset all data</div>
          <div class="settings-sub">Cannot be undone</div>
        </div>
        <button class="btn btn-sm btn-danger" onclick="resetData()">Reset</button>
      </div>
    </div>`;
}

function adjustHijri(d) {
  CONFIG.hijriOffset = Math.max(-3, Math.min(3, (CONFIG.hijriOffset||0)+d));
  saveConfig();
  document.getElementById('offset-display').textContent = (CONFIG.hijriOffset>0?'+':'')+CONFIG.hijriOffset;
  // update today display
  document.getElementById('settings-body').querySelector('.settings-sub').textContent =
    'Tabular calc ±days. Egypt: −1. Today: '+todayHijri();
}

function toggleConfig(key, val) { CONFIG[key]=val; saveConfig(); }

function exportData() {
  const payload = JSON.stringify({ data: DATA, config: CONFIG, exported: new Date().toISOString() }, null, 2);
  const blob = new Blob([payload], { type:'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `vigil-${today()}.json`; a.click();
  URL.revokeObjectURL(url);
  if (navigator.share && navigator.canShare && navigator.canShare({files:[new File([payload],'vigil.json',{type:'application/json'})]})) {
    navigator.share({ files:[new File([payload],'vigil.json',{type:'application/json'})], title:'Vigil Export' }).catch(()=>{});
  }
  toast('Data exported');
}

function importDataPrompt() {
  const inp = document.createElement('input'); inp.type='file'; inp.accept='.json';
  inp.onchange = e => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.data) { DATA=deepMerge(DEFAULT_DATA,d.data); if(d.config) Object.assign(CONFIG,d.config); saveData(); saveConfig(); toast('◈ Data imported'); renderSettings(); if(STATE.activeTab==='home') renderHome(); }
        else toast('Invalid file');
      } catch(e) { toast('Import failed'); }
    };
    r.readAsText(f);
  };
  inp.click();
}

function resetData() {
  if (!confirm('Reset all Vigil data? This cannot be undone.')) return;
  DATA = JSON.parse(JSON.stringify(DEFAULT_DATA)); saveData(); closeSettings(); showTab('home'); toast('Data reset');
}

/* ══════════════════════════════════════════════════
   MASTER OF COIN — Treasury
══════════════════════════════════════════════════ */
function renderCoin() {
  const el = document.getElementById('tab-coin');
  const views = ['log','chart','reconcile','vault','goals','forecast'];
  const labels = ['Log','Breakdown','Audit','Reserve','Goals','Forecast'];
  const v = STATE.coinView;

  el.innerHTML = modHeader('Master of Coin', 'The Treasurer', 'The complete account — income, expenditure, and reserve') +
    `<div class="mod-tabs">${labels.map((l,i)=>`<button class="mod-tab ${v===views[i]?'active':''}" onclick="setCoinView('${views[i]}')">${l}</button>`).join('')}</div>
    <div id="coin-body"></div>`;

  addFAB('+', () => showAddTx());
  renderCoinBody();
  tryFetchGold();
}

function setCoinView(v) { STATE.coinView=v; renderCoin(); }

function renderCoinBody() {
  const el = document.getElementById('coin-body'); if(!el) return;
  const v = STATE.coinView;
  if (v==='log')       renderCoinLog(el);
  if (v==='chart')     renderCoinChart(el);
  if (v==='reconcile') renderCoinReconcile(el);
  if (v==='vault')     renderCoinVault(el);
  if (v==='goals')     renderCoinGoals(el);
  if (v==='forecast')  renderCoinForecast(el);
}

function renderCoinLog(el) {
  const txs = DATA.treasury.transactions;
  const cats = DATA.treasury.categories;
  const months = [...new Set(txs.map(t=>t.date.slice(0,7)))].sort().reverse();
  const filt = STATE.txFilter;

  // Summary for current month
  const mTxs = txs.filter(t=>t.date.slice(0,7)===today().slice(0,7));
  const income  = mTxs.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0);
  const expense = mTxs.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0);
  const net = income - expense;

  el.innerHTML = `
    <div class="summary-bar">
      <div class="summary-cell">
        <div class="summary-cell-label">In</div>
        <div class="summary-cell-val text-green">${fmtEGP(income)}</div>
      </div>
      <div class="summary-cell">
        <div class="summary-cell-label">Out</div>
        <div class="summary-cell-val text-red">${fmtEGP(expense)}</div>
      </div>
      <div class="summary-cell">
        <div class="summary-cell-label">Net</div>
        <div class="summary-cell-val ${net>=0?'text-green':'text-red'}">${fmtEGP(Math.abs(net))}</div>
      </div>
    </div>
    <div class="filter-row">
      <div class="filter-chip ${filt==='all'?'active':''}" onclick="setTxFilter('all')">All</div>
      <div class="filter-chip ${filt==='income'?'active':''}" onclick="setTxFilter('income')">Income</div>
      <div class="filter-chip ${filt==='expense'?'active':''}" onclick="setTxFilter('expense')">Expense</div>
      ${cats.map(c=>`<div class="filter-chip ${filt===c.id?'active':''}" onclick="setTxFilter('${c.id}')">${c.icon} ${esc(c.name)}</div>`).join('')}
    </div>
    ${months.length ? months.map(mo => {
      let moTxs = txs.filter(t=>t.date.slice(0,7)===mo);
      if(filt==='income')  moTxs=moTxs.filter(t=>t.type==='income');
      if(filt==='expense') moTxs=moTxs.filter(t=>t.type==='expense');
      if(cats.find(c=>c.id===filt)) moTxs=moTxs.filter(t=>t.categoryId===filt);
      if(!moTxs.length) return '';
      const moNet = moTxs.reduce((a,t)=>t.type==='income'?a+t.amount:a-t.amount,0);
      return `<div class="section-title">${monthLabel(mo)} <span style="font-size:11px;opacity:0.7">${moNet>=0?'+':''}${fmtEGP(Math.abs(moNet))}</span></div>
        <div class="card">${moTxs.sort((a,b)=>b.date.localeCompare(a.date)).map(t => {
          const cat = cats.find(c=>c.id===t.categoryId)||{icon:'📦',name:'Other'};
          return `<div class="tx-item">
            <div class="tx-icon" style="border-color:${cat.color}30;background:${cat.color}14">${cat.icon}</div>
            <div class="tx-info">
              <div class="tx-category">${esc(cat.name)}${t.recurring?'<span class="tx-recurring">↻ recurring</span>':''}</div>
              <div class="tx-note">${esc(t.note||'')}</div>
              <div class="tx-date">${formatDate(t.date)} · ${hijriString(t.date, CONFIG.hijriOffset)}</div>
            </div>
            <div class="tx-amount ${t.type}">${t.type==='income'?'+':'−'}${fmtEGP(t.amount)}</div>
            <button class="tx-del" onclick="deleteTx('${t.id}')">✕</button>
          </div>`;
        }).join('')}</div>`;
    }).join('') : '<div class="empty-state"><div class="empty-icon">⚖️</div><div class="empty-title">No records yet</div><div class="empty-sub">Tap + to record your first transaction</div></div>'}`;

  // Budget envelope warnings
  checkBudgetAlerts();
}

function checkBudgetAlerts() {
  if (!DATA.treasury.budgets?.length) return;
  const mo = today().slice(0,7);
  DATA.treasury.budgets.forEach(b => {
    const spent = DATA.treasury.transactions.filter(t=>t.date.slice(0,7)===mo&&t.type==='expense'&&t.categoryId===b.catId).reduce((a,t)=>a+t.amount,0);
    const pct = b.limit > 0 ? spent/b.limit : 0;
    if (pct >= 1 && CONFIG.notificationsEnabled) {
      const cat = DATA.treasury.categories.find(c=>c.id===b.catId);
      scheduleNotification('Budget exceeded', `${cat?.name||'Category'}: ${fmtEGP(spent)} of ${fmtEGP(b.limit)}`, 'budget-'+b.catId, 'coin', 0);
    }
  });
}

function setTxFilter(f) { STATE.txFilter=f; renderCoinBody(); }

function showAddTx() {
  const cats = DATA.treasury.categories;
  showModal(`<div class="modal-title">◈ Record Transaction</div>
    <div class="type-toggle">
      <button class="type-toggle-btn expense active" id="tt-exp" onclick="setTxType('expense')">Expense</button>
      <button class="type-toggle-btn income" id="tt-inc" onclick="setTxType('income')">Income</button>
    </div>
    <div class="form-group"><label class="form-label">Amount (EGP)</label>
      <input type="number" id="tx-amount" class="form-control" placeholder="0" min="0" step="0.01" inputmode="decimal"></div>
    <div class="form-group"><label class="form-label">Category</label>
      <select id="tx-cat" class="form-control">${cats.map(c=>`<option value="${c.id}">${c.icon} ${esc(c.name)}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Note</label>
      <input type="text" id="tx-note" class="form-control" placeholder="Optional"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Date</label>
        <input type="date" id="tx-date" class="form-control" value="${today()}"></div>
      <div class="form-group"><label class="form-label">Recurring?</label>
        <select id="tx-recur" class="form-control"><option value="">One-time</option><option value="monthly">Monthly</option><option value="weekly">Weekly</option></select></div>
    </div>
    <button class="btn btn-primary btn-full mt-12" onclick="saveTx()">Record</button>`);
  document.getElementById('tx-amount').focus();
}

let _txType = 'expense';
function setTxType(t) {
  _txType = t;
  document.getElementById('tt-exp').classList.toggle('active', t==='expense');
  document.getElementById('tt-inc').classList.toggle('active', t==='income');
}

function saveTx() {
  const amt = parseFloat(document.getElementById('tx-amount').value);
  if (!amt || amt<=0) { toast('Enter a valid amount'); return; }
  const tx = {
    id: uid(), type: _txType, amount: amt,
    categoryId: document.getElementById('tx-cat').value,
    note:       document.getElementById('tx-note').value.trim(),
    date:       document.getElementById('tx-date').value,
    recurring:  document.getElementById('tx-recur').value || null,
  };
  DATA.treasury.transactions.unshift(tx); saveData(); hideModal();
  toast(_txType==='income'?'◈ Income recorded':'◈ Expense recorded');
  vibrate([50,20,50]); renderCoin();
}

function deleteTx(id) {
  DATA.treasury.transactions = DATA.treasury.transactions.filter(t=>t.id!==id);
  saveData(); renderCoinBody();
}

function renderCoinChart(el) {
  const mo = today().slice(0,7);
  const txs = DATA.treasury.transactions.filter(t=>t.date.slice(0,7)===mo&&t.type==='expense');
  const cats = DATA.treasury.categories;
  const totals = {}; txs.forEach(t=>{ totals[t.categoryId]=(totals[t.categoryId]||0)+t.amount; });
  const total = Object.values(totals).reduce((a,v)=>a+v,0);
  if (!total) { el.innerHTML='<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-title">No expense data this month</div></div>'; return; }

  const sorted = Object.entries(totals).sort((a,b)=>b[1]-a[1]);
  let startAngle = -Math.PI/2, svgArcs = '';
  const cx=100, cy=100, r=72, gap=1.5;
  sorted.forEach(([catId, amt]) => {
    const cat = cats.find(c=>c.id===catId)||{color:'#666',icon:'?',name:'Other'};
    const angle = (amt/total)*Math.PI*2 - gap*0.02;
    const x1=cx+r*Math.cos(startAngle), y1=cy+r*Math.sin(startAngle);
    const x2=cx+r*Math.cos(startAngle+angle), y2=cy+r*Math.sin(startAngle+angle);
    const lg = angle>Math.PI?1:0;
    svgArcs += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} Z" fill="${cat.color}" opacity="0.85"/>`;
    startAngle += angle + gap*0.02;
  });

  // Budgets overlay
  const budgets = DATA.treasury.budgets||[];
  const envelopeHTML = budgets.length ? `
    <div class="section-title mt-12">Budget Envelopes</div>
    <div class="card envelope-list">
      ${budgets.map(b=>{
        const cat=cats.find(c=>c.id===b.catId)||{icon:'📦',name:'Other'};
        const spent=txs.filter(t=>t.categoryId===b.catId).reduce((a,t)=>a+t.amount,0);
        const pct=b.limit>0?Math.min(1,spent/b.limit):0;
        const cls=pct>=1?'over':pct>=0.8?'warn':'';
        return `<div class="envelope-row">
          <div class="envelope-top">
            <div class="envelope-cat">${cat.icon} ${esc(cat.name)}</div>
            <div class="envelope-nums">${fmtEGP(spent)} / ${fmtEGP(b.limit)}</div>
          </div>
          <div class="envelope-bar"><div class="envelope-fill ${cls}" style="width:${pct*100}%"></div></div>
        </div>`;
      }).join('')}
    </div>` : '';

  el.innerHTML = `
    <div class="section-title">This Month's Spending</div>
    <div class="card">
      <div class="chart-wrap">
        <svg class="pie-svg" viewBox="0 0 200 200" width="180" height="180">${svgArcs}
          <circle cx="${cx}" cy="${cy}" r="40" fill="var(--bg-card)"/>
          <text x="${cx}" y="${cy-6}" text-anchor="middle" font-family="var(--cairo)" font-size="9" fill="var(--text-stone)">Total</text>
          <text x="${cx}" y="${cy+10}" text-anchor="middle" font-family="var(--kufi)" font-size="13" fill="var(--amber-bright)">${fmtEGP(total)}</text>
        </svg>
        <div class="pie-legend">
          ${sorted.map(([catId,amt])=>{
            const cat=cats.find(c=>c.id===catId)||{color:'#666',name:'Other'};
            return `<div class="legend-item"><div class="legend-dot" style="background:${cat.color}"></div><div class="legend-label">${esc(cat.name)}</div><div class="legend-pct">${((amt/total)*100).toFixed(0)}%</div><div class="legend-amt">${fmtEGP(amt)}</div></div>`;
          }).join('')}
        </div>
      </div>
    </div>
    <button class="btn btn-sm mt-8" onclick="showBudgetSetup()">⊕ Set Budget Envelopes</button>
    ${envelopeHTML}
    ${renderNetWorthChart()}`;
}

function renderNetWorthChart() {
  const txs = DATA.treasury.transactions;
  const months = [...new Set(txs.map(t=>t.date.slice(0,7)))].sort();
  if (months.length < 2) return '';
  const points = months.map(mo => {
    const inc = txs.filter(t=>t.date.slice(0,7)===mo&&t.type==='income').reduce((a,t)=>a+t.amount,0);
    const exp = txs.filter(t=>t.date.slice(0,7)===mo&&t.type==='expense').reduce((a,t)=>a+t.amount,0);
    return inc - exp;
  });
  const cumulative = points.reduce((acc,v,i)=>{ acc.push((acc[i-1]||0)+v); return acc; },[]);
  const min=Math.min(...cumulative), max=Math.max(...cumulative);
  const range=max-min||1;
  const W=300, H=80, pad=10;
  const xs = cumulative.map((_,i)=>pad+i*(W-pad*2)/(cumulative.length-1));
  const ys = cumulative.map(v=>H-pad-(v-min)/range*(H-pad*2));
  const polyline = xs.map((x,i)=>`${x},${ys[i]}`).join(' ');
  const area = `M${xs[0]},${H-pad} L${xs.map((x,i)=>`${x},${ys[i]}`).join(' L')} L${xs[xs.length-1]},${H-pad} Z`;
  const zeroY = H-pad-(0-min)/range*(H-pad*2);

  return `<div class="section-title mt-16">Net Position Over Time</div>
    <div class="card">
      <svg viewBox="0 0 ${W} ${H}" class="chart-svg" style="height:${H}px">
        ${min<0&&max>0?`<line x1="${pad}" y1="${zeroY}" x2="${W-pad}" y2="${zeroY}" class="chart-zero"/>`:''}
        <path d="${area}" fill="var(--amber)" class="chart-area"/>
        <polyline points="${polyline}" class="chart-line" stroke="var(--amber)"/>
        ${xs.map((x,i)=>`<circle cx="${x}" cy="${ys[i]}" r="3" fill="${cumulative[i]>=0?'var(--amber)':'var(--cinnabar-bright)'}" class="chart-dot"/>`).join('')}
        ${months.map((mo,i)=>i===0||i===months.length-1?`<text x="${xs[i]}" y="${H-1}" text-anchor="${i===0?'start':'end'}" class="chart-axis-label">${monthLabel(mo)}</text>`:'').join('')}
      </svg>
    </div>`;
}

function showBudgetSetup() {
  const cats = DATA.treasury.categories;
  const budgets = DATA.treasury.budgets||[];
  showModal(`<div class="modal-title">Budget Envelopes</div>
    <div class="form-hint mb-12">Set monthly spending limits per category.</div>
    ${cats.map(c=>{
      const b = budgets.find(x=>x.catId===c.id);
      return `<div class="form-group">
        <label class="form-label">${c.icon} ${esc(c.name)}</label>
        <input type="number" class="form-control" id="budget-${c.id}" placeholder="No limit" value="${b?b.limit:''}" min="0">
      </div>`;
    }).join('')}
    <button class="btn btn-primary btn-full" onclick="saveBudgets()">Save Envelopes</button>`);
}

function saveBudgets() {
  DATA.treasury.budgets = DATA.treasury.categories
    .map(c=>({ catId:c.id, limit:parseFloat(document.getElementById('budget-'+c.id)?.value)||0 }))
    .filter(b=>b.limit>0);
  saveData(); hideModal(); toast('Envelopes saved'); renderCoin();
}

function renderCoinReconcile(el) {
  const txs = DATA.treasury.transactions;
  const mo  = today().slice(0,7);
  const moTxs = txs.filter(t=>t.date.slice(0,7)===mo);
  const trackedIncome  = moTxs.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0);
  const trackedExpense = moTxs.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0);
  const bank = DATA.treasury.bankBalance;
  const cash = DATA.treasury.cashBalance;
  const total = (bank||0)+(cash||0);
  const expected = trackedIncome - trackedExpense;
  const diff = total > 0 ? total - expected : null;

  el.innerHTML = `
    <div class="section-title">Monthly Audit — ${monthLabel(mo)}</div>
    <div class="card">
      <div class="recon-row"><div class="recon-label">Tracked income</div><div class="recon-val text-green">${fmtEGP(trackedIncome)}</div></div>
      <div class="recon-row"><div class="recon-label">Tracked expenses</div><div class="recon-val text-red">${fmtEGP(trackedExpense)}</div></div>
      <div class="recon-row"><div class="recon-label">Net (tracked)</div><div class="recon-val ${expected>=0?'good':'bad'}">${fmtEGP(Math.abs(expected))}</div></div>
    </div>
    <div class="section-title mt-16">Actual Balances</div>
    <div class="card">
      <div class="form-row">
        <div class="form-group"><label class="form-label">Bank (EGP)</label>
          <input type="number" id="rec-bank" class="form-control" value="${bank||''}" placeholder="Enter balance" inputmode="decimal"></div>
        <div class="form-group"><label class="form-label">Cash (EGP)</label>
          <input type="number" id="rec-cash" class="form-control" value="${cash||''}" placeholder="Enter balance" inputmode="decimal"></div>
      </div>
      <button class="btn btn-sm btn-primary btn-full" onclick="saveBalances()">Update Balances</button>
      ${diff!==null ? `
        <div class="recon-row mt-12"><div class="recon-label">Total on hand</div><div class="recon-val">${fmtEGP(total)}</div></div>
        <div class="recon-row"><div class="recon-label">Expected from tracking</div><div class="recon-val">${fmtEGP(expected)}</div></div>
        <div class="recon-row">
          <div class="recon-label">Discrepancy</div>
          <div class="recon-val ${Math.abs(diff)<100?'good':'warn'}">${diff>=0?'+':''}${fmtEGP(diff)}</div>
        </div>` : ''}
    </div>
    ${renderMonthComparison()}`;
}

function saveBalances() {
  DATA.treasury.bankBalance = parseFloat(document.getElementById('rec-bank').value)||null;
  DATA.treasury.cashBalance = parseFloat(document.getElementById('rec-cash').value)||null;
  saveData(); toast('Balances saved'); renderCoinBody();
}

function renderMonthComparison() {
  const txs = DATA.treasury.transactions;
  const mo  = today().slice(0,7);
  const [yr,mn] = mo.split('-').map(Number);
  const prevDate = new Date(yr, mn-2, 1);
  const prev = `${prevDate.getFullYear()}-${pad(prevDate.getMonth()+1)}`;
  const calcMo = m => {
    const t = txs.filter(t=>t.date.slice(0,7)===m);
    return { inc:t.filter(x=>x.type==='income').reduce((a,x)=>a+x.amount,0), exp:t.filter(x=>x.type==='expense').reduce((a,x)=>a+x.amount,0) };
  };
  const cur=calcMo(mo), prv=calcMo(prev);
  const cNet=cur.inc-cur.exp, pNet=prv.inc-prv.exp;
  const netDiff = pNet!==0 ? ((cNet-pNet)/Math.abs(pNet)*100).toFixed(0) : null;

  return `<div class="section-title mt-16">Month Comparison</div>
    <div class="month-compare">
      <div class="month-box">
        <div class="month-box-label">${monthLabel(prev)}</div>
        <div class="month-stat"><div class="month-stat-label">Income</div><div class="month-stat-val text-green">${fmtEGP(prv.inc)}</div></div>
        <div class="month-stat"><div class="month-stat-label">Expenses</div><div class="month-stat-val text-red">${fmtEGP(prv.exp)}</div></div>
        <div class="month-stat"><div class="month-stat-label">Net</div><div class="month-stat-val ${pNet>=0?'text-green':'text-red'}">${fmtEGP(Math.abs(pNet))}</div></div>
      </div>
      <div class="month-box">
        <div class="month-box-label">${monthLabel(mo)}</div>
        <div class="month-stat"><div class="month-stat-label">Income</div><div class="month-stat-val text-green">${fmtEGP(cur.inc)}</div></div>
        <div class="month-stat"><div class="month-stat-label">Expenses</div><div class="month-stat-val text-red">${fmtEGP(cur.exp)}</div></div>
        <div class="month-stat"><div class="month-stat-label">Net</div><div class="month-stat-val ${cNet>=0?'text-green':'text-red'}">${fmtEGP(Math.abs(cNet))}</div></div>
        ${netDiff!==null?`<span class="month-change ${cNet>=pNet?'up':'dn'}">${cNet>=pNet?'↑':'↓'} ${Math.abs(netDiff)}%</span>`:''}
      </div>
    </div>`;
}

function renderCoinVault(el) {
  const price = DATA.treasury.cachedGoldPrice;
  const rate  = DATA.treasury.cachedEgpRate;
  const ts    = DATA.treasury.cachedGoldTs;
  const entries = DATA.treasury.goldEntries||[];
  const egpPerGram = price && rate ? (price * rate / 31.1035) : null;
  const totalGrams = entries.reduce((a,e)=>a+e.grams,0);
  const totalValue = egpPerGram ? totalGrams * egpPerGram : null;

  el.innerHTML = `
    ${modHeader('The Reserve', '◈ Al-Dhahab', 'Gold holdings — Gracián\'s principle of reserve applied')}
    <div class="gold-banner">
      <div>
        <div class="gold-price-label">Gold per gram (EGP)</div>
        <div class="gold-price-val">${egpPerGram ? fmtEGP(egpPerGram) : '—'}</div>
        <div class="gold-price-ts">${ts ? 'Updated '+new Date(ts).toLocaleTimeString() : 'Offline — tap to retry'}</div>
      </div>
      <div>
        <div class="gold-price-label">Total holding</div>
        <div class="gold-price-val">${totalGrams}g</div>
        ${totalValue ? `<div class="gold-price-ts">≈ ${fmtEGP(totalValue)}</div>` : ''}
      </div>
      <button class="btn btn-sm" onclick="tryFetchGold(true)">Refresh</button>
    </div>
    <div class="card">
      ${entries.length ? entries.map(e=>{
        const nowVal = egpPerGram ? e.grams * egpPerGram : null;
        const paid   = e.paidEGP||0;
        const gain   = nowVal ? nowVal - paid : null;
        return `<div class="gold-item">
          <div class="flex-1">
            <div class="gold-item-grams">${e.grams}g</div>
            <div class="gold-item-meta">${formatDate(e.date)} · Paid ${fmtEGP(paid)}</div>
          </div>
          <div>
            ${nowVal ? `<div class="gold-item-now">${fmtEGP(nowVal)}</div>
              <div class="gold-item-gain ${gain>=0?'pos':'neg'}">${gain>=0?'+':''}${fmtEGP(gain)}</div>` : '<div class="gold-item-now">—</div>'}
          </div>
          <button class="tx-del" onclick="deleteGold('${e.id}')">✕</button>
        </div>`;
      }).join('') : '<div class="empty-state"><div class="empty-icon">◈</div><div class="empty-title">No gold entries</div><div class="empty-sub">Record your reserve holdings</div></div>'}
    </div>
    <button class="btn btn-primary btn-full mt-8" onclick="showAddGold()">⊕ Add Gold Entry</button>`;
}

async function tryFetchGold(force=false) {
  const now = Date.now();
  if (!force && DATA.treasury.cachedGoldTs && now - DATA.treasury.cachedGoldTs < 3600000) return;
  try {
    const [g, fx] = await Promise.all([
      fetch('https://api.metals.live/v1/spot/gold'),
      fetch('https://open.er-api.com/v6/latest/USD')
    ]);
    const gj=await g.json(), fxj=await fx.json();
    DATA.treasury.cachedGoldPrice = gj[0]?.price;
    DATA.treasury.cachedEgpRate   = fxj.rates?.EGP;
    DATA.treasury.cachedGoldTs    = Date.now();
    saveData();
    if (STATE.coinView==='vault') renderCoinBody();
  } catch(e) {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => { if(reg.sync) reg.sync.register('sync-gold').catch(()=>{}); });
    }
  }
}

function showAddGold() {
  showModal(`<div class="modal-title">◈ Add Gold Entry</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Grams</label><input type="number" id="gold-grams" class="form-control" placeholder="e.g. 10" step="0.01" min="0.01" inputmode="decimal"></div>
      <div class="form-group"><label class="form-label">Paid (EGP)</label><input type="number" id="gold-paid" class="form-control" placeholder="Total cost" min="0" inputmode="decimal"></div>
    </div>
    <div class="form-group"><label class="form-label">Date purchased</label><input type="date" id="gold-date" class="form-control" value="${today()}"></div>
    <div class="form-group"><label class="form-label">Notes</label><input type="text" id="gold-note" class="form-control" placeholder="Optional"></div>
    <button class="btn btn-primary btn-full" onclick="saveGold()">Record</button>`);
}

function saveGold() {
  const grams = parseFloat(document.getElementById('gold-grams').value);
  if (!grams || grams<=0) { toast('Enter valid grams'); return; }
  DATA.treasury.goldEntries.push({ id:uid(), grams, paidEGP:parseFloat(document.getElementById('gold-paid').value)||0, date:document.getElementById('gold-date').value, note:document.getElementById('gold-note').value });
  saveData(); hideModal(); toast('Gold recorded'); renderCoin();
}

function deleteGold(id) { DATA.treasury.goldEntries=DATA.treasury.goldEntries.filter(e=>e.id!==id); saveData(); renderCoinBody(); }

function renderCoinGoals(el) {
  const goals = DATA.treasury.goals||[];
  el.innerHTML = `
    <div class="section-title">Savings Goals</div>
    ${goals.length ? `<div class="card">${goals.map(g=>{
      const pct = g.target>0 ? Math.min(1, g.saved/g.target) : 0;
      return `<div class="goal-item">
        <div class="goal-top">
          <div><div class="goal-name">${esc(g.name)}</div></div>
          <div class="goal-pct">${(pct*100).toFixed(0)}%</div>
        </div>
        <div class="goal-bar"><div class="goal-fill" style="width:${pct*100}%"></div></div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div class="goal-amounts">${fmtEGP(g.saved)} saved of ${fmtEGP(g.target)}</div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-xs" onclick="addToGoal('${g.id}')">+ Add</button>
            <button class="btn btn-xs btn-danger" onclick="deleteGoal('${g.id}')">✕</button>
          </div>
        </div>
      </div>`;
    }).join('')}</div>` : '<div class="empty-state"><div class="empty-icon">◈</div><div class="empty-title">No goals set</div></div>'}
    <button class="btn btn-primary btn-full mt-8" onclick="showAddGoal()">⊕ New Goal</button>`;
}

function showAddGoal() {
  showModal(`<div class="modal-title">New Savings Goal</div>
    <div class="form-group"><label class="form-label">Goal name</label><input type="text" id="goal-name" class="form-control" placeholder="e.g. Emergency Fund"></div>
    <div class="form-group"><label class="form-label">Target (EGP)</label><input type="number" id="goal-target" class="form-control" placeholder="0" min="0" inputmode="decimal"></div>
    <div class="form-group"><label class="form-label">Already saved (EGP)</label><input type="number" id="goal-saved" class="form-control" placeholder="0" min="0" inputmode="decimal"></div>
    <button class="btn btn-primary btn-full" onclick="saveGoal()">Create Goal</button>`);
}

function saveGoal() {
  const name = document.getElementById('goal-name').value.trim();
  const target = parseFloat(document.getElementById('goal-target').value)||0;
  if (!name) { toast('Enter a name'); return; }
  if (!DATA.treasury.goals) DATA.treasury.goals=[];
  DATA.treasury.goals.push({ id:uid(), name, target, saved:parseFloat(document.getElementById('goal-saved').value)||0 });
  saveData(); hideModal(); toast('Goal created'); renderCoin();
}

function addToGoal(id) {
  showModal(`<div class="modal-title">Add to Goal</div>
    <div class="form-group"><label class="form-label">Amount (EGP)</label><input type="number" id="goal-add-amt" class="form-control" placeholder="0" min="0" inputmode="decimal"></div>
    <button class="btn btn-primary btn-full" onclick="commitAddToGoal('${id}')">Add</button>`);
}

function commitAddToGoal(id) {
  const amt = parseFloat(document.getElementById('goal-add-amt').value)||0;
  const g = DATA.treasury.goals.find(x=>x.id===id);
  if (g) { g.saved += amt; if(g.saved>=g.target) { toast('◈ Goal reached!'); vibrate([200,100,200,100,400]); } }
  saveData(); hideModal(); renderCoin();
}

function deleteGoal(id) { DATA.treasury.goals=DATA.treasury.goals.filter(g=>g.id!==id); saveData(); renderCoin(); }

function renderCoinForecast(el) {
  const recurring = DATA.treasury.transactions.filter(t=>t.recurring);
  if (!recurring.length) {
    el.innerHTML=`<div class="empty-state"><div class="empty-icon">◈</div><div class="empty-title">No recurring transactions</div><div class="empty-sub">Mark transactions as recurring when adding them</div></div>`;
    return;
  }
  const cats = DATA.treasury.categories;
  const monthlyIncome  = recurring.filter(t=>t.type==='income'&&t.recurring==='monthly').reduce((a,t)=>a+t.amount,0);
  const monthlyExpense = recurring.filter(t=>t.type==='expense'&&t.recurring==='monthly').reduce((a,t)=>a+t.amount,0);
  el.innerHTML = `
    <div class="section-title">Recurring Transactions</div>
    <div class="card">
      ${recurring.map(t=>{
        const cat=cats.find(c=>c.id===t.categoryId)||{icon:'📦',name:'Other'};
        return `<div class="tx-item">
          <div class="tx-icon">${cat.icon}</div>
          <div class="tx-info"><div class="tx-category">${esc(cat.name)}</div><div class="tx-note">${esc(t.note||'')} · ${t.recurring}</div></div>
          <div class="tx-amount ${t.type}">${t.type==='income'?'+':'−'}${fmtEGP(t.amount)}</div>
        </div>`;
      }).join('')}
    </div>
    <div class="section-title mt-16">30-Day Projection</div>
    <div class="card">
      <div class="recon-row"><div class="recon-label">Projected income</div><div class="recon-val text-green">${fmtEGP(monthlyIncome)}</div></div>
      <div class="recon-row"><div class="recon-label">Projected expenses</div><div class="recon-val text-red">${fmtEGP(monthlyExpense)}</div></div>
      <div class="recon-row"><div class="recon-label">Projected net</div><div class="recon-val ${monthlyIncome-monthlyExpense>=0?'good':'bad'}">${fmtEGP(Math.abs(monthlyIncome-monthlyExpense))}</div></div>
    </div>`;
}

/* ══════════════════════════════════════════════════
   THE HAND — Habits / Disciplines
══════════════════════════════════════════════════ */
function renderHand() {
  const el = document.getElementById('tab-hand');
  const views=['today','heatmap','manage'];
  const labels=['Today','Heatmap','Manage'];
  const v=STATE.habitView;
  el.innerHTML = modHeader('The Hand of the King','Disciplines','Murāqaba — the watch that does not relent')+
    `<div class="mod-tabs">${labels.map((l,i)=>`<button class="mod-tab ${v===views[i]?'active':''}" onclick="setHabitView('${views[i]}')">${l}</button>`).join('')}</div>
    <div id="hand-body"></div>`;
  addFAB('+', ()=>showAddHabit());
  renderHandBody();
}

function setHabitView(v) { STATE.habitView=v; renderHand(); }

function renderHandBody() {
  const el=document.getElementById('hand-body'); if(!el) return;
  if(STATE.habitView==='today')   renderHandToday(el);
  if(STATE.habitView==='heatmap') renderHandHeatmap(el);
  if(STATE.habitView==='manage')  renderHandManage(el);
}

function renderHandToday(el) {
  const habits = DATA.habits.habits;
  const logs   = DATA.habits.logs;
  const todayLogs = logs.filter(l=>l.date===today());
  const done = todayLogs.length;
  const total = habits.length;

  if (!habits.length) {
    el.innerHTML='<div class="empty-state"><div class="empty-icon">✦</div><div class="empty-title">No disciplines set</div><div class="empty-sub">Tap + to add your first discipline</div></div>';
    return;
  }

  el.innerHTML = `
    <div class="summary-bar mb-12">
      <div class="summary-cell"><div class="summary-cell-label">Kept</div><div class="summary-cell-val text-green">${done}</div></div>
      <div class="summary-cell"><div class="summary-cell-label">Remaining</div><div class="summary-cell-val ${total-done>0?'text-red':'text-green'}">${total-done}</div></div>
      <div class="summary-cell"><div class="summary-cell-label">Rate</div><div class="summary-cell-val text-amber">${total>0?Math.round(done/total*100):0}%</div></div>
    </div>
    <div class="card">
      ${habits.map(h => {
        const isDone = todayLogs.some(l=>l.habitId===h.id);
        const streak = getStreak(h.id);
        const record = getBestStreak(h.id);
        const week7  = getLast7(h.id);
        return `<div class="habit-row">
          <div class="habit-check ${isDone?'done':''}" onclick="toggleHabit('${h.id}')">
            ${isDone ? '✓' : h.icon||'◉'}
          </div>
          <div class="habit-info">
            <div class="habit-name">${esc(h.name)}${streak>=record&&record>2?'<span class="pr-badge">BEST</span>':''}</div>
            <div class="habit-streak">
              <span class="streak-flame">${streak>0?'🔥':''}</span>
              ${streak} day streak
              ${record>0?`<span class="streak-record">· Best: ${record}</span>`:''}
            </div>
            <div class="week-grid">${week7.map((d,i)=>{
              const DAY=['M','T','W','T','F','S','S'];
              return `<div class="week-day"><div class="week-day-label">${DAY[i]}</div><div class="week-dot ${d?'done':''} ${i===new Date().getDay()-1||i===6&&new Date().getDay()===0?'today':''}">
                ${d?'✓':''}</div></div>`;
            }).join('')}</div>
          </div>
          <div class="habit-actions">
            <button class="btn btn-xs" onclick="showHabitReminder('${h.id}')">⏰</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

function toggleHabit(habitId) {
  const idx = DATA.habits.logs.findIndex(l=>l.date===today()&&l.habitId===habitId);
  if (idx>=0) { DATA.habits.logs.splice(idx,1); }
  else {
    DATA.habits.logs.push({ id:uid(), habitId, date:today() });
    vibrate([50,20,80]);
    const streak = getStreak(habitId);
    const record = getBestStreak(habitId);
    if (streak>0&&streak===record&&streak>2) {
      toast(`🔥 New record — ${streak} days`);
      vibrate([100,50,100,50,200]);
    }
  }
  saveData();
  // Update badge
  const hTotal=DATA.habits.habits.length, hDone=DATA.habits.logs.filter(l=>l.date===today()).length;
  updateBadge(hTotal-hDone);
  renderHandBody();
}

function getStreak(habitId) {
  let streak=0, d=new Date();
  while(true) {
    const ds = d.toISOString().slice(0,10);
    if (DATA.habits.logs.some(l=>l.habitId===habitId&&l.date===ds)) { streak++; d.setDate(d.getDate()-1); }
    else break;
  }
  return streak;
}

function getBestStreak(habitId) {
  const dates = DATA.habits.logs.filter(l=>l.habitId===habitId).map(l=>l.date).sort();
  let best=0, cur=0, prev=null;
  dates.forEach(d=>{
    if (prev) {
      const diff = (new Date(d)-new Date(prev))/86400000;
      if (diff===1) cur++; else cur=1;
    } else cur=1;
    if(cur>best) best=cur; prev=d;
  });
  return best;
}

function getLast7(habitId) {
  return Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-6+i); return DATA.habits.logs.some(l=>l.habitId===habitId&&l.date===d.toISOString().slice(0,10)); });
}

function renderHandHeatmap(el) {
  const habits = DATA.habits.habits;
  if (!habits.length) { el.innerHTML='<div class="empty-state"><div class="empty-icon">✦</div><div class="empty-title">No disciplines yet</div></div>'; return; }
  el.innerHTML = habits.map(h=>{
    const logs = DATA.habits.logs.filter(l=>l.habitId===h.id);
    const logSet = new Set(logs.map(l=>l.date));
    const weeks = 13;
    const today_ = new Date(); today_.setHours(0,0,0,0);
    const cols = [];
    for (let w=weeks-1;w>=0;w--) {
      const days=[];
      for (let d=0;d<7;d++) {
        const dt = new Date(today_); dt.setDate(dt.getDate()-(w*7+(6-d)));
        const ds = dt.toISOString().slice(0,10);
        days.push(logSet.has(ds)?4:0);
      }
      cols.push(days);
    }
    const streak = getStreak(h.id);
    const total  = logs.length;
    return `<div class="section-title">${esc(h.name)}</div>
      <div class="card card-raised">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span class="text-stone text-sm">${streak} day streak</span>
          <span class="text-stone text-sm">${total} total</span>
        </div>
        <div class="heatmap-wrap">
          <div class="heatmap-inner">
            ${cols.map(days=>`<div class="heatmap-col">${days.map(v=>`<div class="heatmap-cell" data-v="${v}"></div>`).join('')}</div>`).join('')}
          </div>
        </div>
        <div class="heatmap-legend">Less <div class="heatmap-legend-cells">${[0,1,2,3,4].map(v=>`<div class="heatmap-cell" data-v="${v}" style="width:10px;height:10px"></div>`).join('')}</div> More</div>
      </div>`;
  }).join('');
}

function renderHandManage(el) {
  const habits = DATA.habits.habits;
  el.innerHTML = `<div class="card">
    ${habits.length ? habits.map(h=>`
      <div class="habit-row">
        <div class="habit-check">${h.icon||'◉'}</div>
        <div class="habit-info"><div class="habit-name">${esc(h.name)}</div></div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-xs" onclick="editHabit('${h.id}')">Edit</button>
          <button class="btn btn-xs btn-danger" onclick="deleteHabit('${h.id}')">✕</button>
        </div>
      </div>`).join('') : '<div class="empty-state"><div class="empty-icon">✦</div><div class="empty-title">No disciplines</div></div>'}
  </div>`;
}

function showAddHabit(existing={}) {
  const ICONS=['◉','✦','⬡','◈','⊕','◬','⚔','⚖','☽','☀','⊗','⌘'];
  showModal(`<div class="modal-title">${existing.id?'Edit Discipline':'New Discipline'}</div>
    <div class="form-group"><label class="form-label">Name</label><input type="text" id="hab-name" class="form-control" value="${esc(existing.name||'')}" placeholder="e.g. Morning prayer"></div>
    <div class="form-group"><label class="form-label">Icon</label>
      <div class="color-options">${ICONS.map(ic=>`<div class="color-opt ${(existing.icon||'◉')===ic?'selected':''}" style="background:var(--bg-raised);border:1px solid var(--amber-border);font-size:16px;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:var(--r);color:var(--amber)" onclick="selectHabitIcon(this,'${ic}')">${ic}</div>`).join('')}</div>
    </div>
    <div class="form-group"><label class="form-label">Grace days/week (allowed misses)</label>
      <select id="hab-grace" class="form-control">
        ${[0,1,2].map(n=>`<option value="${n}" ${(existing.grace||0)===n?'selected':''}>${n===0?'None':n+' day'+(n>1?'s':'')}</option>`).join('')}
      </select>
    </div>
    <button class="btn btn-primary btn-full" onclick="saveHabit('${existing.id||''}')">Save</button>`);
  document.getElementById('hab-name').focus();
}

let _habitIcon = '◉';
function selectHabitIcon(el, icon) {
  document.querySelectorAll('.color-opt').forEach(e=>e.classList.remove('selected'));
  el.classList.add('selected'); _habitIcon=icon;
}

function saveHabit(id) {
  const name = document.getElementById('hab-name').value.trim();
  if (!name) { toast('Enter a name'); return; }
  const grace = parseInt(document.getElementById('hab-grace').value)||0;
  if (id) { const h=DATA.habits.habits.find(x=>x.id===id); if(h){h.name=name;h.icon=_habitIcon;h.grace=grace;} }
  else DATA.habits.habits.push({ id:uid(), name, icon:_habitIcon, grace, createdAt:today() });
  saveData(); hideModal(); toast('◈ Discipline saved'); renderHand();
}

function editHabit(id) { const h=DATA.habits.habits.find(x=>x.id===id); if(h){_habitIcon=h.icon||'◉'; showAddHabit(h);} }
function deleteHabit(id) { DATA.habits.habits=DATA.habits.habits.filter(h=>h.id!==id); DATA.habits.logs=DATA.habits.logs.filter(l=>l.habitId!==id); saveData(); renderHand(); toast('Removed'); }

function showHabitReminder(habitId) {
  const h = DATA.habits.habits.find(x=>x.id===habitId);
  const cur = CONFIG.habitReminderTimes[habitId]||'';
  showModal(`<div class="modal-title">Reminder — ${esc(h?.name||'')}</div>
    <div class="form-group"><label class="form-label">Reminder time</label><input type="time" id="rem-time" class="form-control" value="${cur}"></div>
    <div class="form-hint">Requires notifications permission.</div>
    <button class="btn btn-primary btn-full mt-12" onclick="saveHabitReminder('${habitId}')">Set Reminder</button>
    ${cur?`<button class="btn btn-danger btn-full mt-8" onclick="clearHabitReminder('${habitId}')">Remove Reminder</button>`:''}
  `);
}

function saveHabitReminder(habitId) {
  const time = document.getElementById('rem-time').value;
  if (!time) { toast('Select a time'); return; }
  if (!CONFIG.notificationsEnabled) { requestNotificationPermission().then(ok=>{ if(ok){CONFIG.habitReminderTimes[habitId]=time; saveConfig(); hideModal(); toast('Reminder set'); scheduleHabitReminders();} }); return; }
  CONFIG.habitReminderTimes[habitId]=time; saveConfig(); hideModal(); toast('Reminder set'); scheduleHabitReminders();
}

function clearHabitReminder(habitId) { delete CONFIG.habitReminderTimes[habitId]; saveConfig(); hideModal(); toast('Reminder removed'); }

function scheduleHabitReminders() {
  if (!CONFIG.notificationsEnabled) return;
  const now = new Date();
  Object.entries(CONFIG.habitReminderTimes).forEach(([habitId, time])=>{
    const [hh,mm] = time.split(':').map(Number);
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, 0);
    if (target <= now) target.setDate(target.getDate()+1);
    const delay = target - now;
    const h = DATA.habits.habits.find(x=>x.id===habitId);
    if (h) scheduleNotification('The Hand', `${h.name} — your discipline awaits`, 'habit-'+habitId, 'hand', delay);
  });
}

/* ══════════════════════════════════════════════════
   LORD COMMANDER — Gym
══════════════════════════════════════════════════ */
function renderCommander() {
  const el = document.getElementById('tab-commander');
  const views=['log','new','templates','body'];
  const labels=['Sessions','Train','Templates','Body'];
  const v=STATE.gymView;
  el.innerHTML = modHeader('Lord Commander','The Yard','Physical readiness — the body in service of the mind')+
    `<div class="mod-tabs">${labels.map((l,i)=>`<button class="mod-tab ${v===views[i]?'active':''}" onclick="setGymView('${views[i]}')">${l}</button>`).join('')}</div>
    <div id="gym-body"></div>`;
  renderGymBody();
}

function setGymView(v) { STATE.gymView=v; renderCommander(); }

function renderGymBody() {
  const el=document.getElementById('gym-body'); if(!el) return;
  const v=STATE.gymView;
  if(v==='log')       renderGymLog(el);
  if(v==='new')       renderGymNew(el);
  if(v==='templates') renderGymTemplates(el);
  if(v==='body')      renderGymBody2(el);
}

function renderGymLog(el) {
  const sessions = DATA.gym.sessions;
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
  const thisWeek = sessions.filter(s=>new Date(s.date)>=weekAgo).length;
  const totalVol  = sessions.slice(0,10).reduce((a,s)=>a+(s.volume||0),0);

  el.innerHTML = `
    <div class="gym-stats-row">
      <div class="gym-stat-box"><div class="gym-stat-val">${thisWeek}</div><div class="gym-stat-label">This week</div></div>
      <div class="gym-stat-box"><div class="gym-stat-val">${sessions.length}</div><div class="gym-stat-label">Total</div></div>
      <div class="gym-stat-box"><div class="gym-stat-val">${sessions.length>0?Math.round(sessions.reduce((a,s)=>a+(s.durationMin||0),0)/sessions.length):0}m</div><div class="gym-stat-label">Avg duration</div></div>
    </div>
    <div class="card">
      ${sessions.length ? sessions.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,20).map(s=>`
        <div class="workout-item">
          <div class="workout-header">
            <div>
              <div class="workout-type">${esc(s.type)}</div>
              <div class="workout-meta">
                ${formatDate(s.date)}
                ${s.durationMin?` · ${fmtMin(s.durationMin)}`:''}
                ${s.volume?`<span class="workout-vol">${s.volume.toLocaleString()} kg total</span>`:''}
              </div>
            </div>
            <button class="btn btn-xs btn-danger" onclick="deleteSession('${s.id}')">✕</button>
          </div>
          ${(s.exercises||[]).map(e=>`
            <div class="exercise-row">
              <div class="exercise-name">${esc(e.name)}</div>
              <div class="exercise-sets">${e.sets.length} sets</div>
              ${e.isPR?'<span class="pr-badge">PR</span>':''}
            </div>`).join('')}
        </div>`).join('') : '<div class="empty-state"><div class="empty-icon">⚔️</div><div class="empty-title">No sessions yet</div><div class="empty-sub">Begin your first training session</div></div>'}
    </div>`;
}

function deleteSession(id) { DATA.gym.sessions=DATA.gym.sessions.filter(s=>s.id!==id); saveData(); renderGymBody(); }

let _currentSession = null;
function renderGymNew(el) {
  if (!_currentSession) _currentSession = { id:uid(), type:'Push', date:today(), exercises:[], startTime:Date.now(), durationMin:0 };
  const s = _currentSession;
  requestWakeLock();

  el.innerHTML = `
    <div class="form-row mb-12">
      <div class="form-group"><label class="form-label">Type</label>
        <select class="form-control" id="sess-type" onchange="_currentSession.type=this.value">
          ${DATA.gym.workoutTypes.map(t=>`<option ${s.type===t?'selected':''}>${t}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Date</label>
        <input type="date" id="sess-date" class="form-control" value="${s.date}" onchange="_currentSession.date=this.value">
      </div>
    </div>
    <div id="exercises-list">
      ${s.exercises.map((e,ei)=>renderExerciseBlock(e,ei)).join('')}
    </div>
    <button class="btn btn-sm btn-full mb-12" onclick="addExercise()">⊕ Add Exercise</button>
    <button class="btn btn-primary btn-full" onclick="finishSession()">◈ Finish Session</button>`;
}

function renderExerciseBlock(e, ei) {
  return `<div class="card card-raised mb-8" id="exblock-${ei}">
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
      <input type="text" class="form-control" style="flex:1" value="${esc(e.name)}" placeholder="Exercise name" oninput="_currentSession.exercises[${ei}].name=this.value">
      <button class="btn btn-xs" onclick="startRestTimer('${esc(e.name)}')">⏱</button>
      <button class="btn btn-xs btn-danger" onclick="removeExercise(${ei})">✕</button>
    </div>
    <div class="set-builder">
      <div class="set-row" style="font-family:var(--cairo);font-size:9px;color:var(--text-stone);background:var(--bg-stone)">
        <div>#</div><div style="text-align:center">kg</div><div style="text-align:center">Reps</div><div style="text-align:center">RPE</div><div></div>
      </div>
      ${e.sets.map((set,si)=>`<div class="set-row">
        <div class="set-num">${si+1}</div>
        <input type="number" class="set-input" value="${set.weight||''}" placeholder="—" inputmode="decimal" oninput="_currentSession.exercises[${ei}].sets[${si}].weight=+this.value;checkPR(${ei},${si})">
        <input type="number" class="set-input" value="${set.reps||''}" placeholder="—" inputmode="numeric" oninput="_currentSession.exercises[${ei}].sets[${si}].reps=+this.value">
        <input type="number" class="set-input" value="${set.rpe||''}" placeholder="—" min="1" max="10" inputmode="numeric" oninput="_currentSession.exercises[${ei}].sets[${si}].rpe=+this.value">
        <button class="set-del-btn" onclick="removeSet(${ei},${si})">✕</button>
      </div>`).join('')}
    </div>
    <button class="btn btn-xs mt-8" onclick="addSet(${ei})">+ Set</button>
  </div>`;
}

function addExercise() { _currentSession.exercises.push({name:'',sets:[{weight:null,reps:null,rpe:null}],isPR:false}); renderGymBody(); }
function removeExercise(i) { _currentSession.exercises.splice(i,1); renderGymBody(); }
function addSet(ei) { _currentSession.exercises[ei].sets.push({weight:null,reps:null,rpe:null}); renderGymBody(); }
function removeSet(ei,si) { _currentSession.exercises[ei].sets.splice(si,1); renderGymBody(); }

function checkPR(ei, si) {
  const e   = _currentSession.exercises[ei];
  const set = e.sets[si];
  if (!set.weight||!set.reps) return;
  const vol = set.weight*set.reps;
  // compare vs all past sessions
  const allSessions = DATA.gym.sessions;
  let bestVol = 0;
  allSessions.forEach(s=>s.exercises?.forEach(ex=>{ if(ex.name.toLowerCase()===e.name.toLowerCase()) ex.sets?.forEach(st=>{ if((st.weight||0)*(st.reps||0)>bestVol) bestVol=(st.weight||0)*(st.reps||0); }); }));
  if (vol > bestVol) { e.isPR=true; toast(`🏆 PR — ${e.name||'Exercise'}!`); vibrate([100,50,100,50,300]); }
}

function finishSession() {
  if (!_currentSession) return;
  const dur = Math.round((Date.now()-_currentSession.startTime)/60000);
  _currentSession.durationMin = dur;
  // compute total volume
  let vol=0;
  _currentSession.exercises.forEach(e=>e.sets.forEach(s=>{ vol+=(s.weight||0)*(s.reps||0); }));
  _currentSession.volume = Math.round(vol);
  DATA.gym.sessions.unshift(_currentSession);
  _currentSession=null;
  saveData(); STATE.gymView='log'; releaseWakeLock(); toast(`◈ Session saved · ${fmtMin(dur)}`); renderCommander();
  if (CONFIG.notificationsEnabled) scheduleNotification('Lord Commander','Session recorded. The yard is dismissed.','gym-done','commander',500);
}

function renderGymTemplates(el) {
  const templates = DATA.gym.templates||[];
  el.innerHTML = `
    <div class="section-title">Saved Templates</div>
    ${templates.length ? templates.map(t=>`
      <div class="template-card">
        <div>
          <div class="template-name">${esc(t.name)}</div>
          <div class="template-meta">${t.exercises?.length||0} exercises · ${esc(t.type)}</div>
        </div>
        <div class="template-actions">
          <button class="btn btn-xs btn-primary" onclick="loadTemplate('${t.id}')">Load</button>
          <button class="btn btn-xs btn-danger" onclick="deleteTemplate('${t.id}')">✕</button>
        </div>
      </div>`).join('') : '<div class="empty-state"><div class="empty-icon">⚔</div><div class="empty-title">No templates</div><div class="empty-sub">Finish a session, then save it as a template</div></div>'}
    ${DATA.gym.sessions.length?`<div class="section-title mt-16">Save Last Session as Template</div>
      <div class="card">
        <div class="form-group"><label class="form-label">Template name</label><input type="text" id="tmpl-name" class="form-control" placeholder="e.g. Push Day A"></div>
        <button class="btn btn-sm btn-full" onclick="saveAsTemplate()">Save Template</button>
      </div>`:''}`;
}

function saveAsTemplate() {
  const name = document.getElementById('tmpl-name')?.value?.trim();
  if (!name) { toast('Enter a name'); return; }
  const last = DATA.gym.sessions[0];
  if (!last) return;
  if (!DATA.gym.templates) DATA.gym.templates=[];
  DATA.gym.templates.push({ id:uid(), name, type:last.type, exercises:last.exercises.map(e=>({name:e.name,sets:[{weight:null,reps:null,rpe:null}]})) });
  saveData(); toast('Template saved'); renderGymBody();
}

function loadTemplate(id) {
  const t = DATA.gym.templates.find(x=>x.id===id);
  if (!t) return;
  _currentSession = { id:uid(), type:t.type, date:today(), exercises:JSON.parse(JSON.stringify(t.exercises)), startTime:Date.now(), durationMin:0 };
  STATE.gymView='new'; renderCommander(); toast('Template loaded');
}

function deleteTemplate(id) { DATA.gym.templates=DATA.gym.templates.filter(t=>t.id!==id); saveData(); renderGymBody(); }

function renderGymBody2(el) {
  const logs = DATA.gym.bodyLogs||[];
  el.innerHTML = `
    <div class="section-title">Body Measurements</div>
    <div class="card mb-12">
      <div class="form-row">
        <div class="form-group"><label class="form-label">Weight (kg)</label><input type="number" id="body-weight" class="form-control" placeholder="0.0" step="0.1" inputmode="decimal"></div>
        <div class="form-group"><label class="form-label">Date</label><input type="date" id="body-date" class="form-control" value="${today()}"></div>
      </div>
      <div class="form-row-3">
        <div class="form-group"><label class="form-label">Chest</label><input type="number" id="body-chest" class="form-control" placeholder="cm" inputmode="decimal"></div>
        <div class="form-group"><label class="form-label">Waist</label><input type="number" id="body-waist" class="form-control" placeholder="cm" inputmode="decimal"></div>
        <div class="form-group"><label class="form-label">Hips</label><input type="number" id="body-hips" class="form-control" placeholder="cm" inputmode="decimal"></div>
      </div>
      <button class="btn btn-primary btn-full" onclick="saveBodyLog()">Record</button>
    </div>
    ${logs.length ? `<div class="card">${logs.slice().reverse().map((l,i,arr)=>{
      const prev = arr[i+1];
      const delta = prev && l.weight && prev.weight ? l.weight-prev.weight : null;
      return `<div class="body-log-row">
        <div class="body-log-date">${formatDate(l.date)}</div>
        <div style="flex:1">
          <div class="body-log-weight">${l.weight||'—'}kg${delta!==null?`<span class="body-log-delta ${delta<0?'neg':'pos'}"> ${delta>0?'+':''}${delta.toFixed(1)}</span>`:''}</div>
          ${l.chest||l.waist||l.hips?`<div class="body-meas">
            ${l.chest?`<span class="body-meas-chip">Chest ${l.chest}cm</span>`:''}
            ${l.waist?`<span class="body-meas-chip">Waist ${l.waist}cm</span>`:''}
            ${l.hips?`<span class="body-meas-chip">Hips ${l.hips}cm</span>`:''}
          </div>`:''}
        </div>
        <button class="tx-del" onclick="deleteBodyLog('${l.id}')">✕</button>
      </div>`;
    }).join('')}</div>` : '<div class="empty-state"><div class="empty-icon">⬡</div><div class="empty-title">No measurements yet</div></div>'}`;
}

function saveBodyLog() {
  const weight = parseFloat(document.getElementById('body-weight').value);
  if (!weight) { toast('Enter weight'); return; }
  if (!DATA.gym.bodyLogs) DATA.gym.bodyLogs=[];
  DATA.gym.bodyLogs.push({ id:uid(), date:document.getElementById('body-date').value, weight, chest:parseFloat(document.getElementById('body-chest').value)||null, waist:parseFloat(document.getElementById('body-waist').value)||null, hips:parseFloat(document.getElementById('body-hips').value)||null });
  saveData(); toast('◈ Recorded'); renderGymBody();
}

function deleteBodyLog(id) { DATA.gym.bodyLogs=DATA.gym.bodyLogs.filter(l=>l.id!==id); saveData(); renderGymBody(); }

/* ── REST TIMER ── */
function startRestTimer(exercise='') {
  STATE.restTimer = { running:true, seconds:CONFIG.restTimerDuration, interval:null, exercise };
  document.getElementById('rest-exercise').textContent = exercise;
  document.getElementById('rest-overlay').classList.remove('hidden');
  STATE.restTimer.interval = setInterval(()=>{
    STATE.restTimer.seconds--;
    document.getElementById('rest-clock').textContent = fmtSec(STATE.restTimer.seconds);
    if (STATE.restTimer.seconds <= 0) { skipRest(true); }
  }, 1000);
  vibrate([30]);
}

function skipRest(done=false) {
  clearInterval(STATE.restTimer.interval);
  document.getElementById('rest-overlay').classList.add('hidden');
  if (done) { vibrate([200,100,200]); toast('◈ Rest complete'); if(CONFIG.notificationsEnabled) scheduleNotification('Lord Commander',`Rest over — ${STATE.restTimer.exercise||'next set'} awaits`,'rest-done','commander',0); }
}

/* ══════════════════════════════════════════════════
   GRAND MAESTER — Study / The Library
══════════════════════════════════════════════════ */
function renderMaester() {
  const el = document.getElementById('tab-maester');
  const views=['timer','log','books','spaced','goals'];
  const labels=['Timer','Sessions','Reading','Review','Goals'];
  const v=STATE.studyView;
  el.innerHTML = modHeader('Grand Maester','The Library','Knowledge recorded — sessions, books, spaced review')+
    `<div class="mod-tabs">${labels.map((l,i)=>`<button class="mod-tab ${v===views[i]?'active':''}" onclick="setStudyView('${views[i]}')">${l}</button>`).join('')}</div>
    <div id="maester-body"></div>`;
  addFAB('+', ()=>STATE.studyView==='books'?showAddBook():STATE.studyView==='spaced'?showAddSpaced():showAddSession());
  renderMaesterBody();
}

function setStudyView(v) { STATE.studyView=v; renderMaester(); }

function renderMaesterBody() {
  const el=document.getElementById('maester-body'); if(!el) return;
  const v=STATE.studyView;
  if(v==='timer')  renderMaesterTimer(el);
  if(v==='log')    renderMaesterLog(el);
  if(v==='books')  renderMaesterBooks(el);
  if(v==='spaced') renderMaesterSpaced(el);
  if(v==='goals')  renderMaesterGoals(el);
}

const POMODORO_PHASES = ['focus','short-break','focus','short-break','focus','short-break','focus','long-break'];
const PHASE_LABELS = { 'focus':'Focus','short-break':'Short Break','long-break':'Long Break' };

function renderMaesterTimer(el) {
  const t = STATE.studyTimer;
  const subjects = DATA.study.subjects;
  const cycle = t.cycle % 8;
  const phase = POMODORO_PHASES[cycle];
  const totalToday = DATA.study.sessions.filter(s=>s.date===today()).reduce((a,s)=>a+s.durationMin,0);

  el.innerHTML = `
    <div class="timer-display">
      <div class="timer-cycles">${POMODORO_PHASES.map((p,i)=>`<div class="timer-cycle ${i<t.cycle%8?'done':i===t.cycle%8?'active':''}"></div>`).join('')}</div>
      <div class="timer-phase ${phase}">${PHASE_LABELS[phase]||phase}</div>
      <div class="timer-clock">${fmtSec(t.seconds || getPhaseSeconds())}</div>
      <div class="timer-label">${t.subject?esc(t.subject):'Select a subject below'}</div>
      <div class="timer-controls">
        ${t.running
          ? `<button class="btn btn-danger" onclick="pauseTimer()">⏸ Pause</button>
             <button class="btn" onclick="stopTimer()">◼ Stop</button>`
          : `<button class="btn btn-primary" onclick="startTimer()">▶ ${t.seconds>0&&t.seconds<getPhaseSeconds()?'Resume':'Start'}</button>
             ${t.cycle>0?`<button class="btn" onclick="resetTimer()">Reset</button>`:''}`}
      </div>
    </div>
    <div class="form-group mt-12">
      <label class="form-label">Subject</label>
      <select class="form-control" onchange="STATE.studyTimer.subject=this.value">
        <option value="">— Select —</option>
        ${subjects.map(s=>`<option value="${s.name}" ${t.subject===s.name?'selected':''}>${esc(s.name)}</option>`).join('')}
        ${subjects.length?'':`<option disabled>Add subjects in Goals tab</option>`}
      </select>
    </div>
    <div class="card card-teal mt-8" style="text-align:center;padding:10px">
      <div class="text-stone text-xs">Today's study</div>
      <div class="text-amber" style="font-family:var(--kufi);font-size:20px">${fmtMin(totalToday)}</div>
    </div>`;
}

function getPhaseSeconds() {
  const phase = POMODORO_PHASES[STATE.studyTimer.cycle%8];
  if (phase==='focus')       return CONFIG.pomodoroFocus*60;
  if (phase==='short-break') return CONFIG.pomodoroShortBreak*60;
  if (phase==='long-break')  return CONFIG.pomodoroLongBreak*60;
  return CONFIG.pomodoroFocus*60;
}

function startTimer() {
  const t = STATE.studyTimer;
  if (!t.subject) { toast('Select a subject first'); return; }
  if (!t.seconds || t.seconds === 0) t.seconds = getPhaseSeconds();
  t.running = true;
  t._startedAt = Date.now();
  t._phaseSecs = t.seconds;
  requestWakeLock();
  t.interval = setInterval(() => {
    t.seconds--;
    const clk = document.getElementById ? document.querySelector('.timer-clock') : null;
    if (clk) clk.textContent = fmtSec(t.seconds);
    if (t.seconds <= 0) advancePomodoro();
  }, 1000);
  renderMaesterBody();
}

function pauseTimer() {
  clearInterval(STATE.studyTimer.interval);
  STATE.studyTimer.running=false; releaseWakeLock(); renderMaesterBody();
}

function stopTimer() {
  const t = STATE.studyTimer;
  clearInterval(t.interval);
  const phase = POMODORO_PHASES[t.cycle%8];
  if (phase==='focus' && t.subject) {
    const elapsed = Math.round((getPhaseSeconds()-t.seconds)/60);
    if (elapsed > 0) { saveStudySession(t.subject, elapsed); }
  }
  t.running=false; t.seconds=0; t.cycle=0; releaseWakeLock(); renderMaesterBody();
}

function resetTimer() { STATE.studyTimer.seconds=0; STATE.studyTimer.cycle=0; renderMaesterBody(); }

function advancePomodoro() {
  const t = STATE.studyTimer;
  clearInterval(t.interval); t.running=false;
  const phase = POMODORO_PHASES[t.cycle%8];
  // Save if it was a focus phase
  if (phase==='focus' && t.subject) saveStudySession(t.subject, CONFIG.pomodoroFocus);
  vibrate([200,100,200]);
  const next = POMODORO_PHASES[(t.cycle+1)%8];
  if (CONFIG.notificationsEnabled) scheduleNotification('Grand Maester', phase==='focus'?`Focus complete. ${PHASE_LABELS[next]} begins.`:'Break over. Back to work.', 'pomodoro', 'maester', 0);
  t.cycle++; t.seconds=getPhaseSeconds(); releaseWakeLock();
  showSessionNotePrompt(t.subject);
}

function showSessionNotePrompt(subject) {
  showModal(`<div class="modal-title">◈ Session Note</div>
    <div class="form-hint mb-12">What did you understand? What remains unclear?</div>
    <div class="form-group"><textarea id="sess-note" class="form-control" rows="4" placeholder="Write your note..."></textarea></div>
    <button class="btn btn-primary btn-full" onclick="saveSessionNote('${esc(subject)}')">Save Note</button>
    <button class="btn btn-full mt-8" onclick="hideModal();renderMaesterBody()">Skip</button>`);
}

function saveSessionNote(subject) {
  const note = document.getElementById('sess-note')?.value?.trim();
  const last = DATA.study.sessions.find(s=>s.subject===subject&&s.date===today());
  if (last && note) last.note = note;
  saveData(); hideModal(); renderMaesterBody();
}

function saveStudySession(subject, durationMin) {
  DATA.study.sessions.push({ id:uid(), subject, durationMin, date:today(), mode:'pomodoro' });
  saveData(); toast(`◈ ${fmtMin(durationMin)} — ${subject}`);
}

function renderMaesterLog(el) {
  const sessions = DATA.study.sessions;
  const subjects = DATA.study.subjects;
  if (!sessions.length) { el.innerHTML='<div class="empty-state"><div class="empty-icon">⊕</div><div class="empty-title">No sessions logged</div><div class="empty-sub">Use the timer or log manually</div></div>'; return; }
  const byDate = {};
  sessions.forEach(s=>{ (byDate[s.date]=byDate[s.date]||[]).push(s); });
  el.innerHTML = `
    <div class="summary-bar mb-12">
      <div class="summary-cell"><div class="summary-cell-label">Today</div><div class="summary-cell-val text-amber">${fmtMin(sessions.filter(s=>s.date===today()).reduce((a,s)=>a+s.durationMin,0))}</div></div>
      <div class="summary-cell"><div class="summary-cell-label">This week</div><div class="summary-cell-val text-amber">${fmtMin(sessions.filter(s=>{const d=new Date(s.date),w=new Date();w.setDate(w.getDate()-7);return d>=w;}).reduce((a,s)=>a+s.durationMin,0))}</div></div>
      <div class="summary-cell"><div class="summary-cell-label">Sessions</div><div class="summary-cell-val">${sessions.length}</div></div>
    </div>
    ${Object.keys(byDate).sort().reverse().slice(0,14).map(date=>`
      <div class="section-title">${formatDateFull(date)}</div>
      <div class="card">
        ${byDate[date].map(s=>{
          const sub = subjects.find(x=>x.name===s.subject)||{color:'#B87818'};
          return `<div class="session-row">
            <div class="session-dot" style="background:${sub.color}"></div>
            <div class="session-info">
              <div class="session-subject">${esc(s.subject)}</div>
              ${s.topic?`<div class="session-topic">${esc(s.topic)}</div>`:''}
              ${s.note?`<div class="session-topic text-stone" style="font-style:italic">${esc(s.note.slice(0,80))}${s.note.length>80?'…':''}</div>`:''}
            </div>
            <div class="session-dur">${fmtMin(s.durationMin)}</div>
            <button class="tx-del" onclick="deleteStudySession('${s.id}')">✕</button>
          </div>`;
        }).join('')}
      </div>`).join('')}`;
}

function deleteStudySession(id) { DATA.study.sessions=DATA.study.sessions.filter(s=>s.id!==id); saveData(); renderMaesterBody(); }

function showAddSession() {
  const subjects = DATA.study.subjects;
  showModal(`<div class="modal-title">Log Study Session</div>
    <div class="form-group"><label class="form-label">Subject</label>
      <select id="ms-sub" class="form-control">
        ${subjects.map(s=>`<option value="${esc(s.name)}">${esc(s.name)}</option>`).join('')}
      </select></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Duration (min)</label><input type="number" id="ms-dur" class="form-control" placeholder="25" min="1" inputmode="numeric"></div>
      <div class="form-group"><label class="form-label">Date</label><input type="date" id="ms-date" class="form-control" value="${today()}"></div>
    </div>
    <div class="form-group"><label class="form-label">Topic</label><input type="text" id="ms-topic" class="form-control" placeholder="What did you study?"></div>
    <div class="form-group"><label class="form-label">Note</label><textarea id="ms-note" class="form-control" placeholder="Understanding / open questions..."></textarea></div>
    <button class="btn btn-primary btn-full" onclick="submitSession()">Log Session</button>`);
}

function submitSession() {
  const dur = parseInt(document.getElementById('ms-dur').value);
  if (!dur||dur<1) { toast('Enter duration'); return; }
  DATA.study.sessions.push({ id:uid(), subject:document.getElementById('ms-sub').value, durationMin:dur, date:document.getElementById('ms-date').value, topic:document.getElementById('ms-topic').value, note:document.getElementById('ms-note').value, mode:'manual' });
  saveData(); hideModal(); toast('◈ Session logged'); renderMaester();
}

function renderMaesterBooks(el) {
  const books = DATA.study.books||[];
  el.innerHTML = `
    ${books.length ? books.map(b=>{
      const pct = b.totalPages>0?Math.min(1,b.currentPage/b.totalPages):0;
      const sub = DATA.study.subjects.find(s=>s.name===b.subject);
      return `<div class="reading-item">
        <div class="reading-spine" style="background:${sub?.color||'var(--amber)'}"></div>
        <div class="reading-info">
          <div class="reading-title">${esc(b.title)}</div>
          <div class="reading-author">${esc(b.author||'')}</div>
          <div class="reading-subject">${esc(b.subject||'')}</div>
          <div class="reading-progress">p. ${b.currentPage||0} / ${b.totalPages||'?'}</div>
          <div class="reading-prog-bar"><div class="reading-prog-fill" style="background:${sub?.color||'var(--amber)'};width:${pct*100}%"></div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">
          <button class="btn btn-xs" onclick="updateBookPage('${b.id}')">Update</button>
          <button class="btn btn-xs btn-danger" onclick="deleteBook('${b.id}')">✕</button>
        </div>
      </div>`;
    }).join('') : '<div class="empty-state"><div class="empty-icon">⊕</div><div class="empty-title">No books</div><div class="empty-sub">Tap + to add a book</div></div>'}`;
}

function showAddBook() {
  const subjects = DATA.study.subjects;
  showModal(`<div class="modal-title">Add Book</div>
    <div class="form-group"><label class="form-label">Title</label><input type="text" id="bk-title" class="form-control" placeholder="Book title"></div>
    <div class="form-group"><label class="form-label">Author</label><input type="text" id="bk-author" class="form-control" placeholder="Author name"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Subject</label>
        <select id="bk-sub" class="form-control"><option value="">—</option>${subjects.map(s=>`<option>${esc(s.name)}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Total pages</label><input type="number" id="bk-pages" class="form-control" placeholder="0" min="0" inputmode="numeric"></div>
    </div>
    <button class="btn btn-primary btn-full" onclick="saveBook()">Add</button>`);
}

function saveBook() {
  const title = document.getElementById('bk-title').value.trim();
  if (!title) { toast('Enter title'); return; }
  if (!DATA.study.books) DATA.study.books=[];
  DATA.study.books.push({ id:uid(), title, author:document.getElementById('bk-author').value.trim(), subject:document.getElementById('bk-sub').value, totalPages:parseInt(document.getElementById('bk-pages').value)||0, currentPage:0 });
  saveData(); hideModal(); toast('◈ Book added'); renderMaester();
}

function updateBookPage(id) {
  const b = DATA.study.books.find(x=>x.id===id);
  showModal(`<div class="modal-title">Update — ${esc(b.title)}</div>
    <div class="form-group"><label class="form-label">Current page</label><input type="number" id="bk-pg" class="form-control" value="${b.currentPage||0}" min="0" max="${b.totalPages||9999}" inputmode="numeric"></div>
    <button class="btn btn-primary btn-full" onclick="commitBookPage('${id}')">Update</button>`);
}

function commitBookPage(id) {
  const b = DATA.study.books.find(x=>x.id===id);
  const pg = parseInt(document.getElementById('bk-pg').value)||0;
  b.currentPage = pg;
  if (b.totalPages && pg >= b.totalPages) { toast('◈ Book complete!'); vibrate([200,100,200]); }
  saveData(); hideModal(); renderMaester();
}

function deleteBook(id) { DATA.study.books=DATA.study.books.filter(b=>b.id!==id); saveData(); renderMaester(); }

function renderMaesterSpaced(el) {
  const items = DATA.study.spacedItems||[];
  const today_ = today();
  const INTERVALS = [1,3,7,14,30];

  const sorted = items.slice().sort((a,b)=>{
    const aNext = a.nextReview||today_; const bNext = b.nextReview||today_;
    return aNext.localeCompare(bNext);
  });

  el.innerHTML = `
    ${sorted.length ? sorted.map(item=>{
      const isOverdue = item.nextReview && item.nextReview < today_;
      const isToday   = item.nextReview === today_;
      return `<div class="spaced-item">
        <div class="spaced-info">
          <div class="spaced-topic">${esc(item.topic)}</div>
          <div class="spaced-subject">${esc(item.subject||'')} · ${INTERVALS[Math.min(item.interval||0,4)]}d interval</div>
        </div>
        <div class="spaced-due ${isOverdue?'overdue':isToday?'today':'soon'}">${isOverdue?'Overdue':isToday?'Today':formatDate(item.nextReview)}</div>
        ${isOverdue||isToday?`<button class="btn btn-xs btn-success" onclick="markReviewed('${item.id}')">Done</button>`:''}
        <button class="tx-del" onclick="deleteSpaced('${item.id}')">✕</button>
      </div>`;
    }).join('') : '<div class="empty-state"><div class="empty-icon">⊕</div><div class="empty-title">No review items</div><div class="empty-sub">Tap + to add a topic for spaced repetition</div></div>'}`;
}

function showAddSpaced() {
  showModal(`<div class="modal-title">Add Review Topic</div>
    <div class="form-group"><label class="form-label">Topic</label><input type="text" id="sp-topic" class="form-control" placeholder="e.g. Al-Kindī's argument on sorrows"></div>
    <div class="form-group"><label class="form-label">Subject</label>
      <select id="sp-sub" class="form-control"><option value="">—</option>${DATA.study.subjects.map(s=>`<option>${esc(s.name)}</option>`).join('')}</select></div>
    <button class="btn btn-primary btn-full" onclick="saveSpaced()">Add</button>`);
}

function saveSpaced() {
  const topic = document.getElementById('sp-topic').value.trim();
  if (!topic) { toast('Enter topic'); return; }
  if (!DATA.study.spacedItems) DATA.study.spacedItems=[];
  const nextRev = new Date(); nextRev.setDate(nextRev.getDate()+1);
  DATA.study.spacedItems.push({ id:uid(), topic, subject:document.getElementById('sp-sub').value, interval:0, nextReview:nextRev.toISOString().slice(0,10) });
  saveData(); hideModal(); toast('◈ Review scheduled'); renderMaester();
}

function markReviewed(id) {
  const INTERVALS=[1,3,7,14,30];
  const item = DATA.study.spacedItems.find(x=>x.id===id);
  if (!item) return;
  item.interval = Math.min((item.interval||0)+1, INTERVALS.length-1);
  const next = new Date(); next.setDate(next.getDate()+INTERVALS[item.interval]);
  item.nextReview = next.toISOString().slice(0,10);
  item.lastReviewed = today();
  saveData(); toast(`Next review: ${formatDate(item.nextReview)}`); renderMaester();
  if (CONFIG.notificationsEnabled) scheduleNotification('Grand Maester',`Review: ${item.topic}`,'spaced-'+item.id,'maester',(next-new Date()));
}

function deleteSpaced(id) { DATA.study.spacedItems=DATA.study.spacedItems.filter(x=>x.id!==id); saveData(); renderMaester(); }

function renderMaesterGoals(el) {
  const subjects = DATA.study.subjects;
  el.innerHTML = `
    <div class="section-title">Subjects & Weekly Goals</div>
    ${subjects.map(s=>{
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
      const weekMin = DATA.study.sessions.filter(x=>x.subject===s.name&&new Date(x.date)>=weekAgo).reduce((a,x)=>a+x.durationMin,0);
      const pct = s.weeklyGoalMin>0?Math.min(1,weekMin/s.weeklyGoalMin):0;
      return `<div class="goal-row">
        <div class="goal-row-label">
          <div class="goal-row-name" style="color:${s.color}">${esc(s.name)}</div>
          <div class="goal-row-hours">${fmtMin(weekMin)} / ${fmtMin(s.weeklyGoalMin)} this week</div>
          <div class="prog-bar-wrap"><div class="prog-bar-fill" style="background:${s.color};width:${pct*100}%"></div></div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-xs" onclick="editSubject('${s.id}')">Edit</button>
          <button class="btn btn-xs btn-danger" onclick="deleteSubject('${s.id}')">✕</button>
        </div>
      </div>`;
    }).join('')}
    <button class="btn btn-primary btn-full mt-12" onclick="showAddSubject()">⊕ New Subject</button>`;
}

const SUBJECT_COLORS=['#B87818','#4272C8','#22987A','#B83040','#20A0B8','#8E44AD','#E67E22','#27AE60'];

function showAddSubject(existing={}) {
  showModal(`<div class="modal-title">${existing.id?'Edit':'New'} Subject</div>
    <div class="form-group"><label class="form-label">Name</label><input type="text" id="sub-name" class="form-control" value="${esc(existing.name||'')}" placeholder="e.g. Philosophy"></div>
    <div class="form-group"><label class="form-label">Weekly goal (minutes)</label><input type="number" id="sub-goal" class="form-control" value="${existing.weeklyGoalMin||60}" min="0" inputmode="numeric"></div>
    <div class="form-group"><label class="form-label">Colour</label>
      <div class="color-options">${SUBJECT_COLORS.map(c=>`<div class="color-opt ${(existing.color||SUBJECT_COLORS[0])===c?'selected':''}" style="background:${c}" onclick="selectSubjectColor(this,'${c}')"></div>`).join('')}</div>
    </div>
    <button class="btn btn-primary btn-full" onclick="saveSubject('${existing.id||''}')">Save</button>`);
}

let _subjectColor = SUBJECT_COLORS[0];
function selectSubjectColor(el, color) { document.querySelectorAll('.color-opt').forEach(e=>e.classList.remove('selected')); el.classList.add('selected'); _subjectColor=color; }
function editSubject(id) { const s=DATA.study.subjects.find(x=>x.id===id); if(s){_subjectColor=s.color; showAddSubject(s);} }

function saveSubject(id) {
  const name = document.getElementById('sub-name').value.trim();
  const goal = parseInt(document.getElementById('sub-goal').value)||60;
  if (!name) { toast('Enter name'); return; }
  if (id) { const s=DATA.study.subjects.find(x=>x.id===id); if(s){s.name=name;s.weeklyGoalMin=goal;s.color=_subjectColor;} }
  else DATA.study.subjects.push({ id:uid(), name, weeklyGoalMin:goal, color:_subjectColor });
  saveData(); hideModal(); toast('Subject saved'); renderMaester();
}

function deleteSubject(id) { DATA.study.subjects=DATA.study.subjects.filter(s=>s.id!==id); saveData(); renderMaester(); }

/* ══════════════════════════════════════════════════
   MASTER OF WHISPERS — Journal / Chronicle
══════════════════════════════════════════════════ */
const MOODS = [
  {emoji:'🕯️',name:'Lucid',   id:'lucid'},
  {emoji:'🌿',name:'Settled', id:'settled'},
  {emoji:'🌙',name:'Pensive', id:'pensive'},
  {emoji:'⚡',name:'Restless',id:'restless'},
  {emoji:'🌑',name:'Burdened',id:'burdened'},
];

function renderWhispers() {
  const el = document.getElementById('tab-whispers');
  const views=['entries','patterns','moods'];
  const labels=['Chronicle','Patterns','Moods'];
  const v=STATE.whisperView;
  el.innerHTML = modHeader('Master of Whispers','The Chronicle','The private record — nightly account and honest witness')+
    `<div class="mod-tabs">${labels.map((l,i)=>`<button class="mod-tab ${v===views[i]?'active':''}" onclick="setWhisperView('${views[i]}')">${l}</button>`).join('')}</div>
    <div id="whispers-body"></div>`;
  addFAB('🕯️', ()=>showAddEntry());
  renderWhispersBody();
}

function setWhisperView(v) { STATE.whisperView=v; renderWhispers(); }

function renderWhispersBody() {
  const el=document.getElementById('whispers-body'); if(!el) return;
  const v=STATE.whisperView;
  if(v==='entries')  renderChronicle(el);
  if(v==='patterns') renderPatterns(el);
  if(v==='moods')    renderMoodChart(el);
}

function renderChronicle(el) {
  const entries = DATA.journal.entries;
  const search  = STATE.journalSearch.toLowerCase();
  let filtered  = entries.slice().sort((a,b)=>b.date.localeCompare(a.date));
  if (search) filtered = filtered.filter(e=>(e.title||'').toLowerCase().includes(search)||(e.body||'').toLowerCase().includes(search));
  if (STATE.journalFilter!=='all') filtered = filtered.filter(e=>e.mood===STATE.journalFilter);

  el.innerHTML = `
    <div class="search-wrap">
      <span class="search-icon">⊕</span>
      <input type="text" class="form-control search-input" placeholder="Search the chronicle…" value="${esc(STATE.journalSearch)}" oninput="STATE.journalSearch=this.value;renderWhispersBody()">
    </div>
    <div class="filter-row">
      <div class="filter-chip ${STATE.journalFilter==='all'?'active':''}" onclick="STATE.journalFilter='all';renderWhispersBody()">All</div>
      ${MOODS.map(m=>`<div class="filter-chip ${STATE.journalFilter===m.id?'active':''}" onclick="STATE.journalFilter='${m.id}';renderWhispersBody()">${m.emoji} ${m.name}</div>`).join('')}
      <div class="filter-chip ${STATE.journalFilter==='nightly'?'active':''}" onclick="STATE.journalFilter='nightly';renderWhispersBody()">◈ Nightly</div>
    </div>
    ${filtered.length ? filtered.map(e=>`
      <div class="journal-entry" onclick="viewEntry('${e.id}')">
        <div class="journal-entry-hdr">
          <div class="journal-title">${esc(e.title||formatDateFull(e.date))}${e.mode==='nightly'?'<span class="journal-mode-badge">nightly</span>':''}</div>
          <div class="journal-mood-badge">${MOODS.find(m=>m.id===e.mood)?.emoji||''}</div>
        </div>
        <div class="journal-date">${formatDateFull(e.date)} <span class="journal-hijri">· ${hijriString(e.date, CONFIG.hijriOffset)}</span></div>
        <div class="journal-excerpt">${esc((e.body||e.q1||'').slice(0,160))}</div>
        ${(e.tags||[]).length?`<div style="margin-top:5px">${e.tags.map(t=>`<span class="tag-chip">${esc(t)}</span>`).join('')}</div>`:''}
      </div>`).join('') : '<div class="empty-state"><div class="empty-icon">◈</div><div class="empty-title">The chronicle is silent</div><div class="empty-sub">Begin your first nightly account</div></div>'}`;
}

function viewEntry(id) {
  const e = DATA.journal.entries.find(x=>x.id===id);
  if (!e) return;
  const mood = MOODS.find(m=>m.id===e.mood);
  showModal(`
    <div class="modal-title">${esc(e.title||formatDateFull(e.date))}</div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <span style="font-size:22px">${mood?.emoji||''}</span>
      <div>
        <div style="font-family:var(--cairo);font-size:12px;color:var(--amber)">${mood?.name||''}</div>
        <div class="journal-date">${formatDateFull(e.date)} · ${hijriString(e.date, CONFIG.hijriOffset)}</div>
      </div>
    </div>
    ${e.mode==='nightly'
      ? `<div class="tq-view-block">
          <div class="tq-view-num">I</div>
          <div class="tq-view-question">What did you intend this morning, and what actually happened?</div>
          <div class="tq-view-answer">${esc(e.q1||'—')}</div>
        </div>
        <div class="tq-view-block">
          <div class="tq-view-num">II</div>
          <div class="tq-view-question">Where did your attention go that you did not choose to send it?</div>
          <div class="tq-view-answer">${esc(e.q2||'—')}</div>
        </div>
        <div class="tq-view-block">
          <div class="tq-view-num">III</div>
          <div class="tq-view-question">What do you carry forward that was not resolved today?</div>
          <div class="tq-view-answer">${esc(e.q3||'—')}</div>
        </div>`
      : `<div class="entry-full">${esc(e.body||'')}</div>`}
    ${(e.tags||[]).length?`<div style="margin-top:10px">${e.tags.map(t=>`<span class="tag-chip">${esc(t)}</span>`).join('')}</div>`:''}
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn btn-sm" onclick="editEntry('${e.id}')">Edit</button>
      <button class="btn btn-sm btn-danger" onclick="deleteEntry('${e.id}')">Delete</button>
      <button class="btn btn-sm" onclick="shareEntry('${e.id}')">Share</button>
    </div>`);
}

function shareEntry(id) {
  const e = DATA.journal.entries.find(x=>x.id===id);
  if (!e) return;
  const text = `${e.title||formatDateFull(e.date)}\n${e.date}\n\n${e.body||[e.q1,e.q2,e.q3].filter(Boolean).join('\n\n')}`;
  if (navigator.share) { navigator.share({ title: e.title||'Vigil Entry', text }).catch(()=>{}); }
  else { navigator.clipboard?.writeText(text).then(()=>toast('Copied to clipboard')).catch(()=>toast('Copy not available')); }
}

function showAddEntry(existing={}) {
  const mode = existing.mode || 'free';
  const selectedMood = existing.mood||'pensive';

  showModal(`<div class="modal-title">${existing.id?'Edit Entry':'Nightly Account'}</div>
    <div style="display:flex;gap:8px;margin-bottom:14px">
      <button class="btn btn-sm ${mode==='nightly'||!existing.id?'btn-primary':''}" onclick="switchEntryMode('nightly')">◈ Nightly</button>
      <button class="btn btn-sm ${mode==='free'?'btn-primary':''}" onclick="switchEntryMode('free')">Free Writing</button>
    </div>
    <div id="entry-form-inner">${buildEntryForm(existing, mode==='free'&&existing.id?'free':'nightly')}</div>`);
}

function switchEntryMode(mode) {
  document.getElementById('entry-form-inner').innerHTML = buildEntryForm({}, mode);
}

function buildEntryForm(e, mode) {
  const selectedMood = e.mood||'pensive';
  if (mode === 'nightly') {
    return `<div class="form-group"><label class="form-label">State of Mind</label>
      <div class="mood-selector">${MOODS.map(m=>`<div class="mood-btn ${m.id===selectedMood?'selected':''}" onclick="selectMood('${m.id}',this)"><span class="mood-emoji">${m.emoji}</span><div class="mood-name">${m.name}</div></div>`).join('')}</div></div>
      <div class="tq-block"><div class="tq-header"><div class="tq-num">I</div><div class="tq-question">What did you intend this morning, and what actually happened?</div></div>
        <textarea id="tq-1" class="form-control" rows="3" placeholder="Intend / Happened…">${esc(e.q1||'')}</textarea></div>
      <div class="tq-block"><div class="tq-header"><div class="tq-num">II</div><div class="tq-question">Where did your attention go that you did not choose to send it?</div></div>
        <textarea id="tq-2" class="form-control" rows="3" placeholder="Drifted to…">${esc(e.q2||'')}</textarea></div>
      <div class="tq-block"><div class="tq-header"><div class="tq-num">III</div><div class="tq-question">What do you carry forward that was not resolved today?</div></div>
        <textarea id="tq-3" class="form-control" rows="3" placeholder="Open / Unresolved…">${esc(e.q3||'')}</textarea></div>
      <div class="form-group"><label class="form-label">Tags (comma-separated)</label><input type="text" id="entry-tags" class="form-control" value="${esc((e.tags||[]).join(', '))}" placeholder="e.g. work, health"></div>
      <div class="form-group"><label class="form-label">Date</label><input type="date" id="entry-date" class="form-control" value="${e.date||today()}"></div>
      <button class="btn btn-primary btn-full" onclick="submitEntry('${e.id||''}','nightly')">Record</button>`;
  } else {
    return `<div class="form-group"><label class="form-label">Title</label><input type="text" id="entry-title" class="form-control" value="${esc(e.title||'')}" placeholder="Optional title"></div>
      <div class="form-group"><label class="form-label">State of Mind</label>
        <div class="mood-selector">${MOODS.map(m=>`<div class="mood-btn ${m.id===(e.mood||'pensive')?'selected':''}" onclick="selectMood('${m.id}',this)"><span class="mood-emoji">${m.emoji}</span><div class="mood-name">${m.name}</div></div>`).join('')}</div></div>
      <div class="form-group"><label class="form-label">Entry</label><textarea id="entry-body" class="form-control" rows="7" placeholder="Write freely…">${esc(e.body||'')}</textarea></div>
      <div class="form-group"><label class="form-label">Tags</label><input type="text" id="entry-tags" class="form-control" value="${esc((e.tags||[]).join(', '))}" placeholder="e.g. shadow, work, gratitude"></div>
      <div class="form-group"><label class="form-label">Date</label><input type="date" id="entry-date" class="form-control" value="${e.date||today()}"></div>
      <button class="btn btn-primary btn-full" onclick="submitEntry('${e.id||''}','free')">Record</button>`;
  }
}

let _selectedMood = 'pensive';
function selectMood(id, el) {
  _selectedMood = id;
  document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('selected'));
  el.classList.add('selected');
}

function submitEntry(id, mode) {
  const tags = (document.getElementById('entry-tags')?.value||'').split(',').map(t=>t.trim()).filter(Boolean);
  const date = document.getElementById('entry-date')?.value||today();
  let entry;
  if (mode==='nightly') {
    entry = { id:id||uid(), mode:'nightly', date, mood:_selectedMood, q1:document.getElementById('tq-1')?.value?.trim()||'', q2:document.getElementById('tq-2')?.value?.trim()||'', q3:document.getElementById('tq-3')?.value?.trim()||'', tags };
  } else {
    entry = { id:id||uid(), mode:'free', date, mood:_selectedMood, title:document.getElementById('entry-title')?.value?.trim()||'', body:document.getElementById('entry-body')?.value?.trim()||'', tags };
  }
  if (id) { const i=DATA.journal.entries.findIndex(e=>e.id===id); if(i>=0) DATA.journal.entries[i]=entry; }
  else DATA.journal.entries.push(entry);
  saveData(); hideModal(); vibrate([50,20,80]); toast('◈ Recorded'); renderWhispers();
}

function editEntry(id)   { const e=DATA.journal.entries.find(x=>x.id===id); if(e){_selectedMood=e.mood||'pensive'; hideModal(); setTimeout(()=>showAddEntry(e),300);} }
function deleteEntry(id) { DATA.journal.entries=DATA.journal.entries.filter(e=>e.id!==id); saveData(); hideModal(); renderWhispers(); toast('Removed'); }

function renderPatterns(el) {
  const entries = DATA.journal.entries;
  const last30  = entries.filter(e=>{ const d=new Date(e.date),now=new Date(); now.setDate(now.getDate()-30); return d>=now; });
  if (!last30.length) { el.innerHTML='<div class="empty-state"><div class="empty-icon">◈</div><div class="empty-title">Not enough entries</div><div class="empty-sub">Write for 30 days to see patterns</div></div>'; return; }

  // Tag frequency
  const tagCounts = {};
  last30.forEach(e=>(e.tags||[]).forEach(t=>{ tagCounts[t]=(tagCounts[t]||0)+1; }));
  const sortedTags = Object.entries(tagCounts).sort((a,b)=>b[1]-a[1]).slice(0,12);
  const maxCount = sortedTags[0]?.[1]||1;

  // Mood frequency
  const moodCounts = {};
  last30.forEach(e=>{ if(e.mood) moodCounts[e.mood]=(moodCounts[e.mood]||0)+1; });
  const domMood = Object.entries(moodCounts).sort((a,b)=>b[1]-a[1])[0];
  const domMoodData = MOODS.find(m=>m.id===domMood?.[0]);

  el.innerHTML = `
    <div class="section-title">Last 30 Days — Recurring Themes</div>
    <div class="card">
      <div class="pattern-heading">Tags appearing most frequently in your chronicle.</div>
      ${sortedTags.length ? sortedTags.map(([tag,count])=>`
        <div class="pattern-item">
          <div class="pattern-tag">${esc(tag)}</div>
          <div class="pattern-bar"><div class="pattern-bar-fill" style="width:${count/maxCount*100}%"></div></div>
          <div class="pattern-count">${count}×</div>
        </div>`).join('') : '<div class="text-stone text-sm">No tags found. Add tags to your entries.</div>'}
    </div>
    ${domMood?`<div class="section-title mt-16">Prevailing State</div>
    <div class="card" style="text-align:center;padding:20px">
      <div style="font-size:40px;margin-bottom:8px">${domMoodData?.emoji||''}</div>
      <div style="font-family:var(--kufi);font-size:18px;color:var(--amber)">${domMoodData?.name||''}</div>
      <div class="text-stone text-sm mt-8">${domMood[1]} of ${last30.length} entries</div>
    </div>`:''}`;
}

function renderMoodChart(el) {
  const entries = DATA.journal.entries.filter(e=>e.mood).sort((a,b)=>a.date.localeCompare(b.date)).slice(-60);
  if (entries.length < 3) { el.innerHTML='<div class="empty-state"><div class="empty-icon">◈</div><div class="empty-title">Not enough data</div><div class="empty-sub">Record at least 3 entries with mood</div></div>'; return; }

  const MOOD_Y = { lucid:0, settled:1, pensive:2, restless:3, burdened:4 };
  const W=300, H=120, padL=10, padR=10, padT=15, padB=10;
  const ys = entries.map(e=>(MOOD_Y[e.mood]||2));
  const xs = entries.map((_,i)=>padL+i*(W-padL-padR)/(entries.length-1));
  const toSVGY = v => padT + v/4*(H-padT-padB);

  // Smooth curve
  let pathD = `M${xs[0]},${toSVGY(ys[0])}`;
  for (let i=1;i<xs.length;i++) {
    const cpx = (xs[i-1]+xs[i])/2;
    pathD += ` C${cpx},${toSVGY(ys[i-1])} ${cpx},${toSVGY(ys[i])} ${xs[i]},${toSVGY(ys[i])}`;
  }
  const areaD = `${pathD} L${xs[xs.length-1]},${H-padB} L${xs[0]},${H-padB} Z`;
  const MOOD_COLORS = { lucid:'#DEAD56', settled:'#22987A', pensive:'#4272C8', restless:'#D09020', burdened:'#B83040' };

  el.innerHTML = `
    <div class="section-title">Mood Over Time (last 60 entries)</div>
    <div class="card">
      <div class="mood-chart-wrap">
        <svg viewBox="0 0 ${W} ${H}" class="mood-chart-svg" style="height:${H}px">
          ${[0,1,2,3,4].map(i=>`<line x1="${padL}" y1="${toSVGY(i)}" x2="${W-padR}" y2="${toSVGY(i)}" stroke="rgba(184,120,24,0.07)" stroke-width="1"/>`).join('')}
          <path d="${areaD}" fill="var(--amber)" opacity="0.08"/>
          <path d="${pathD}" fill="none" stroke="var(--amber)" stroke-width="1.5" stroke-linecap="round"/>
          ${xs.map((x,i)=>`<circle cx="${x}" cy="${toSVGY(ys[i])}" r="3" fill="${MOOD_COLORS[entries[i].mood]||'var(--amber)'}"/>`).join('')}
          ${MOODS.map((m,i)=>`<text x="${padL-2}" y="${toSVGY(i)+4}" text-anchor="end" font-size="9" fill="rgba(184,120,24,0.4)" font-family="serif">${m.emoji}</text>`).join('')}
        </svg>
      </div>
    </div>
    <div class="section-title mt-16">Mood Distribution</div>
    <div class="card">
      ${MOODS.map(m=>{
        const count = entries.filter(e=>e.mood===m.id).length;
        const pct   = entries.length>0?count/entries.length:0;
        return `<div class="pattern-item">
          <div class="pattern-tag">${m.emoji} ${m.name}</div>
          <div class="pattern-bar"><div class="pattern-bar-fill" style="width:${pct*100}%;background:${MOOD_COLORS[m.id]||'var(--amber)'}"></div></div>
          <div class="pattern-count">${count}×</div>
        </div>`;
      }).join('')}
    </div>`;
}

/* ══ PWA SETUP ═══════════════════════════════════ */
function setupPWA() {
  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg=>{
      // Periodic sync for daily briefing
      if ('periodicSync' in reg) {
        reg.periodicSync.register('daily-briefing', { minInterval: 24*60*60*1000 }).catch(()=>{});
      }
      // Listen for updates
      reg.addEventListener('updatefound', ()=>{
        const nw = reg.installing;
        nw.addEventListener('statechange', ()=>{
          if (nw.state==='installed'&&navigator.serviceWorker.controller) toast('◈ Update available — reload to apply');
        });
      });
    });
    // Messages from SW
    navigator.serviceWorker.addEventListener('message', e=>{
      if (e.data?.type==='NAVIGATE')  showTab(e.data.tab);
      if (e.data?.type==='GOLD_UPDATED') {
        if (e.data.usdPerOz) { DATA.treasury.cachedGoldPrice=e.data.usdPerOz; DATA.treasury.cachedEgpRate=e.data.egpRate; DATA.treasury.cachedGoldTs=e.data.ts; saveData(); }
      }
    });
  }

  // Install prompt
  window.addEventListener('beforeinstallprompt', e=>{
    e.preventDefault(); STATE.deferredInstall=e;
    const banner = document.getElementById('install-banner');
    banner.classList.remove('hidden');
    document.getElementById('install-btn').onclick=()=>{
      STATE.deferredInstall.prompt();
      STATE.deferredInstall.userChoice.then(()=>{ banner.classList.add('hidden'); STATE.deferredInstall=null; });
    };
    document.getElementById('install-dismiss').onclick=()=>banner.classList.add('hidden');
  });

  // Offline detection
  const offlineBanner = document.getElementById('offline-banner');
  window.addEventListener('online',  ()=>offlineBanner.classList.add('hidden'));
  window.addEventListener('offline', ()=>offlineBanner.classList.remove('hidden'));
  if (!navigator.onLine) offlineBanner.classList.remove('hidden');

  // URL tab routing
  const urlTab = new URLSearchParams(location.search).get('tab');
  if (urlTab && TAB_META[urlTab]) showTab(urlTab);

  // Schedule habit reminders on load
  scheduleHabitReminders();
}

/* ══ INIT ════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', ()=>{
  loadData();
  setupNav();
  showTab('home');
  setupPWA();
});

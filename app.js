/* ════════════════════════════════════════════════
   THE CODEX — Life System PWA
   app.js — Main Application Logic
════════════════════════════════════════════════ */

'use strict';

/* ══ DEFAULT DATA STRUCTURE ══════════════════════ */
const DEFAULT_DATA = {
  treasury: {
    transactions: [],
    categories: [
      { id: 'cat1', name: 'Food & Feasts',   icon: '🍖', color: '#c0392b' },
      { id: 'cat2', name: 'Shelter',         icon: '🏰', color: '#8e44ad' },
      { id: 'cat3', name: 'Transport',       icon: '🐴', color: '#2980b9' },
      { id: 'cat4', name: 'Entertainment',   icon: '🎭', color: '#f39c12' },
      { id: 'cat5', name: 'Supplies',        icon: '⚗️', color: '#27ae60' },
      { id: 'cat6', name: 'Health',          icon: '🧪', color: '#e74c3c' },
      { id: 'cat7', name: 'Salary',          icon: '💼', color: '#f1c40f' },
      { id: 'cat8', name: 'Freelance',       icon: '🗡️', color: '#1abc9c' },
      { id: 'cat9', name: 'Other',           icon: '📦', color: '#7f8c8d' },
    ],
    bankBalance: null,
    cashBalance: null,
    goldEntries: [],
    cachedGoldPrice: null, // {usdPerOz, egpRate, timestamp}
  },
  habits: {
    habits: [],
    logs: [],  // [{habitId, date:'YYYY-MM-DD'}]
  },
  gym: {
    sessions: [], // [{id,date,type,notes,duration,exercises:[{name,sets:[{reps,weight}]}]}]
    workoutTypes: ['Push','Pull','Legs','Cardio','Upper','Lower','Full Body','Rest'],
  },
  study: {
    subjects: [],  // [{id,name,color,weeklyGoalHours}]
    sessions: [],  // [{id,date,subjectId,durationMin,topic,notes}]
  },
  journal: {
    entries: [],   // [{id,date,title,content,mood,tags:[]}]
  },
};

/* ══ STATE ═══════════════════════════════════════ */
let STATE = {
  activeTab: 'home',
  treasuryView: 'log',    // log | dashboard | vault | compare | reconcile
  txFilter: 'all',         // all | income | expense | catId
  gymModal: null,
  studyTimer: { running: false, seconds: 0, interval: null, subject: '', mode: 'focus' },
  journalSearch: '',
};

let DATA = {};

/* ══ PERSISTENCE ═════════════════════════════════ */
function loadData() {
  try {
    const raw = localStorage.getItem('codex_v1');
    if (raw) {
      DATA = deepMerge(DEFAULT_DATA, JSON.parse(raw));
    } else {
      DATA = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  } catch(e) {
    DATA = JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData() {
  try {
    localStorage.setItem('codex_v1', JSON.stringify(DATA));
  } catch(e) {
    toast('⚠️ Storage full!');
  }
}

function deepMerge(target, source) {
  const out = Object.assign({}, target);
  for (const key of Object.keys(source)) {
    if (Array.isArray(source[key])) {
      out[key] = source[key];
    } else if (source[key] && typeof source[key] === 'object') {
      out[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

/* ══ UTILS ═══════════════════════════════════════ */
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

function today() { return new Date().toISOString().slice(0,10); }

function formatDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'2-digit' });
}

function formatDateFull(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}

function monthKey(date) { return date.slice(0,7); }

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
  const h = Math.floor(min/60);
  const m = min%60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function fmtSec(sec) {
  const h = Math.floor(sec/3600);
  const m = Math.floor((sec%3600)/60);
  const s = sec%60;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

function pad(n) { return String(n).padStart(2,'0'); }

function toast(msg, dur=2200) {
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

/* ══ TAB ROUTER ══════════════════════════════════ */
function setupNav() {
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
  });
  document.getElementById('modal-close').addEventListener('click', hideModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') hideModal();
  });
}

function showTab(tab) {
  STATE.activeTab = tab;
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(s => s.classList.toggle('active', s.id === 'tab-'+tab));

  const titles = {
    home: 'THE CODEX',
    treasury: '⚜ TREASURY ⚜',
    habits: '⚜ QUESTS ⚜',
    gym: '⚜ COMBAT LOG ⚜',
    study: '⚜ THE TOME ⚜',
    journal: '⚜ CHRONICLE ⚜',
  };
  document.getElementById('header-title').textContent = titles[tab] || 'THE CODEX';

  const renders = {
    home:     renderHome,
    treasury: renderTreasury,
    habits:   renderHabits,
    gym:      renderGym,
    study:    renderStudy,
    journal:  renderJournal,
  };
  if (renders[tab]) renders[tab]();

  // Remove any leftover FABs from other tabs then re-render
  document.querySelectorAll('.fab').forEach(f => f.remove());
}

/* ════════════════════════════════════════════════
   HOME MODULE
════════════════════════════════════════════════ */
function renderHome() {
  const el = document.getElementById('tab-home');

  // Quick stats
  const txToday = DATA.treasury.transactions.filter(t => t.date === today());
  const habitsToday = DATA.habits.habits.length;
  const doneTodayHabits = DATA.habits.logs.filter(l => l.date === today()).length;
  const thisWeekGym = DATA.gym.sessions.filter(s => {
    const d = new Date(s.date); const now = new Date();
    const diff = (now - d) / 86400000;
    return diff >= 0 && diff < 7;
  }).length;

  const todayStudy = DATA.study.sessions.filter(s => s.date === today()).reduce((a,s) => a+s.durationMin, 0);
  const thisMonthEntries = DATA.journal.entries.filter(e => e.date.slice(0,7) === today().slice(0,7)).length;

  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const now = new Date();

  el.innerHTML = `
    <div class="home-banner">
      <span class="home-crest">🏰</span>
      <div class="home-greeting">Welcome, Keeper</div>
      <div class="home-date">${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}</div>
    </div>
    <div class="home-divider"></div>
    <div class="section-title">Your Realm</div>
    <div class="home-grid">
      <div class="home-card" style="--card-accent:rgba(201,162,39,0.07)" onclick="showTab('treasury')">
        <span class="home-card-icon">💰</span>
        <div class="home-card-name">Treasury</div>
        <div class="home-card-stat">${txToday.length} tx today</div>
      </div>
      <div class="home-card" style="--card-accent:rgba(74,156,58,0.07)" onclick="showTab('habits')">
        <span class="home-card-icon">🛡️</span>
        <div class="home-card-name">Quests</div>
        <div class="home-card-stat">${doneTodayHabits}/${habitsToday} done</div>
      </div>
      <div class="home-card" style="--card-accent:rgba(155,32,32,0.07)" onclick="showTab('gym')">
        <span class="home-card-icon">⚔️</span>
        <div class="home-card-name">Combat</div>
        <div class="home-card-stat">${thisWeekGym} sessions this week</div>
      </div>
      <div class="home-card" style="--card-accent:rgba(30,61,122,0.1)" onclick="showTab('study')">
        <span class="home-card-icon">📜</span>
        <div class="home-card-name">Tome</div>
        <div class="home-card-stat">${todayStudy > 0 ? fmtMin(todayStudy) + ' today' : 'No sessions today'}</div>
      </div>
      <div class="home-card" style="--card-accent:rgba(142,68,173,0.07); grid-column:1/-1" onclick="showTab('journal')">
        <span class="home-card-icon">🪶</span>
        <div class="home-card-name">Chronicle</div>
        <div class="home-card-stat">${thisMonthEntries} entries this month</div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="section-title">Oath of the Day</div>
    <div class="card card-parchment" style="text-align:center;padding:18px">
      <div style="font-style:italic;font-size:14px;color:var(--text-dim);line-height:1.8">
        "Discipline is the bridge between goals and accomplishment."
      </div>
      <div style="font-family:var(--font-title);font-size:10px;letter-spacing:0.1em;color:var(--text-faint);margin-top:8px">— Jim Rohn</div>
    </div>
  `;
}

/* ════════════════════════════════════════════════
   TREASURY MODULE
════════════════════════════════════════════════ */
function renderTreasury() {
  const el = document.getElementById('tab-treasury');
  el.innerHTML = `
    <div class="module-title">Treasury</div>
    <div class="module-subtitle">Track every coin that flows through your hands</div>
    <div class="treasury-tabs">
      <button class="treasury-tab ${STATE.treasuryView==='log'?'active':''}" onclick="switchTreasuryView('log')">Log</button>
      <button class="treasury-tab ${STATE.treasuryView==='dashboard'?'active':''}" onclick="switchTreasuryView('dashboard')">Charts</button>
      <button class="treasury-tab ${STATE.treasuryView==='compare'?'active':''}" onclick="switchTreasuryView('compare')">Monthly</button>
      <button class="treasury-tab ${STATE.treasuryView==='reconcile'?'active':''}" onclick="switchTreasuryView('reconcile')">Balance</button>
      <button class="treasury-tab ${STATE.treasuryView==='vault'?'active':''}" onclick="switchTreasuryView('vault')">🏆Vault</button>
    </div>
    <div id="treasury-view"></div>
  `;

  renderTreasuryView();

  // FAB for adding transaction (visible on log view)
  if (STATE.treasuryView === 'log') addFAB('+', () => showAddTransaction());
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
    case 'log':        el.innerHTML = renderTxLog(); break;
    case 'dashboard':  el.innerHTML = ''; renderDashboard(el); break;
    case 'compare':    el.innerHTML = renderMonthlyCompare(); break;
    case 'reconcile':  el.innerHTML = renderReconcile(); break;
    case 'vault':      el.innerHTML = ''; renderVault(el); break;
  }
}

/* ─── Transaction Log ─── */
function renderTxLog() {
  const txs = DATA.treasury.transactions;
  const cats = DATA.treasury.categories;

  // Summary this month
  const thisMonth = today().slice(0,7);
  const monthTx = txs.filter(t => t.date.slice(0,7) === thisMonth);
  const income = monthTx.filter(t => t.type==='income').reduce((a,t) => a+t.amount, 0);
  const expense = monthTx.filter(t => t.type==='expense').reduce((a,t) => a+t.amount, 0);
  const net = income - expense;

  // Filter
  let filtered = [...txs].sort((a,b) => b.date.localeCompare(a.date));
  if (STATE.txFilter === 'income')  filtered = filtered.filter(t => t.type==='income');
  else if (STATE.txFilter === 'expense') filtered = filtered.filter(t => t.type==='expense');
  else if (STATE.txFilter !== 'all') filtered = filtered.filter(t => t.categoryId === STATE.txFilter);

  const filterChips = [
    {id:'all',label:'All'},
    {id:'income',label:'Income'},
    {id:'expense',label:'Expense'},
    ...cats.map(c => ({id:c.id, label:c.icon+' '+c.name}))
  ];

  const txHTML = filtered.slice(0,60).map(tx => {
    const cat = cats.find(c => c.id === tx.categoryId) || {icon:'📦',name:'Other'};
    return `
      <div class="tx-item">
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
      <div class="summary-cell">
        <div class="summary-cell-label">Income</div>
        <div class="summary-cell-val text-green">${fmtEGP(income)}</div>
      </div>
      <div class="summary-cell">
        <div class="summary-cell-label">Spent</div>
        <div class="summary-cell-val text-red">${fmtEGP(expense)}</div>
      </div>
      <div class="summary-cell">
        <div class="summary-cell-label">Net</div>
        <div class="summary-cell-val ${net>=0?'text-green':'text-red'}">${net>=0?'+':''}${fmtEGP(net)}</div>
      </div>
    </div>

    <div class="filter-row">
      ${filterChips.map(f => `
        <div class="filter-chip ${STATE.txFilter===f.id?'active':''}" onclick="setTxFilter('${f.id}')">${f.label}</div>
      `).join('')}
    </div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div class="section-title" style="margin:0">Ledger</div>
        <button class="btn btn-sm" onclick="showCategoryManager()">⚙ Categories</button>
      </div>
      ${filtered.length ? txHTML : '<div class="empty-state"><div class="empty-icon">📜</div><div class="empty-title">The ledger is empty</div><div class="empty-sub">No transactions recorded yet</div></div>'}
    </div>`;
}

window.setTxFilter = function(f) { STATE.txFilter = f; renderTreasury(); };

function showAddTransaction() {
  const cats = DATA.treasury.categories;
  showModal(`
    <div class="modal-title">⚔ Record Transaction</div>
    <div class="type-toggle">
      <button class="type-toggle-btn expense" id="type-expense" onclick="toggleTxType('expense')">Expenditure</button>
      <button class="type-toggle-btn income active" id="type-income" onclick="toggleTxType('income')">Income</button>
    </div>
    <input type="hidden" id="tx-type" value="income">
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Amount (EGP)</label>
        <input class="form-control" type="number" id="tx-amount" placeholder="0" inputmode="decimal">
      </div>
      <div class="form-group">
        <label class="form-label">Date</label>
        <input class="form-control" type="date" id="tx-date" value="${today()}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Category</label>
      <select class="form-control" id="tx-cat">
        ${cats.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Note</label>
      <input class="form-control" type="text" id="tx-note" placeholder="What was this for?">
    </div>
    <button class="btn btn-primary btn-full" onclick="submitTransaction()">Record in Ledger</button>
  `);
  // init toggle
  toggleTxType('income');
}

window.toggleTxType = function(type) {
  document.getElementById('tx-type').value = type;
  const btnE = document.getElementById('type-expense');
  const btnI = document.getElementById('type-income');
  btnE.classList.toggle('active', type==='expense');
  btnI.classList.toggle('active', type==='income');
};

window.submitTransaction = function() {
  const amount = parseFloat(document.getElementById('tx-amount').value);
  const date   = document.getElementById('tx-date').value;
  const type   = document.getElementById('tx-type').value;
  const catId  = document.getElementById('tx-cat').value;
  const note   = document.getElementById('tx-note').value.trim();

  if (!amount || amount <= 0) { toast('⚠ Enter a valid amount'); return; }
  if (!date) { toast('⚠ Enter a date'); return; }

  DATA.treasury.transactions.push({ id: uid(), amount, date, type, categoryId: catId, note });
  saveData();
  hideModal();
  toast('✦ Transaction recorded');
  renderTreasury();
};

window.deleteTransaction = function(id) {
  if (!confirm('Remove this transaction?')) return;
  DATA.treasury.transactions = DATA.treasury.transactions.filter(t => t.id !== id);
  saveData();
  renderTreasury();
  toast('Transaction removed');
};

/* ─── Category Manager ─── */
window.showCategoryManager = function() {
  const cats = DATA.treasury.categories;
  const colors = ['#c0392b','#e67e22','#f1c40f','#2ecc71','#1abc9c','#3498db','#9b59b6','#e91e63','#7f8c8d','#27ae60','#2980b9','#8e44ad'];
  showModal(`
    <div class="modal-title">⚙ Category Forge</div>
    <div id="cat-list">
      ${cats.map(c => `
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(201,162,39,0.1)">
          <span style="font-size:20px">${c.icon}</span>
          <span style="flex:1;font-family:var(--font-title);font-size:13px">${c.name}</span>
          <button class="btn btn-sm btn-danger" onclick="deleteCategory('${c.id}')">Remove</button>
        </div>`).join('')}
    </div>
    <div class="divider"></div>
    <div class="form-group">
      <label class="form-label">New Category</label>
      <div class="form-row">
        <input class="form-control" type="text" id="new-cat-icon" placeholder="Emoji" style="max-width:80px">
        <input class="form-control" type="text" id="new-cat-name" placeholder="Name">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Color</label>
      <div class="color-options" id="color-opts">
        ${colors.map((c,i) => `<div class="color-opt ${i===0?'selected':''}" style="background:${c}" data-color="${c}" onclick="selectColor(this)"></div>`).join('')}
      </div>
    </div>
    <button class="btn btn-primary btn-full" onclick="addCategory()">+ Add Category</button>
  `);
};

window.selectColor = function(el) {
  document.querySelectorAll('.color-opt').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
};

window.addCategory = function() {
  const icon = document.getElementById('new-cat-icon').value.trim() || '📦';
  const name = document.getElementById('new-cat-name').value.trim();
  const selectedColor = document.querySelector('.color-opt.selected');
  const color = selectedColor ? selectedColor.dataset.color : '#7f8c8d';
  if (!name) { toast('⚠ Enter a category name'); return; }
  DATA.treasury.categories.push({ id: uid(), icon, name, color });
  saveData();
  toast('✦ Category added');
  showCategoryManager();
};

window.deleteCategory = function(id) {
  if (DATA.treasury.transactions.some(t => t.categoryId === id)) {
    toast('⚠ Category in use — cannot remove'); return;
  }
  DATA.treasury.categories = DATA.treasury.categories.filter(c => c.id !== id);
  saveData();
  showCategoryManager();
};

/* ─── Dashboard / Pie Chart ─── */
function renderDashboard(el) {
  const txs = DATA.treasury.transactions;
  const cats = DATA.treasury.categories;
  const thisMonth = today().slice(0,7);
  const monthTx = txs.filter(t => t.date.slice(0,7) === thisMonth);

  // Expenses by category
  const expensesBycat = {};
  monthTx.filter(t => t.type==='expense').forEach(t => {
    expensesBycat[t.categoryId] = (expensesBycat[t.categoryId]||0) + t.amount;
  });

  const total = Object.values(expensesBycat).reduce((a,b) => a+b, 0);

  const pieData = Object.entries(expensesBycat).map(([catId, amount]) => {
    const cat = cats.find(c => c.id === catId) || {icon:'📦', name:'Other', color:'#7f8c8d'};
    return { cat, amount, pct: total > 0 ? (amount/total)*100 : 0 };
  }).sort((a,b) => b.amount - a.amount);

  const incomeTotal = monthTx.filter(t => t.type==='income').reduce((a,t) => a+t.amount, 0);

  el.innerHTML = `
    <div class="section-title">${monthLabel(thisMonth)} — Expenditure</div>
    <div class="card">
      ${total === 0
        ? '<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-title">No expenses this month</div></div>'
        : `<div class="chart-wrap">
            ${buildPie(pieData)}
            <div class="pie-legend">
              ${pieData.map(d => `
                <div class="legend-item">
                  <div class="legend-dot" style="background:${d.cat.color}"></div>
                  <div class="legend-label">${d.cat.icon} ${d.cat.name}</div>
                  <div class="legend-pct">${d.pct.toFixed(1)}%</div>
                  <div class="legend-amt">${fmtEGP(d.amount)}</div>
                </div>`).join('')}
            </div>
          </div>`
      }
    </div>

    <div class="summary-bar" style="margin-top:0">
      <div class="summary-cell">
        <div class="summary-cell-label">Income</div>
        <div class="summary-cell-val text-green">${fmtEGP(incomeTotal)}</div>
      </div>
      <div class="summary-cell">
        <div class="summary-cell-label">Spent</div>
        <div class="summary-cell-val text-red">${fmtEGP(total)}</div>
      </div>
      <div class="summary-cell">
        <div class="summary-cell-label">Saved</div>
        <div class="summary-cell-val ${incomeTotal-total>=0?'text-green':'text-red'}">${fmtEGP(incomeTotal-total)}</div>
      </div>
    </div>`;
}

function buildPie(data) {
  if (!data.length) return '';
  const cx=100, cy=100, r=80, size=200;
  let start = -Math.PI/2;
  let paths = '';

  data.forEach(d => {
    const angle = (d.pct/100) * Math.PI * 2;
    const end = start + angle;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = angle > Math.PI ? 1 : 0;
    paths += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z" fill="${d.cat.color}" opacity="0.9" stroke="#0a0806" stroke-width="1.5">
      <title>${d.cat.icon} ${d.cat.name}: ${d.pct.toFixed(1)}% — ${fmtEGP(d.amount)}</title>
    </path>`;
    start = end;
  });

  // Center hole
  paths += `<circle cx="${cx}" cy="${cy}" r="45" fill="#13100c"/>`;

  return `<svg class="pie-svg" viewBox="0 0 ${size} ${size}" width="180" height="180" style="max-width:100%">${paths}</svg>`;
}

/* ─── Monthly Comparison ─── */
function renderMonthlyCompare() {
  const txs = DATA.treasury.transactions;
  const now = new Date();
  const months = [];

  for (let i=0; i<6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);
  }

  const stats = months.map(m => {
    const mTx = txs.filter(t => t.date.slice(0,7) === m);
    const income  = mTx.filter(t => t.type==='income').reduce((a,t) => a+t.amount, 0);
    const expense = mTx.filter(t => t.type==='expense').reduce((a,t) => a+t.amount, 0);
    return { month: m, income, expense, net: income-expense, count: mTx.length };
  });

  const rows = [];
  for (let i=0; i<stats.length-1; i++) {
    const curr = stats[i];
    const prev = stats[i+1];
    rows.push({ curr, prev });
  }

  return `
    <div class="section-title">Month vs Month</div>
    ${rows.map(({curr,prev}) => {
      const expChange = prev.expense > 0 ? ((curr.expense - prev.expense)/prev.expense)*100 : 0;
      const incChange = prev.income > 0 ? ((curr.income - prev.income)/prev.income)*100 : 0;
      return `
        <div class="card mb-12">
          <div class="month-compare">
            <div class="month-box">
              <div class="month-box-label">${monthLabel(curr.month)}</div>
              <div class="month-stat">
                <div class="month-stat-label">Income</div>
                <div class="month-stat-val text-green">${fmtEGP(curr.income)}</div>
              </div>
              <div class="month-stat">
                <div class="month-stat-label">Expenses</div>
                <div class="month-stat-val text-red">${fmtEGP(curr.expense)}</div>
              </div>
              <div class="month-stat">
                <div class="month-stat-label">Net</div>
                <div class="month-stat-val ${curr.net>=0?'text-green':'text-red'}">${fmtEGP(curr.net)}</div>
              </div>
            </div>
            <div class="month-box">
              <div class="month-box-label">${monthLabel(prev.month)}</div>
              <div class="month-stat">
                <div class="month-stat-label">Income</div>
                <div class="month-stat-val text-green">${fmtEGP(prev.income)}</div>
              </div>
              <div class="month-stat">
                <div class="month-stat-label">Expenses</div>
                <div class="month-stat-val text-red">${fmtEGP(prev.expense)}</div>
              </div>
              <div class="month-stat">
                <div class="month-stat-label">Net</div>
                <div class="month-stat-val ${prev.net>=0?'text-green':'text-red'}">${fmtEGP(prev.net)}</div>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
            ${incChange !== 0 ? `<div class="month-change ${incChange>0?'up':'down'}">${incChange>0?'▲':'▼'} Income ${Math.abs(incChange).toFixed(0)}%</div>` : ''}
            ${expChange !== 0 ? `<div class="month-change ${expChange<0?'up':'down'}">${expChange<0?'▼':'▲'} Spent ${Math.abs(expChange).toFixed(0)}%</div>` : ''}
          </div>
        </div>`;
    }).join('')}
    ${rows.length === 0 ? '<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-title">Need more months of data</div></div>' : ''}`;
}

/* ─── Balance Reconciliation ─── */
function renderReconcile() {
  const txs = DATA.treasury.transactions;
  const income  = txs.filter(t => t.type==='income').reduce((a,t) => a+t.amount, 0);
  const expense = txs.filter(t => t.type==='expense').reduce((a,t) => a+t.amount, 0);
  const tracked = income - expense;

  const bank = DATA.treasury.bankBalance;
  const cash = DATA.treasury.cashBalance;
  const realTotal = (bank||0) + (cash||0);
  const diff = realTotal > 0 ? realTotal - tracked : null;

  return `
    <div class="section-title">Balance Reconciliation</div>
    <div class="card mb-12">
      <div style="margin-bottom:14px;font-style:italic;font-size:13px;color:var(--text-dim)">
        Enter your real bank &amp; cash balances to see if the ledger matches.
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Bank Balance (EGP)</label>
          <input class="form-control" type="number" id="bank-bal" value="${bank !== null ? bank : ''}" placeholder="0" inputmode="decimal">
        </div>
        <div class="form-group">
          <label class="form-label">Cash on Hand (EGP)</label>
          <input class="form-control" type="number" id="cash-bal" value="${cash !== null ? cash : ''}" placeholder="0" inputmode="decimal">
        </div>
      </div>
      <button class="btn btn-primary btn-full" onclick="saveBalances()">Update Balances</button>
    </div>

    <div class="card">
      <div class="recon-row">
        <div class="recon-label">📊 Tracked Income</div>
        <div class="recon-val text-green">+${fmtEGP(income)}</div>
      </div>
      <div class="recon-row">
        <div class="recon-label">💸 Tracked Expenses</div>
        <div class="recon-val text-red">-${fmtEGP(expense)}</div>
      </div>
      <div class="recon-row">
        <div class="recon-label">📈 Net (Tracked)</div>
        <div class="recon-val ${tracked>=0?'text-green':'text-red'}">${fmtEGP(tracked)}</div>
      </div>
      <div class="recon-row">
        <div class="recon-label">🏦 Bank + Cash (Real)</div>
        <div class="recon-val">${realTotal > 0 ? fmtEGP(realTotal) : '—'}</div>
      </div>
      ${diff !== null ? `
        <div class="recon-row" style="border-top:1px solid var(--gold-border);margin-top:6px;padding-top:14px">
          <div class="recon-label" style="font-family:var(--font-title);font-weight:700">Discrepancy</div>
          <div class="recon-val ${Math.abs(diff)<10?'good':Math.abs(diff)<500?'warn':'bad'}">
            ${Math.abs(diff)<10 ? '✓ Balanced' : (diff>0?'+':'')+fmtEGP(diff)}
          </div>
        </div>
        ${Math.abs(diff)>=10 ? `<div style="font-style:italic;font-size:12px;color:var(--text-dim);margin-top:8px">${diff>0 ? 'You have more than tracked — some income may be unrecorded.' : 'You have less than tracked — some expenses may be missing.'}</div>` : ''}
      ` : ''}
    </div>`;
}

window.saveBalances = function() {
  DATA.treasury.bankBalance = parseFloat(document.getElementById('bank-bal').value) || 0;
  DATA.treasury.cashBalance = parseFloat(document.getElementById('cash-bal').value) || 0;
  saveData();
  toast('✦ Balances updated');
  switchTreasuryView('reconcile');
};

/* ─── Secret Gold Vault ─── */
function renderVault(el) {
  const gp = DATA.treasury.cachedGoldPrice;
  const gramPrice = gp ? (gp.usdPerOz / 31.1035) * gp.egpRate : null;
  const totalGrams = DATA.treasury.goldEntries.reduce((a,g) => a+g.grams, 0);
  const currentValue = gramPrice ? totalGrams * gramPrice : null;

  const timestamp = gp ? new Date(gp.timestamp).toLocaleTimeString() : null;

  el.innerHTML = `
    <div class="section-title">⚜ Secret Gold Vault ⚜</div>
    <div class="gold-price-banner">
      <div>
        <div class="gold-price-label">Gold Price (EGP / gram)</div>
        <div class="gold-price-val">${gramPrice ? fmtEGP(gramPrice) : '—'}</div>
        ${timestamp ? `<div class="gold-price-sub">Updated ${timestamp}</div>` : '<div class="gold-price-sub">Press fetch to load price</div>'}
      </div>
      <button class="btn btn-sm" id="fetch-gold-btn" onclick="fetchGoldPrice()">🔄 Fetch</button>
    </div>

    ${totalGrams > 0 ? `
      <div class="card mb-12">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-family:var(--font-title);font-size:12px;color:var(--text-dim);letter-spacing:0.08em">TOTAL GOLD</div>
            <div style="font-family:var(--font-display);font-size:24px;color:var(--gold-bright)">${totalGrams.toFixed(2)}g</div>
          </div>
          <div style="text-align:right">
            <div style="font-family:var(--font-title);font-size:12px;color:var(--text-dim);letter-spacing:0.08em">CURRENT VALUE</div>
            <div style="font-family:var(--font-display);font-size:20px;color:var(--gold)">${currentValue ? fmtEGP(currentValue) : '—'}</div>
          </div>
        </div>
      </div>
    ` : ''}

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div class="section-title" style="margin:0">Holdings</div>
        <button class="btn btn-sm btn-primary" onclick="showAddGold()">+ Add Gold</button>
      </div>
      ${DATA.treasury.goldEntries.length ? DATA.treasury.goldEntries.map(g => {
        const paidTotal = g.grams * g.pricePerGram;
        const nowVal = gramPrice ? g.grams * gramPrice : null;
        const gain = nowVal ? nowVal - paidTotal : null;
        const gainPct = nowVal ? ((nowVal - paidTotal)/paidTotal)*100 : null;
        return `
          <div class="gold-item">
            <div style="font-size:24px">🥇</div>
            <div style="flex:1">
              <div class="gold-item-grams">${g.grams}g</div>
              <div class="gold-item-date">${formatDate(g.date)}</div>
              <div class="gold-item-paid">Bought @ ${fmtEGP(g.pricePerGram)}/g</div>
            </div>
            <div style="text-align:right">
              <div class="gold-item-now">${nowVal ? fmtEGP(nowVal) : fmtEGP(paidTotal)}</div>
              ${gain !== null ? `<div class="gold-item-gain ${gain>=0?'pos':'neg'}">${gain>=0?'+':''}${fmtEGP(gain)} (${gainPct.toFixed(1)}%)</div>` : ''}
            </div>
            <button class="tx-del" onclick="deleteGold('${g.id}')">🗑</button>
          </div>`;
      }).join('') : '<div class="empty-state"><div class="empty-icon">🏆</div><div class="empty-title">Vault is empty</div><div class="empty-sub">Add your first gold purchase</div></div>'}
    </div>`;
}

window.fetchGoldPrice = async function() {
  const btn = document.getElementById('fetch-gold-btn');
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }
  try {
    // Gold price in USD per troy oz
    const goldRes = await fetch('https://api.metals.live/v1/spot/gold');
    const goldJson = await goldRes.json();
    const usdPerOz = goldJson[0]?.price || goldJson?.price;

    // EGP exchange rate
    const fxRes = await fetch('https://open.er-api.com/v6/latest/USD');
    const fxJson = await fxRes.json();
    const egpRate = fxJson.rates?.EGP;

    if (!usdPerOz || !egpRate) throw new Error('Bad data');

    DATA.treasury.cachedGoldPrice = { usdPerOz, egpRate, timestamp: Date.now() };
    saveData();
    toast('✦ Gold price updated');
    renderVault(document.getElementById('treasury-view'));
  } catch(e) {
    toast('⚠ Could not fetch price — enter manually');
    showManualGoldPrice();
    if (btn) { btn.textContent = '🔄 Fetch'; btn.disabled = false; }
  }
};

function showManualGoldPrice() {
  showModal(`
    <div class="modal-title">💰 Set Gold Price</div>
    <div class="form-group">
      <label class="form-label">Gold Price (EGP per gram)</label>
      <input class="form-control" type="number" id="manual-gold-price" placeholder="e.g. 5200" inputmode="decimal">
    </div>
    <div style="font-style:italic;font-size:12px;color:var(--text-dim);margin-bottom:14px">
      Check current price at <strong>egyprices.com</strong> or any gold dealer.
    </div>
    <button class="btn btn-primary btn-full" onclick="applyManualGoldPrice()">Apply Price</button>
  `);
}

window.applyManualGoldPrice = function() {
  const price = parseFloat(document.getElementById('manual-gold-price').value);
  if (!price || price <= 0) { toast('⚠ Enter a valid price'); return; }
  // Convert back: assume 1 USD ≈ price * (1/31.1035) in EGP isn't needed — store differently
  // We'll store a synthetic manual price override
  DATA.treasury.cachedGoldPrice = {
    usdPerOz: price * 31.1035, // synthetic
    egpRate: 1,                 // synthetic
    timestamp: Date.now(),
    manualEGPperGram: price,
  };
  saveData();
  hideModal();
  toast('✦ Gold price set');
  switchTreasuryView('vault');
};

window.showAddGold = function() {
  showModal(`
    <div class="modal-title">🥇 Add Gold to Vault</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Weight (grams)</label>
        <input class="form-control" type="number" id="gold-grams" placeholder="0.00" step="0.01" inputmode="decimal">
      </div>
      <div class="form-group">
        <label class="form-label">Date of Purchase</label>
        <input class="form-control" type="date" id="gold-date" value="${today()}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Purchase Price (EGP / gram)</label>
      <input class="form-control" type="number" id="gold-price" placeholder="e.g. 5200" inputmode="decimal">
    </div>
    <div class="form-group">
      <label class="form-label">Note (optional)</label>
      <input class="form-control" type="text" id="gold-note" placeholder="21k, ring, coin…">
    </div>
    <button class="btn btn-primary btn-full" onclick="submitGold()">Store in Vault</button>
  `);
};

window.submitGold = function() {
  const grams = parseFloat(document.getElementById('gold-grams').value);
  const date  = document.getElementById('gold-date').value;
  const price = parseFloat(document.getElementById('gold-price').value);
  const note  = document.getElementById('gold-note').value.trim();
  if (!grams || grams<=0 || !price || price<=0 || !date) { toast('⚠ Fill all fields'); return; }
  DATA.treasury.goldEntries.push({ id: uid(), grams, date, pricePerGram: price, note });
  saveData();
  hideModal();
  toast('✦ Gold stored in vault');
  switchTreasuryView('vault');
};

window.deleteGold = function(id) {
  if (!confirm('Remove this gold entry?')) return;
  DATA.treasury.goldEntries = DATA.treasury.goldEntries.filter(g => g.id !== id);
  saveData();
  renderVault(document.getElementById('treasury-view'));
};

/* ════════════════════════════════════════════════
   HABITS MODULE
════════════════════════════════════════════════ */
const MOODS_HABIT = ['🌞','⭐','🔥','🌑','💤'];

function renderHabits() {
  const el = document.getElementById('tab-habits');
  const habits = DATA.habits.habits;
  const logs   = DATA.habits.logs;
  const todayStr = today();

  // Build last 7 days
  const last7 = [];
  for (let i=6; i>=0; i--) {
    const d = new Date(); d.setDate(d.getDate()-i);
    last7.push(d.toISOString().slice(0,10));
  }

  const dayLabels = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const habitsHTML = habits.map(h => {
    const doneToday = logs.some(l => l.habitId===h.id && l.date===todayStr);
    const streak = calcStreak(h.id, logs);

    const weekDots = last7.map(d => {
      const done = logs.some(l => l.habitId===h.id && l.date===d);
      const isToday = d === todayStr;
      const dObj = new Date(d+'T00:00:00');
      return `<div class="week-day">
        <div class="week-day-label">${dayLabels[dObj.getDay()]}</div>
        <div class="week-dot ${done?'done':''} ${isToday?'today':''}">${done?'✓':''}</div>
      </div>`;
    }).join('');

    return `
      <div class="habit-row">
        <div class="habit-check ${doneToday?'done':''}" onclick="toggleHabit('${h.id}')">
          ${doneToday ? '✓' : h.icon || '○'}
        </div>
        <div class="habit-info">
          <div class="habit-name">${h.name}</div>
          <div class="habit-streak">
            <span class="streak-fire">🔥</span> ${streak} day streak
          </div>
          <div class="week-grid" style="margin-top:6px">${weekDots}</div>
        </div>
        <button class="tx-del" onclick="deleteHabit('${h.id}')">🗑</button>
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="module-title">Daily Quests</div>
    <div class="module-subtitle">Forge your disciplines, one day at a time</div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div class="section-title" style="margin:0">Today — ${formatDate(todayStr)}</div>
        <span style="font-family:var(--font-title);font-size:12px;color:var(--text-dim)">${logs.filter(l=>l.date===todayStr).length}/${habits.length} done</span>
      </div>
      ${habits.length ? habitsHTML : '<div class="empty-state"><div class="empty-icon">🛡️</div><div class="empty-title">No quests yet</div><div class="empty-sub">Add habits to track daily</div></div>'}
    </div>`;

  addFAB('+', () => showAddHabit());
}

function calcStreak(habitId, logs) {
  let streak = 0;
  const d = new Date();
  while (true) {
    const dateStr = d.toISOString().slice(0,10);
    if (logs.some(l => l.habitId===habitId && l.date===dateStr)) {
      streak++;
      d.setDate(d.getDate()-1);
    } else break;
  }
  return streak;
}

window.toggleHabit = function(id) {
  const todayStr = today();
  const idx = DATA.habits.logs.findIndex(l => l.habitId===id && l.date===todayStr);
  if (idx >= 0) {
    DATA.habits.logs.splice(idx, 1);
  } else {
    DATA.habits.logs.push({ habitId: id, date: todayStr });
  }
  saveData();
  renderHabits();
};

function showAddHabit() {
  showModal(`
    <div class="modal-title">⚔ New Quest</div>
    <div class="form-group">
      <label class="form-label">Quest Name</label>
      <input class="form-control" type="text" id="habit-name" placeholder="e.g. Morning Prayer, Read, Exercise">
    </div>
    <div class="form-group">
      <label class="form-label">Icon (emoji)</label>
      <input class="form-control" type="text" id="habit-icon" placeholder="🛡️" style="max-width:80px">
    </div>
    <button class="btn btn-primary btn-full" onclick="submitHabit()">Forge Quest</button>
  `);
}

window.submitHabit = function() {
  const name = document.getElementById('habit-name').value.trim();
  const icon = document.getElementById('habit-icon').value.trim() || '🛡️';
  if (!name) { toast('⚠ Enter a quest name'); return; }
  DATA.habits.habits.push({ id: uid(), name, icon });
  saveData();
  hideModal();
  toast('✦ Quest added');
  renderHabits();
};

window.deleteHabit = function(id) {
  if (!confirm('Remove this quest?')) return;
  DATA.habits.habits = DATA.habits.habits.filter(h => h.id !== id);
  DATA.habits.logs = DATA.habits.logs.filter(l => l.habitId !== id);
  saveData();
  renderHabits();
};

/* ════════════════════════════════════════════════
   GYM MODULE
════════════════════════════════════════════════ */
function renderGym() {
  const el = document.getElementById('tab-gym');
  const sessions = DATA.gym.sessions;

  const now = new Date();
  const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate()-7);
  const monthAgo = new Date(now); monthAgo.setDate(monthAgo.getDate()-30);

  const thisWeek  = sessions.filter(s => new Date(s.date) >= weekAgo).length;
  const thisMonth = sessions.filter(s => new Date(s.date) >= monthAgo).length;
  const totalVol  = sessions.reduce((a,s) => a + (s.exercises||[]).reduce((b,ex) => b + (ex.sets||[]).reduce((c,set) => c+(set.reps||0)*(set.weight||0),0),0), 0);

  const sessHTML = [...sessions].sort((a,b) => b.date.localeCompare(a.date)).slice(0,30).map(s => {
    const exList = (s.exercises||[]).map(ex => {
      const setDetails = (ex.sets||[]).map(st => `${st.reps}×${st.weight}kg`).join(', ');
      return `<div class="exercise-row">
        <div class="exercise-name">${ex.name}</div>
        <div class="exercise-details">${setDetails || '—'}</div>
      </div>`;
    }).join('');

    return `<div class="workout-item">
      <div class="workout-header">
        <div>
          <div class="workout-type">${s.type}</div>
          <div class="workout-date">${formatDate(s.date)}</div>
        </div>
        <div style="text-align:right">
          ${s.duration ? `<div class="workout-duration">⏱ ${fmtMin(s.duration)}</div>` : ''}
          <button class="btn btn-sm btn-danger" style="margin-top:4px" onclick="deleteSession('${s.id}')">Delete</button>
        </div>
      </div>
      ${s.notes ? `<div style="font-style:italic;font-size:12px;color:var(--text-dim);margin-bottom:6px">${s.notes}</div>` : ''}
      ${exList}
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="module-title">Combat Log</div>
    <div class="module-subtitle">Record your battles, forge your legend</div>
    <div class="gym-stats-row">
      <div class="gym-stat-box">
        <div class="gym-stat-val">${thisWeek}</div>
        <div class="gym-stat-label">This Week</div>
      </div>
      <div class="gym-stat-box">
        <div class="gym-stat-val">${thisMonth}</div>
        <div class="gym-stat-label">This Month</div>
      </div>
      <div class="gym-stat-box">
        <div class="gym-stat-val">${sessions.length}</div>
        <div class="gym-stat-label">Total</div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">Sessions</div>
      ${sessions.length ? sessHTML : '<div class="empty-state"><div class="empty-icon">⚔️</div><div class="empty-title">No battles recorded</div><div class="empty-sub">Log your first workout</div></div>'}
    </div>`;

  addFAB('+', () => showAddSession());
}

function showAddSession() {
  const types = DATA.gym.workoutTypes;
  showModal(`
    <div class="modal-title">⚔ Log Battle Session</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Type</label>
        <select class="form-control" id="sess-type">
          ${types.map(t => `<option>${t}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Date</label>
        <input class="form-control" type="date" id="sess-date" value="${today()}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Duration (min)</label>
        <input class="form-control" type="number" id="sess-duration" placeholder="60" inputmode="numeric">
      </div>
      <div class="form-group">
        <label class="form-label">Notes</label>
        <input class="form-control" type="text" id="sess-notes" placeholder="How it went…">
      </div>
    </div>
    <div class="section-title" style="margin-top:8px">Exercises</div>
    <div id="exercise-list"></div>
    <button class="btn btn-sm" style="width:100%;margin-bottom:14px" onclick="addExerciseRow()">+ Add Exercise</button>
    <button class="btn btn-primary btn-full" onclick="submitSession()">Record Battle</button>
  `);
  window._exercises = [];
}

window.addExerciseRow = function() {
  window._exercises = window._exercises || [];
  const idx = window._exercises.length;
  window._exercises.push({ name:'', sets:[{reps:'',weight:''}] });
  renderExerciseList();
};

function renderExerciseList() {
  const el = document.getElementById('exercise-list');
  if (!el) return;
  el.innerHTML = (window._exercises||[]).map((ex, ei) => `
    <div style="border:1px solid var(--gold-border);border-radius:6px;padding:10px;margin-bottom:10px">
      <div style="display:flex;gap:8px;margin-bottom:8px">
        <input class="form-control" placeholder="Exercise name" value="${ex.name}" oninput="updateExName(${ei},this.value)" style="flex:1">
        <button class="btn btn-sm btn-danger" onclick="removeEx(${ei})">✕</button>
      </div>
      <div class="set-builder">
        <div class="set-row" style="background:var(--bg-stone);font-family:var(--font-title);font-size:10px;letter-spacing:0.1em;color:var(--text-dim)">
          <div>SET</div><div>REPS</div><div>WEIGHT</div><div>NOTES</div><div></div>
        </div>
        ${(ex.sets||[]).map((set, si) => `
          <div class="set-row">
            <div class="set-num">${si+1}</div>
            <input class="set-input" type="number" placeholder="12" value="${set.reps}" oninput="updateSet(${ei},${si},'reps',this.value)">
            <input class="set-input" type="number" placeholder="kg" value="${set.weight}" oninput="updateSet(${ei},${si},'weight',this.value)">
            <input class="set-input" type="text" placeholder="—" value="${set.note||''}" oninput="updateSet(${ei},${si},'note',this.value)">
            <button class="set-del-btn" onclick="removeSet(${ei},${si})">✕</button>
          </div>`).join('')}
      </div>
      <button class="btn btn-sm" style="width:100%;margin-top:8px" onclick="addSet(${ei})">+ Add Set</button>
    </div>`).join('');
}

window.updateExName = (ei, val) => { if(window._exercises[ei]) window._exercises[ei].name = val; };
window.removeEx = (ei) => { window._exercises.splice(ei,1); renderExerciseList(); };
window.addSet = (ei) => { window._exercises[ei].sets.push({reps:'',weight:'',note:''}); renderExerciseList(); };
window.removeSet = (ei,si) => { window._exercises[ei].sets.splice(si,1); renderExerciseList(); };
window.updateSet = (ei,si,field,val) => { if(window._exercises[ei] && window._exercises[ei].sets[si]) window._exercises[ei].sets[si][field] = val; };

window.submitSession = function() {
  const type     = document.getElementById('sess-type').value;
  const date     = document.getElementById('sess-date').value;
  const duration = parseInt(document.getElementById('sess-duration').value) || null;
  const notes    = document.getElementById('sess-notes').value.trim();
  if (!date) { toast('⚠ Enter a date'); return; }

  const exercises = (window._exercises||[]).filter(ex => ex.name.trim()).map(ex => ({
    name: ex.name.trim(),
    sets: ex.sets.map(s => ({
      reps: parseInt(s.reps)||0,
      weight: parseFloat(s.weight)||0,
      note: s.note||''
    }))
  }));

  DATA.gym.sessions.push({ id: uid(), type, date, duration, notes, exercises });
  saveData();
  hideModal();
  toast('✦ Battle recorded');
  renderGym();
};

window.deleteSession = function(id) {
  if (!confirm('Delete this session?')) return;
  DATA.gym.sessions = DATA.gym.sessions.filter(s => s.id !== id);
  saveData();
  renderGym();
};

/* ════════════════════════════════════════════════
   STUDY MODULE
════════════════════════════════════════════════ */
function renderStudy() {
  const el = document.getElementById('tab-study');
  const subjects = DATA.study.subjects;
  const sessions = DATA.study.sessions;
  const timer    = STATE.studyTimer;

  // Weekly hours per subject
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
  const weekSessions = sessions.filter(s => new Date(s.date) >= weekAgo);

  const weekBySubject = {};
  weekSessions.forEach(s => {
    weekBySubject[s.subjectId] = (weekBySubject[s.subjectId]||0) + s.durationMin;
  });

  const goalRows = subjects.map(sub => {
    const mins = weekBySubject[sub.id]||0;
    const goalMins = (sub.weeklyGoalHours||0)*60;
    const pct = goalMins > 0 ? Math.min(100, (mins/goalMins)*100) : 0;
    return `
      <div class="weekly-goal-row">
        <div class="wg-label">
          <div class="wg-name">${sub.name}</div>
          <div class="wg-hours">${fmtMin(mins)} / ${sub.weeklyGoalHours||0}h goal</div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width:${pct}%;background:${sub.color||'#c9a227'}"></div>
          </div>
        </div>
      </div>`;
  }).join('');

  const recentSessions = [...sessions].sort((a,b) => b.date.localeCompare(a.date)).slice(0,20).map(s => {
    const sub = subjects.find(x => x.id===s.subjectId) || {name:'Unknown',color:'#888'};
    return `<div class="study-session-row">
      <div class="study-dot" style="background:${sub.color}"></div>
      <div class="study-info">
        <div class="study-subject">${sub.name}</div>
        <div class="study-topic">${s.topic||'—'}</div>
      </div>
      <div>
        <div class="study-duration">${fmtMin(s.durationMin)}</div>
        <div class="study-date">${formatDate(s.date)}</div>
      </div>
      <button class="tx-del" onclick="deleteStudySession('${s.id}')">🗑</button>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="module-title">The Tome</div>
    <div class="module-subtitle">Every hour of study is a spell mastered</div>

    <!-- Timer -->
    <div class="card mb-12">
      <div class="section-title">Pomodoro Timer</div>
      <div class="timer-display">
        <div class="timer-clock" id="timer-clock">${fmtSec(timer.seconds)}</div>
        <div class="timer-label" id="timer-label">${timer.mode==='focus'?'⚔ Focus':'🛡 Rest'} · ${timer.subject||'No subject'}</div>
      </div>
      <div class="timer-controls">
        <button class="btn" onclick="resetTimer()">↺ Reset</button>
        <button class="btn btn-primary" onclick="toggleTimer()" id="timer-btn">
          ${timer.running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button class="btn" onclick="showLogManual()">📝 Log</button>
      </div>
      <div class="form-group mt-12">
        <label class="form-label">Subject</label>
        <select class="form-control" id="timer-subject" onchange="setTimerSubject(this.value)">
          <option value="">— Select Subject —</option>
          ${subjects.map(s => `<option value="${s.id}" ${timer.subject===s.id?'selected':''}>${s.name}</option>`).join('')}
        </select>
      </div>
    </div>

    <!-- Weekly Goals -->
    <div class="card mb-12">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div class="section-title" style="margin:0">Weekly Progress</div>
        <button class="btn btn-sm" onclick="showManageSubjects()">⚙ Subjects</button>
      </div>
      ${subjects.length ? goalRows : '<div class="empty-state" style="padding:16px"><div class="empty-title">No subjects yet</div></div>'}
    </div>

    <!-- Sessions -->
    <div class="card">
      <div class="section-title">Session Log</div>
      ${sessions.length ? recentSessions : '<div class="empty-state"><div class="empty-icon">📜</div><div class="empty-title">No sessions logged</div></div>'}
    </div>`;

  // Keep timer ticking if running
  if (timer.running) {
    clearInterval(timer.interval);
    timer.interval = setInterval(tickTimer, 1000);
  }
}

window.toggleTimer = function() {
  const timer = STATE.studyTimer;
  timer.running = !timer.running;
  if (timer.running) {
    timer.interval = setInterval(tickTimer, 1000);
  } else {
    clearInterval(timer.interval);
  }
  const btn = document.getElementById('timer-btn');
  if (btn) btn.textContent = timer.running ? '⏸ Pause' : '▶ Start';
};

function tickTimer() {
  STATE.studyTimer.seconds++;
  const el = document.getElementById('timer-clock');
  if (el) el.textContent = fmtSec(STATE.studyTimer.seconds);
}

window.resetTimer = function() {
  clearInterval(STATE.studyTimer.interval);
  STATE.studyTimer = { running: false, seconds: 0, interval: null, subject: STATE.studyTimer.subject, mode: 'focus' };
  renderStudy();
};

window.setTimerSubject = function(val) {
  STATE.studyTimer.subject = val;
};

window.showLogManual = function() {
  const subjects = DATA.study.subjects;
  const secs = STATE.studyTimer.seconds;
  const suggestedMin = Math.round(secs/60) || '';
  showModal(`
    <div class="modal-title">📜 Log Study Session</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Subject</label>
        <select class="form-control" id="log-subject">
          <option value="">— Select —</option>
          ${subjects.map(s => `<option value="${s.id}" ${STATE.studyTimer.subject===s.id?'selected':''}>${s.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Duration (min)</label>
        <input class="form-control" type="number" id="log-duration" value="${suggestedMin}" placeholder="30" inputmode="numeric">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Topic</label>
      <input class="form-control" type="text" id="log-topic" placeholder="What did you study?">
    </div>
    <div class="form-group">
      <label class="form-label">Date</label>
      <input class="form-control" type="date" id="log-date" value="${today()}">
    </div>
    <div class="form-group">
      <label class="form-label">Notes</label>
      <textarea class="form-control" id="log-notes" style="height:70px" placeholder="Key takeaways…"></textarea>
    </div>
    <button class="btn btn-primary btn-full" onclick="submitStudySession()">Record in Tome</button>
  `);
};

window.submitStudySession = function() {
  const subjectId = document.getElementById('log-subject').value;
  const duration  = parseInt(document.getElementById('log-duration').value);
  const topic     = document.getElementById('log-topic').value.trim();
  const date      = document.getElementById('log-date').value;
  const notes     = document.getElementById('log-notes').value.trim();
  if (!subjectId) { toast('⚠ Select a subject'); return; }
  if (!duration || duration<=0) { toast('⚠ Enter duration'); return; }
  DATA.study.sessions.push({ id: uid(), subjectId, durationMin: duration, topic, date, notes });
  saveData();
  // Reset timer
  window.resetTimer && resetTimer();
  hideModal();
  toast('✦ Session recorded');
  renderStudy();
};

window.deleteStudySession = function(id) {
  DATA.study.sessions = DATA.study.sessions.filter(s => s.id !== id);
  saveData();
  renderStudy();
};

window.showManageSubjects = function() {
  const subjects = DATA.study.subjects;
  const colors = ['#c9a227','#2980b9','#8e44ad','#27ae60','#e74c3c','#1abc9c','#f39c12','#3498db'];
  showModal(`
    <div class="modal-title">📚 Manage Subjects</div>
    <div id="subject-list">
      ${subjects.map(s => `
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(201,162,39,0.1)">
          <div style="width:10px;height:10px;border-radius:50%;background:${s.color}"></div>
          <span style="flex:1;font-family:var(--font-title);font-size:13px">${s.name}</span>
          <span style="font-size:12px;color:var(--text-dim)">${s.weeklyGoalHours||0}h/wk</span>
          <button class="btn btn-sm btn-danger" onclick="deleteSubject('${s.id}')">✕</button>
        </div>`).join('')}
    </div>
    <div class="divider"></div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Subject Name</label>
        <input class="form-control" type="text" id="new-sub-name" placeholder="e.g. Mathematics">
      </div>
      <div class="form-group">
        <label class="form-label">Weekly Goal (hrs)</label>
        <input class="form-control" type="number" id="new-sub-goal" placeholder="5" inputmode="numeric">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Color</label>
      <div class="color-options">
        ${colors.map((c,i) => `<div class="color-opt ${i===0?'selected':''}" style="background:${c}" data-color="${c}" onclick="selectColor(this)"></div>`).join('')}
      </div>
    </div>
    <button class="btn btn-primary btn-full" onclick="addSubject()">+ Add Subject</button>
  `);
};

window.addSubject = function() {
  const name = document.getElementById('new-sub-name').value.trim();
  const goal = parseFloat(document.getElementById('new-sub-goal').value)||0;
  const color = (document.querySelector('.color-opt.selected')||{}).dataset?.color || '#c9a227';
  if (!name) { toast('⚠ Enter a name'); return; }
  DATA.study.subjects.push({ id: uid(), name, weeklyGoalHours: goal, color });
  saveData();
  toast('✦ Subject added');
  showManageSubjects();
};

window.deleteSubject = function(id) {
  DATA.study.subjects = DATA.study.subjects.filter(s => s.id !== id);
  saveData();
  showManageSubjects();
};

/* ════════════════════════════════════════════════
   JOURNAL MODULE
════════════════════════════════════════════════ */
const MOODS = [
  { emoji:'😤', name:'Valiant', id:'valiant' },
  { emoji:'😊', name:'Content', id:'content' },
  { emoji:'😐', name:'Neutral', id:'neutral' },
  { emoji:'😔', name:'Weary',   id:'weary'   },
  { emoji:'😡', name:'Wrathful',id:'wrathful'},
];

function renderJournal() {
  const el = document.getElementById('tab-journal');
  const entries = DATA.journal.entries;
  const search  = STATE.journalSearch.toLowerCase();

  const filtered = [...entries]
    .sort((a,b) => b.date.localeCompare(a.date))
    .filter(e => !search ||
      e.title.toLowerCase().includes(search) ||
      e.content.toLowerCase().includes(search) ||
      (e.tags||[]).join(' ').toLowerCase().includes(search)
    );

  const moodCount = {};
  entries.forEach(e => { if(e.mood) moodCount[e.mood] = (moodCount[e.mood]||0)+1; });
  const dominantMood = Object.entries(moodCount).sort((a,b)=>b[1]-a[1])[0];
  const dm = dominantMood ? MOODS.find(m=>m.id===dominantMood[0]) : null;

  const entryHTML = filtered.map(e => {
    const mood = MOODS.find(m=>m.id===e.mood);
    return `
      <div class="journal-entry" onclick="viewEntry('${e.id}')">
        <div class="journal-entry-header">
          <div class="journal-title">${e.title || 'Untitled Entry'}</div>
          <div class="journal-mood-badge">${mood?.emoji||''}</div>
        </div>
        <div class="journal-date">${formatDateFull(e.date)}</div>
        <div class="journal-excerpt">${e.content}</div>
        ${(e.tags||[]).length ? `<div style="margin-top:6px">${e.tags.map(t=>`<span class="tag-chip">${t}</span>`).join('')}</div>` : ''}
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="module-title">Chronicle</div>
    <div class="module-subtitle">The written word outlives kingdoms</div>

    ${dm ? `<div class="card" style="text-align:center;padding:12px;margin-bottom:12px">
      <div style="font-style:italic;font-size:13px;color:var(--text-dim)">Dominant spirit of your chronicle</div>
      <div style="font-size:32px;margin:6px 0">${dm.emoji}</div>
      <div style="font-family:var(--font-title);font-size:12px;color:var(--gold)">${dm.name}</div>
    </div>` : ''}

    <div class="search-wrap">
      <span class="search-icon">🔍</span>
      <input class="form-control search-input" type="text" placeholder="Search the chronicles…"
        value="${STATE.journalSearch}"
        oninput="searchJournal(this.value)">
    </div>

    <div class="card">
      <div class="section-title">Entries (${entries.length})</div>
      ${filtered.length ? entryHTML : '<div class="empty-state"><div class="empty-icon">🪶</div><div class="empty-title">The chronicle is blank</div><div class="empty-sub">Write your first entry</div></div>'}
    </div>`;

  addFAB('🪶', () => showAddEntry());
}

window.searchJournal = function(val) {
  STATE.journalSearch = val;
  renderJournal();
};

window.viewEntry = function(id) {
  const e = DATA.journal.entries.find(x => x.id===id);
  if (!e) return;
  const mood = MOODS.find(m=>m.id===e.mood);
  showModal(`
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;padding-right:30px">
      <div>
        <div class="modal-title" style="margin:0;padding:0">${e.title||'Untitled'}</div>
        <div style="font-size:12px;color:var(--text-dim);margin-top:4px">${formatDateFull(e.date)} · ${mood?.emoji||''} ${mood?.name||''}</div>
      </div>
    </div>
    ${(e.tags||[]).length ? `<div style="margin-bottom:12px">${e.tags.map(t=>`<span class="tag-chip">${t}</span>`).join('')}</div>` : ''}
    <div class="divider"></div>
    <div class="entry-full-content">${e.content}</div>
    <div class="divider"></div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-danger btn-sm" onclick="deleteEntry('${e.id}')">🗑 Delete</button>
      <button class="btn btn-sm btn-primary" onclick="editEntry('${e.id}')">✏ Edit</button>
    </div>
  `);
};

function showAddEntry(prefill) {
  const e = prefill || {};
  showModal(`
    <div class="modal-title">🪶 ${e.id ? 'Edit Entry' : 'New Chronicle Entry'}</div>
    <div class="form-group">
      <label class="form-label">Title</label>
      <input class="form-control" type="text" id="entry-title" placeholder="Title of this entry…" value="${e.title||''}">
    </div>
    <div class="form-group">
      <label class="form-label">Mood</label>
      <div class="mood-selector">
        ${MOODS.map(m => `
          <div class="mood-btn ${e.mood===m.id?'selected':''}" onclick="selectMood('${m.id}',this)">
            <span class="mood-emoji">${m.emoji}</span>
            <div class="mood-name">${m.name}</div>
          </div>`).join('')}
      </div>
      <input type="hidden" id="entry-mood" value="${e.mood||''}">
    </div>
    <div class="form-group">
      <label class="form-label">Entry</label>
      <textarea class="form-control" id="entry-content" style="min-height:160px" placeholder="Write your thoughts, experiences, reflections…">${e.content||''}</textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Tags (comma-separated)</label>
        <input class="form-control" type="text" id="entry-tags" placeholder="health, work, family" value="${(e.tags||[]).join(', ')}">
      </div>
      <div class="form-group">
        <label class="form-label">Date</label>
        <input class="form-control" type="date" id="entry-date" value="${e.date||today()}">
      </div>
    </div>
    <button class="btn btn-primary btn-full" onclick="submitEntry('${e.id||''}')">Inscribe in Chronicle</button>
  `);
}

window.selectMood = function(id, el) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('entry-mood').value = id;
};

window.submitEntry = function(editId) {
  const title   = document.getElementById('entry-title').value.trim();
  const content = document.getElementById('entry-content').value.trim();
  const mood    = document.getElementById('entry-mood').value;
  const date    = document.getElementById('entry-date').value;
  const tags    = document.getElementById('entry-tags').value.split(',').map(t=>t.trim()).filter(Boolean);

  if (!content) { toast('⚠ Write something first'); return; }

  if (editId) {
    const idx = DATA.journal.entries.findIndex(e => e.id===editId);
    if (idx >= 0) Object.assign(DATA.journal.entries[idx], { title, content, mood, date, tags });
  } else {
    DATA.journal.entries.push({ id: uid(), title, content, mood, date, tags });
  }

  saveData();
  hideModal();
  toast('✦ Inscribed in the chronicle');
  renderJournal();
};

window.editEntry = function(id) {
  const e = DATA.journal.entries.find(x=>x.id===id);
  if (e) showAddEntry(e);
};

window.deleteEntry = function(id) {
  if (!confirm('Remove this chronicle entry forever?')) return;
  DATA.journal.entries = DATA.journal.entries.filter(e => e.id!==id);
  saveData();
  hideModal();
  toast('Entry removed');
  renderJournal();
};

/* ════════════════════════════════════════════════
   SHARED UTILS
════════════════════════════════════════════════ */
function addFAB(label, onClick) {
  document.querySelectorAll('.fab').forEach(f => f.remove());
  const fab = document.createElement('button');
  fab.className = 'fab';
  fab.textContent = label;
  fab.addEventListener('click', onClick);
  document.body.appendChild(fab);
}

/* ════════════════════════════════════════════════
   SERVICE WORKER REGISTRATION
════════════════════════════════════════════════ */
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.warn('SW registration failed:', err);
    });
  }
}

/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
function init() {
  loadData();
  setupNav();
  renderHome();
  registerSW();
}

document.addEventListener('DOMContentLoaded', init);

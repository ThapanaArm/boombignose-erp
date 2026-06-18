// ==========================================
//  BOOMBIGNOSE ERP — Admin JS
// ==========================================

// ── Seed Data ──────────────────────────────
const CUSTOMERS = [
  { id: 1, name: 'Somchai Jaidee',    company: 'Mega Corp Ltd',      email: 'somchai@megacorp.th',   phone: '+66 81 234 5678', orders: 24, spend: 480000 },
  { id: 2, name: 'Nattaya Wongsiri',  company: 'TechStart Co., Ltd', email: 'nattaya@techstart.th',  phone: '+66 82 345 6789', orders: 18, spend: 234500 },
  { id: 3, name: 'Prayut Chaiwat',    company: 'Golden Gate Trading', email: 'prayut@goldengate.th', phone: '+66 83 456 7890', orders: 31, spend: 612000 },
  { id: 4, name: 'Siriporn Kamol',    company: 'Sun Flower Import',  email: 'siriporn@sunflower.th', phone: '+66 84 567 8901', orders: 9,  spend: 98400  },
  { id: 5, name: 'Wanchai Boontham',  company: 'Blue Ocean Co.',     email: 'wanchai@blueocean.th',  phone: '+66 85 678 9012', orders: 15, spend: 187600 },
  { id: 6, name: 'Kanokwan Srisuk',   company: 'K&K Supplies',       email: 'kanok@kksupplies.th',   phone: '+66 86 789 0123', orders: 7,  spend: 73200  },
  { id: 7, name: 'Thanakon Pimpa',    company: 'River City Trade',   email: 'thana@rivercity.th',    phone: '+66 87 890 1234', orders: 22, spend: 340100 },
  { id: 8, name: 'Malee Somboon',     company: 'Lotus Market Co.',   email: 'malee@lotusmarket.th',  phone: '+66 88 901 2345', orders: 11, spend: 129800 },
];

const PRODUCTS = [
  { id: 1, sku: 'BBN-E001', name: 'Laptop Pro X',        category: 'Electronics',    price: 42000,  stock: 48,  reorder: 10, status: 'Active'   },
  { id: 2, sku: 'BBN-E002', name: 'Wireless Keyboard',   category: 'Electronics',    price: 1890,   stock: 124, reorder: 20, status: 'Active'   },
  { id: 3, sku: 'BBN-E003', name: 'USB-C Hub 7-Port',    category: 'Electronics',    price: 1290,   stock: 7,   reorder: 15, status: 'Low Stock'},
  { id: 4, sku: 'BBN-O001', name: 'A4 Paper (500 sh.)',  category: 'Office Supplies', price: 140,   stock: 850, reorder: 100,status: 'Active'   },
  { id: 5, sku: 'BBN-O002', name: 'Ballpoint Pens 12pk', category: 'Office Supplies', price: 89,    stock: 5,   reorder: 50, status: 'Low Stock'},
  { id: 6, sku: 'BBN-F001', name: 'Ergonomic Chair',     category: 'Furniture',      price: 8900,   stock: 22,  reorder: 5,  status: 'Active'   },
  { id: 7, sku: 'BBN-F002', name: 'Standing Desk 140cm', category: 'Furniture',      price: 12500,  stock: 0,   reorder: 3,  status: 'Out of Stock'},
  { id: 8, sku: 'BBN-S001', name: 'ERP License (1yr)',   category: 'Software',       price: 29880,  stock: 999, reorder: 0,  status: 'Active'   },
];

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const DEPTS    = ['Sales', 'Finance', 'Operations', 'IT', 'HR', 'Marketing'];

let orders    = generateOrders(40);
let customers = [...CUSTOMERS];
let products  = [...PRODUCTS];
let invoices  = generateInvoices(20);
let employees = generateEmployees(12);

function generateOrders(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    const c = CUSTOMERS[(i - 1) % CUSTOMERS.length];
    const p = PRODUCTS[(i - 1) % PRODUCTS.length];
    const qty = Math.ceil(Math.random() * 5);
    const d = new Date(2026, 4, Math.ceil(Math.random() * 30));
    out.push({
      id: `ORD-${String(1000 + i).padStart(5,'0')}`,
      customer: c.name, product: p.name, qty,
      total: p.price * qty,
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      date: d.toISOString().slice(0,10),
    });
  }
  return out.reverse();
}

function generateInvoices(n) {
  const statuses = ['Paid','Paid','Unpaid','Overdue'];
  return Array.from({length: n}, (_, i) => {
    const c = CUSTOMERS[i % CUSTOMERS.length];
    const due = new Date(2026, 4 + Math.floor(i/4), 10 + (i % 20));
    return {
      id: `INV-${String(2600 + i + 1).padStart(5,'0')}`,
      customer: c.name,
      amount: Math.round((Math.random() * 50000 + 5000) / 100) * 100,
      due: due.toISOString().slice(0,10),
      status: statuses[i % statuses.length],
    };
  });
}

function generateEmployees(n) {
  const names = ['Ariya Suk','Bunthai Chaem','Chanaporn Dee','Duangjai Mee','Ekkachai Rat',
                 'Fah Wongsuk','Gamon Talee','Hathai Boon','Isara Panya','Jirawat Kae',
                 'Kratae Nut','Lalita Mook'];
  const positions = { Sales:'Sales Executive', Finance:'Accountant', Operations:'Warehouse Staff',
                      IT:'Developer', HR:'HR Officer', Marketing:'Marketing Exec' };
  return names.slice(0, n).map((name, i) => {
    const dept = DEPTS[i % DEPTS.length];
    return {
      id: `EMP-${String(100 + i + 1)}`,
      name, dept, position: positions[dept],
      salary: Math.round((25000 + Math.random() * 45000) / 1000) * 1000,
      status: i < 10 ? 'Active' : 'On Leave',
    };
  });
}

// ── Pagination helpers ─────────────────────
function paginate(arr, page, perPage = 8) {
  const start = (page - 1) * perPage;
  return { items: arr.slice(start, start + perPage), total: arr.length, pages: Math.ceil(arr.length / perPage) };
}

function renderPageBtns(containerId, current, total, onPage) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = '';
  for (let i = 1; i <= total; i++) {
    const b = document.createElement('div');
    b.className = 'page-btn' + (i === current ? ' active' : '');
    b.textContent = i;
    b.onclick = () => onPage(i);
    c.appendChild(b);
  }
}

// ── Formatting ────────────────────────────
const fmt = n => '฿' + Number(n).toLocaleString();

function statusBadge(s) {
  const map = {
    Delivered: 'green', Paid: 'green', Active: 'green',
    Processing: 'blue',
    Pending: 'orange', Unpaid: 'orange', 'Low Stock': 'orange', 'On Leave': 'orange',
    Shipped: 'purple',
    Cancelled: 'red', Overdue: 'red', 'Out of Stock': 'red',
  };
  return `<span class="badge badge-${map[s] || 'muted'}">${s}</span>`;
}

// ── Page navigation ────────────────────────
let currentPage = 'dashboard';
const pageTitles = {
  dashboard: ['Dashboard', 'Welcome back, Admin'],
  orders:    ['Orders', 'Manage customer orders'],
  customers: ['Customers', 'View and manage customers'],
  products:  ['Products', 'Product catalogue'],
  invoices:  ['Invoices', 'Billing & invoices'],
  finance:   ['Accounting', 'Financial overview'],
  inventory: ['Inventory', 'Stock levels & warehouses'],
  hr:        ['HR & Payroll', 'Employee management'],
  reports:   ['Reports & Analytics', 'Business intelligence'],
  settings:  ['Settings', 'System configuration'],
};

function switchPage(id) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelector(`[data-page="${id}"]`).classList.add('active');
  const [title, sub] = pageTitles[id] || [id, ''];
  document.getElementById('topbarTitle').textContent = title;
  document.getElementById('topbarSub').textContent   = sub;
  currentPage = id;
  renderPage(id);
}

document.querySelectorAll('.nav-item[data-page]').forEach(el => {
  el.addEventListener('click', () => switchPage(el.dataset.page));
});

// ── Render each page ──────────────────────
let orderPage = 1, custPage = 1, prodPage = 1;

function renderPage(id) {
  if (id === 'dashboard')  renderDashboard();
  if (id === 'orders')     renderOrders();
  if (id === 'customers')  renderCustomers();
  if (id === 'products')   renderProducts();
  if (id === 'invoices')   renderInvoices();
  if (id === 'finance')    renderFinance();
  if (id === 'inventory')  renderInventory();
  if (id === 'hr')         renderHR();
  if (id === 'reports')    renderReports();
}

// Dashboard
function renderDashboard() {
  renderRecentOrders();
  renderRevenueChart();
  renderDonut();
}

function renderRecentOrders() {
  const tbody = document.getElementById('recentOrdersBody');
  if (!tbody) return;
  tbody.innerHTML = orders.slice(0, 6).map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customer}</td>
      <td>${o.qty}× ${o.product}</td>
      <td>${fmt(o.total)}</td>
      <td>${statusBadge(o.status)}</td>
      <td>${o.date}</td>
    </tr>`).join('');
}

function renderRevenueChart() {
  const el = document.getElementById('revenueChart');
  if (!el) return;
  const months = ['Jan','Feb','Mar','Apr','May','Jun'];
  const vals   = [1820000,2100000,2800000,2200000,2418500,1950000];
  const max    = Math.max(...vals);
  const maxPx  = 120;
  el.innerHTML = months.map((m, i) => `
    <div class="bar-group">
      <div class="bar-fill" style="height:${Math.round(vals[i]/max*maxPx)}px"></div>
      <div class="bar-label">${m}</div>
    </div>`).join('');
}

function renderDonut() {
  const svg  = document.getElementById('donutChart');
  const leg  = document.getElementById('donutLegend');
  if (!svg || !leg) return;
  const data = [
    { label:'Delivered', val:42, color:'#10b981' },
    { label:'Shipped',   val:18, color:'#8b5cf6' },
    { label:'Processing',val:22, color:'#3b82f6' },
    { label:'Pending',   val:12, color:'#f59e0b' },
    { label:'Cancelled', val:6,  color:'#ef4444' },
  ];
  const total = data.reduce((s, d) => s + d.val, 0);
  const cx = 60, cy = 60, r = 48, stroke = 16;
  let offset = 0;
  const circumference = 2 * Math.PI * (r - stroke / 2);
  svg.innerHTML = data.map(d => {
    const pct  = d.val / total;
    const dash = pct * circumference;
    const gap  = circumference - dash;
    const rot  = offset * 360;
    offset += pct;
    return `<circle cx="${cx}" cy="${cy}" r="${r - stroke/2}"
      fill="none" stroke="${d.color}" stroke-width="${stroke}"
      stroke-dasharray="${dash} ${gap}"
      stroke-dashoffset="${circumference * 0.25 - offset * circumference + dash}"
      transform="rotate(${rot - 90} ${cx} ${cy})" />`;
  }).join('') + `<text x="${cx}" y="${cy+4}" text-anchor="middle" font-size="14" font-weight="700" fill="#e2e8f0">${total}</text>`;
  leg.innerHTML = data.map(d => `
    <div class="legend-item">
      <span class="legend-dot" style="background:${d.color}"></span>
      <span class="legend-label">${d.label}</span>
      <span class="legend-val">${d.val}</span>
    </div>`).join('');
}

// Orders
function renderOrders() {
  const filter = document.getElementById('orderFilter')?.value || 'all';
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const { items, total, pages } = paginate(filtered, orderPage);
  const tbody = document.getElementById('ordersBody');
  if (!tbody) return;
  tbody.innerHTML = items.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customer}</td>
      <td>${o.qty}× ${o.product}</td>
      <td>${fmt(o.total)}</td>
      <td>${statusBadge(o.status)}</td>
      <td>${o.date}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="editStatus('${o.id}')">Edit</button>
      </td>
    </tr>`).join('');
  document.getElementById('orderPagInfo').textContent = `${total} orders`;
  renderPageBtns('orderPageBtns', orderPage, pages, p => { orderPage = p; renderOrders(); });
}

document.getElementById('orderFilter')?.addEventListener('change', () => { orderPage = 1; renderOrders(); });

function editStatus(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  const s = prompt(`Current status: ${o.status}\nNew status (Pending/Processing/Shipped/Delivered/Cancelled):`, o.status);
  if (s && STATUSES.includes(s)) { o.status = s; renderOrders(); }
}

// Customers
function renderCustomers() {
  const q = (document.getElementById('customerSearch')?.value || '').toLowerCase();
  const filtered = q ? customers.filter(c =>
    c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  ) : customers;
  const { items, total, pages } = paginate(filtered, custPage);
  const tbody = document.getElementById('customersBody');
  if (!tbody) return;
  tbody.innerHTML = items.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.company}</td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td>${c.orders}</td>
      <td>${fmt(c.spend)}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteCustomer(${c.id})">Delete</button></td>
    </tr>`).join('');
  document.getElementById('custPagInfo').textContent = `${total} customers`;
  renderPageBtns('custPageBtns', custPage, pages, p => { custPage = p; renderCustomers(); });
}

document.getElementById('customerSearch')?.addEventListener('input', () => { custPage = 1; renderCustomers(); });

function deleteCustomer(id) {
  if (!confirm('Delete this customer?')) return;
  customers = customers.filter(c => c.id !== id);
  renderCustomers();
}

// Products
function renderProducts() {
  const cat = document.getElementById('productCategoryFilter')?.value || 'all';
  const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
  const { items, total, pages } = paginate(filtered, prodPage);
  const tbody = document.getElementById('productsBody');
  if (!tbody) return;
  tbody.innerHTML = items.map(p => `
    <tr>
      <td><code style="font-size:11px;color:#818cf8">${p.sku}</code></td>
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td>${fmt(p.price)}</td>
      <td>${p.stock}</td>
      <td>${statusBadge(p.status)}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">Delete</button></td>
    </tr>`).join('');
  document.getElementById('prodPagInfo').textContent = `${total} products`;
  renderPageBtns('prodPageBtns', prodPage, pages, p => { prodPage = p; renderProducts(); });
}

document.getElementById('productCategoryFilter')?.addEventListener('change', () => { prodPage = 1; renderProducts(); });

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  products = products.filter(p => p.id !== id);
  renderProducts();
}

// Invoices
function renderInvoices() {
  const tbody = document.getElementById('invoicesBody');
  if (!tbody) return;
  tbody.innerHTML = invoices.map(inv => `
    <tr>
      <td><strong>${inv.id}</strong></td>
      <td>${inv.customer}</td>
      <td>${fmt(inv.amount)}</td>
      <td>${inv.due}</td>
      <td>${statusBadge(inv.status)}</td>
      <td>
        <button class="btn btn-outline btn-sm">View</button>
        <button class="btn btn-outline btn-sm" style="margin-left:4px">PDF</button>
      </td>
    </tr>`).join('');
}

// Finance
function renderFinance() {
  const tbody = document.getElementById('financeBody');
  if (!tbody) return;
  const entries = [
    { date:'2026-06-17', desc:'Sales Revenue — ORD-01040', account:'4100 Revenue',      debit:0,       credit:48000,  balance:14248000 },
    { date:'2026-06-17', desc:'Accounts Receivable',        account:'1100 AR',           debit:48000,   credit:0,      balance:14296000 },
    { date:'2026-06-16', desc:'Office Supplies Purchase',   account:'6200 Expenses',     debit:12400,   credit:0,      balance:14248000 },
    { date:'2026-06-16', desc:'Cash Payment',               account:'1000 Cash',         debit:0,       credit:12400,  balance:14235600 },
    { date:'2026-06-15', desc:'Payroll — June 2026',        account:'6100 Salaries',     debit:860000,  credit:0,      balance:14223200 },
    { date:'2026-06-15', desc:'Bank Transfer Out',          account:'1010 Bank',         debit:0,       credit:860000, balance:13363200 },
    { date:'2026-06-14', desc:'Sales Revenue — ORD-01039', account:'4100 Revenue',      debit:0,       credit:84000,  balance:13363200 },
    { date:'2026-06-13', desc:'Shipping Expense',           account:'6300 Logistics',    debit:3200,    credit:0,      balance:13279200 },
  ];
  tbody.innerHTML = entries.map(e => `
    <tr>
      <td>${e.date}</td>
      <td>${e.desc}</td>
      <td><code style="font-size:11px;color:#818cf8">${e.account}</code></td>
      <td>${e.debit  ? fmt(e.debit)  : '—'}</td>
      <td>${e.credit ? fmt(e.credit) : '—'}</td>
      <td>${fmt(e.balance)}</td>
    </tr>`).join('');
}

// Inventory
function renderInventory() {
  const tbody = document.getElementById('inventoryBody');
  if (!tbody) return;
  tbody.innerHTML = products.map(p => `
    <tr>
      <td><code style="font-size:11px;color:#818cf8">${p.sku}</code></td>
      <td>${p.name}</td>
      <td>Bangkok Warehouse</td>
      <td>${p.stock}</td>
      <td>${p.reorder}</td>
      <td>${statusBadge(p.status)}</td>
    </tr>`).join('');
}

// HR
function renderHR() {
  const tbody = document.getElementById('hrBody');
  if (!tbody) return;
  tbody.innerHTML = employees.map(e => `
    <tr>
      <td><strong>${e.name}</strong><div style="font-size:11px;color:#8b8bac">${e.id}</div></td>
      <td>${e.dept}</td>
      <td>${e.position}</td>
      <td>${fmt(e.salary)}</td>
      <td>${statusBadge(e.status)}</td>
      <td><button class="btn btn-outline btn-sm">Edit</button></td>
    </tr>`).join('');
}

// Reports
function renderReports() {
  const el = document.getElementById('categoryChart');
  if (!el) return;
  const cats = [
    { name:'Electronics', val:68, color:'var(--blue)' },
    { name:'Software',    val:52, color:'var(--purple)' },
    { name:'Furniture',   val:34, color:'var(--orange)' },
    { name:'Office',      val:28, color:'var(--green)' },
  ];
  el.innerHTML = cats.map(c => `
    <div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
        <span>${c.name}</span><span style="color:var(--muted)">${c.val}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${c.val}%;background:${c.color}"></div>
      </div>
    </div>`).join('');
}

// ── Modals ────────────────────────────────
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  // Populate customer selects
  const custSelects = modal.querySelectorAll('select[id$="Cust"]');
  custSelects.forEach(sel => {
    sel.innerHTML = customers.map(c => `<option>${c.name}</option>`).join('');
  });
  const prodSel = modal.querySelector('#newOrderProd');
  if (prodSel) prodSel.innerHTML = products.map(p => `<option>${p.name}</option>`).join('');
  modal.classList.add('open');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ── CRUD actions ──────────────────────────
function addOrder() {
  const cust = document.getElementById('newOrderCust')?.value;
  const prod = document.getElementById('newOrderProd')?.value;
  const qty  = 1;
  const p    = products.find(x => x.name === prod);
  orders.unshift({
    id: `ORD-${String(1000 + orders.length + 1).padStart(5,'0')}`,
    customer: cust, product: prod, qty,
    total: (p?.price || 0) * qty,
    status: 'Pending',
    date: new Date().toISOString().slice(0,10),
  });
  closeModal('orderModal');
  renderOrders();
}

function addCustomer() {
  const name    = document.getElementById('newCustName')?.value.trim();
  const company = document.getElementById('newCustCompany')?.value.trim();
  const email   = document.getElementById('newCustEmail')?.value.trim();
  const phone   = document.getElementById('newCustPhone')?.value.trim();
  if (!name || !email) { alert('Name and email are required.'); return; }
  customers.push({ id: Date.now(), name, company, email, phone, orders: 0, spend: 0 });
  closeModal('customerModal');
  renderCustomers();
}

function addProduct() {
  const name    = document.getElementById('newProdName')?.value.trim();
  const sku     = document.getElementById('newProdSku')?.value.trim();
  const cat     = document.getElementById('newProdCat')?.value;
  const price   = Number(document.getElementById('newProdPrice')?.value) || 0;
  const stock   = Number(document.getElementById('newProdStock')?.value) || 0;
  const reorder = Number(document.getElementById('newProdReorder')?.value) || 10;
  if (!name || !sku) { alert('Name and SKU are required.'); return; }
  const status  = stock === 0 ? 'Out of Stock' : stock <= reorder ? 'Low Stock' : 'Active';
  products.push({ id: Date.now(), sku, name, category: cat, price, stock, reorder, status });
  closeModal('productModal');
  renderProducts();
}

function addInvoice() {
  const customer = document.getElementById('newInvCust')?.value;
  const amount   = Number(document.getElementById('newInvAmount')?.value) || 0;
  const due      = document.getElementById('newInvDue')?.value || '2026-07-18';
  invoices.unshift({
    id: `INV-${String(2600 + invoices.length + 1).padStart(5,'0')}`,
    customer, amount, due, status: 'Unpaid',
  });
  closeModal('invoiceModal');
  renderInvoices();
}

function addEmployee() {
  const name   = document.getElementById('newEmpName')?.value.trim();
  const dept   = document.getElementById('newEmpDept')?.value;
  const pos    = document.getElementById('newEmpPos')?.value.trim();
  const salary = Number(document.getElementById('newEmpSalary')?.value) || 25000;
  if (!name) { alert('Name is required.'); return; }
  employees.push({
    id: `EMP-${String(100 + employees.length + 1)}`,
    name, dept, position: pos, salary, status: 'Active',
  });
  closeModal('hrModal');
  renderHR();
}

// ── Settings tabs ─────────────────────────
document.querySelectorAll('.settings-nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.settings-nav-item').forEach(x => x.classList.remove('active'));
    item.classList.add('active');
    const tab = item.dataset.tab;
    document.querySelectorAll('[id^="settings-"]').forEach(s => s.style.display = 'none');
    const el = document.getElementById('settings-' + tab);
    if (el) el.style.display = 'block';
  });
});

// ── Init ──────────────────────────────────
renderDashboard();

// ==========================================
//  BoomBigNose ERP — Seed data & generators
//
//  Generation is DETERMINISTIC (seeded PRNG + fixed dates) so the
//  server-rendered markup matches the client and React does not throw
//  hydration mismatches. Mutations happen only via the client store.
// ==========================================

import type { Customer, Product, Order, Invoice, Employee, OrderStatus } from "./types";

export const STATUSES: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const DEPTS = ["Sales", "Finance", "Operations", "IT", "HR", "Marketing"];

export const CATEGORIES = ["Electronics", "Office Supplies", "Furniture", "Software"];

export const CUSTOMERS: Customer[] = [
  { id: 1, name: "Somchai Jaidee",   company: "Mega Corp Ltd",       email: "somchai@megacorp.th",   phone: "+66 81 234 5678", orders: 24, spend: 480000 },
  { id: 2, name: "Nattaya Wongsiri", company: "TechStart Co., Ltd",  email: "nattaya@techstart.th",  phone: "+66 82 345 6789", orders: 18, spend: 234500 },
  { id: 3, name: "Prayut Chaiwat",   company: "Golden Gate Trading", email: "prayut@goldengate.th",  phone: "+66 83 456 7890", orders: 31, spend: 612000 },
  { id: 4, name: "Siriporn Kamol",   company: "Sun Flower Import",   email: "siriporn@sunflower.th", phone: "+66 84 567 8901", orders: 9,  spend: 98400  },
  { id: 5, name: "Wanchai Boontham", company: "Blue Ocean Co.",      email: "wanchai@blueocean.th",  phone: "+66 85 678 9012", orders: 15, spend: 187600 },
  { id: 6, name: "Kanokwan Srisuk",  company: "K&K Supplies",        email: "kanok@kksupplies.th",   phone: "+66 86 789 0123", orders: 7,  spend: 73200  },
  { id: 7, name: "Thanakon Pimpa",   company: "River City Trade",    email: "thana@rivercity.th",    phone: "+66 87 890 1234", orders: 22, spend: 340100 },
  { id: 8, name: "Malee Somboon",    company: "Lotus Market Co.",    email: "malee@lotusmarket.th",  phone: "+66 88 901 2345", orders: 11, spend: 129800 },
];

export const PRODUCTS: Product[] = [
  { id: 1, sku: "BBN-E001", name: "Laptop Pro X",        category: "Electronics",    price: 42000, stock: 48,  reorder: 10,  status: "Active"       },
  { id: 2, sku: "BBN-E002", name: "Wireless Keyboard",   category: "Electronics",    price: 1890,  stock: 124, reorder: 20,  status: "Active"       },
  { id: 3, sku: "BBN-E003", name: "USB-C Hub 7-Port",    category: "Electronics",    price: 1290,  stock: 7,   reorder: 15,  status: "Low Stock"    },
  { id: 4, sku: "BBN-O001", name: "A4 Paper (500 sh.)",  category: "Office Supplies", price: 140,  stock: 850, reorder: 100, status: "Active"       },
  { id: 5, sku: "BBN-O002", name: "Ballpoint Pens 12pk", category: "Office Supplies", price: 89,   stock: 5,   reorder: 50,  status: "Low Stock"    },
  { id: 6, sku: "BBN-F001", name: "Ergonomic Chair",     category: "Furniture",      price: 8900,  stock: 22,  reorder: 5,   status: "Active"       },
  { id: 7, sku: "BBN-F002", name: "Standing Desk 140cm", category: "Furniture",      price: 12500, stock: 0,   reorder: 3,   status: "Out of Stock" },
  { id: 8, sku: "BBN-S001", name: "ERP License (1yr)",   category: "Software",       price: 29880, stock: 999, reorder: 0,   status: "Active"       },
];

/** Deterministic PRNG (mulberry32) — stable output across server & client. */
function makeRng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateOrders(n: number): Order[] {
  const rng = makeRng(1337);
  const out: Order[] = [];
  for (let i = 1; i <= n; i++) {
    const c = CUSTOMERS[(i - 1) % CUSTOMERS.length];
    const p = PRODUCTS[(i - 1) % PRODUCTS.length];
    const qty = Math.ceil(rng() * 5);
    const day = Math.ceil(rng() * 28);
    const d = new Date(Date.UTC(2026, 4, day));
    out.push({
      id: `ORD-${String(1000 + i).padStart(5, "0")}`,
      customer: c.name,
      product: p.name,
      qty,
      total: p.price * qty,
      status: STATUSES[Math.floor(rng() * STATUSES.length)],
      date: d.toISOString().slice(0, 10),
    });
  }
  return out.reverse();
}

export function generateInvoices(n: number): Invoice[] {
  const rng = makeRng(2024);
  const statuses = ["Paid", "Paid", "Unpaid", "Overdue"] as const;
  return Array.from({ length: n }, (_, i) => {
    const c = CUSTOMERS[i % CUSTOMERS.length];
    const due = new Date(Date.UTC(2026, 4 + Math.floor(i / 4), 10 + (i % 20)));
    return {
      id: `INV-${String(2600 + i + 1).padStart(5, "0")}`,
      customer: c.name,
      amount: Math.round((rng() * 50000 + 5000) / 100) * 100,
      due: due.toISOString().slice(0, 10),
      status: statuses[i % statuses.length],
    };
  });
}

export function generateEmployees(n: number): Employee[] {
  const rng = makeRng(777);
  const names = [
    "Ariya Suk", "Bunthai Chaem", "Chanaporn Dee", "Duangjai Mee",
    "Ekkachai Rat", "Fah Wongsuk", "Gamon Talee", "Hathai Boon",
    "Isara Panya", "Jirawat Kae", "Kratae Nut", "Lalita Mook",
  ];
  const positions: Record<string, string> = {
    Sales: "Sales Executive",
    Finance: "Accountant",
    Operations: "Warehouse Staff",
    IT: "Developer",
    HR: "HR Officer",
    Marketing: "Marketing Exec",
  };
  return names.slice(0, n).map((name, i) => {
    const dept = DEPTS[i % DEPTS.length];
    return {
      id: `EMP-${String(100 + i + 1)}`,
      name,
      dept,
      position: positions[dept],
      salary: Math.round((25000 + rng() * 45000) / 1000) * 1000,
      status: i < 10 ? "Active" : "On Leave",
    };
  });
}

// Precomputed seed collections (deterministic).
export const seedOrders = generateOrders(40);
export const seedInvoices = generateInvoices(20);
export const seedEmployees = generateEmployees(12);

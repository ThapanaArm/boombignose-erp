export interface NavLink {
  slug: string;
  label: string;
  icon: string;
  badge?: string;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Main",
    links: [
      { slug: "dashboard", label: "Dashboard", icon: "📊" },
      { slug: "orders", label: "Orders", icon: "🛒", badge: "4" },
      { slug: "customers", label: "Customers", icon: "👥" },
      { slug: "products", label: "Products", icon: "📦" },
    ],
  },
  {
    title: "Finance",
    links: [
      { slug: "invoices", label: "Invoices", icon: "🧾" },
      { slug: "finance", label: "Accounting", icon: "💰" },
    ],
  },
  {
    title: "Operations",
    links: [
      { slug: "inventory", label: "Inventory", icon: "🏭" },
      { slug: "hr", label: "HR & Payroll", icon: "🪪" },
      { slug: "reports", label: "Reports", icon: "📈" },
    ],
  },
  {
    title: "System",
    links: [{ slug: "settings", label: "Settings", icon: "⚙️" }],
  },
];

/** route slug → [topbar title, subtitle] */
export const PAGE_TITLES: Record<string, [string, string]> = {
  dashboard: ["Dashboard", "Welcome back, Admin"],
  orders: ["Orders", "Manage customer orders"],
  customers: ["Customers", "View and manage customers"],
  products: ["Products", "Product catalogue"],
  invoices: ["Invoices", "Billing & invoices"],
  finance: ["Accounting", "Financial overview"],
  inventory: ["Inventory", "Stock levels & warehouses"],
  hr: ["HR & Payroll", "Employee management"],
  reports: ["Reports & Analytics", "Business intelligence"],
  settings: ["Settings", "System configuration"],
};

"use client";

import KpiCard from "@/app/components/admin/KpiCard";

const CATS = [
  { name: "Electronics", val: 68, color: "var(--blue)" },
  { name: "Software", val: 52, color: "var(--purple)" },
  { name: "Furniture", val: 34, color: "var(--orange)" },
  { name: "Office", val: 28, color: "var(--green)" },
];

const EXPORTS = [
  "📄 Sales Report (PDF)",
  "📊 P&L Statement (Excel)",
  "📦 Stock Report (Excel)",
  "🪪 Payroll Summary (PDF)",
  "🧾 Tax Report (Thai)",
];

const small: React.CSSProperties = { fontSize: 18 };

export default function ReportsPage() {
  return (
    <>
      <div className="kpi-grid">
        <KpiCard color="blue" icon="📊" label="Top Product" value="Laptop Pro X" valueStyle={small} change="482 units sold" />
        <KpiCard color="green" icon="🏆" label="Top Customer" value="Mega Corp Ltd" valueStyle={small} change="฿480,000 total" />
        <KpiCard color="orange" icon="📅" label="Best Month" value="March 2026" valueStyle={small} change="฿2.8M revenue" />
        <KpiCard color="purple" icon="📉" label="Avg Order Value" value="฿1,884" change="▲ 6.2% vs last mo." />
      </div>
      <div className="charts-row">
        <div className="chart-card">
          <h3>Sales by Category</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
            {CATS.map((c) => (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span>{c.name}</span>
                  <span style={{ color: "var(--muted)" }}>{c.val}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${c.val}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <h3>Quick Export</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {EXPORTS.map((label) => (
              <button key={label} className="btn btn-outline" style={{ justifyContent: "flex-start", gap: 12 }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { fmt } from "@/lib/format";
import KpiCard from "@/app/components/admin/KpiCard";

interface Entry {
  date: string;
  desc: string;
  account: string;
  debit: number;
  credit: number;
  balance: number;
}

const ENTRIES: Entry[] = [
  { date: "2026-06-17", desc: "Sales Revenue — ORD-01040", account: "4100 Revenue",  debit: 0,      credit: 48000,  balance: 14248000 },
  { date: "2026-06-17", desc: "Accounts Receivable",        account: "1100 AR",       debit: 48000,  credit: 0,      balance: 14296000 },
  { date: "2026-06-16", desc: "Office Supplies Purchase",   account: "6200 Expenses", debit: 12400,  credit: 0,      balance: 14248000 },
  { date: "2026-06-16", desc: "Cash Payment",               account: "1000 Cash",     debit: 0,      credit: 12400,  balance: 14235600 },
  { date: "2026-06-15", desc: "Payroll — June 2026",        account: "6100 Salaries", debit: 860000, credit: 0,      balance: 14223200 },
  { date: "2026-06-15", desc: "Bank Transfer Out",          account: "1010 Bank",     debit: 0,      credit: 860000, balance: 13363200 },
  { date: "2026-06-14", desc: "Sales Revenue — ORD-01039", account: "4100 Revenue",  debit: 0,      credit: 84000,  balance: 13363200 },
  { date: "2026-06-13", desc: "Shipping Expense",           account: "6300 Logistics",debit: 3200,   credit: 0,      balance: 13279200 },
];

export default function FinancePage() {
  return (
    <>
      <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <KpiCard color="green" icon="📈" label="Total Income (YTD)" value="฿14.2M" change="▲ 18% YoY" />
        <KpiCard color="red" icon="📉" label="Total Expenses (YTD)" value="฿9.8M" change="▲ 11% YoY" changeDir="down" />
        <KpiCard color="blue" icon="💵" label="Net Profit (YTD)" value="฿4.4M" change="▲ 31% YoY" />
      </div>
      <div className="table-card">
        <div className="table-header">
          <h3>Journal Entries</h3>
          <button className="btn btn-primary btn-sm">+ New Entry</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Description</th><th>Account</th><th>Debit</th><th>Credit</th><th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {ENTRIES.map((e, i) => (
              <tr key={i}>
                <td>{e.date}</td>
                <td>{e.desc}</td>
                <td><code style={{ fontSize: 11, color: "#818cf8" }}>{e.account}</code></td>
                <td>{e.debit ? fmt(e.debit) : "—"}</td>
                <td>{e.credit ? fmt(e.credit) : "—"}</td>
                <td>{fmt(e.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

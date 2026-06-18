"use client";

import Link from "next/link";
import { useErp } from "@/lib/store";
import { fmt } from "@/lib/format";
import KpiCard from "@/app/components/admin/KpiCard";
import BarChart from "@/app/components/admin/BarChart";
import DonutChart from "@/app/components/admin/DonutChart";
import Badge from "@/app/components/admin/Badge";

export default function DashboardPage() {
  const { orders } = useErp();
  const recent = orders.slice(0, 6);

  return (
    <>
      <div className="kpi-grid">
        <KpiCard color="blue" icon="💰" label="Total Revenue (MTD)" value="฿2,418,500" change="▲ 12.4% vs last month" />
        <KpiCard color="green" icon="🛒" label="New Orders" value="1,284" change="▲ 8.1% vs last month" />
        <KpiCard color="orange" icon="👥" label="Active Customers" value="348" change="▲ 3.2% vs last month" />
        <KpiCard color="purple" icon="📦" label="Low Stock Items" value="17" change="▲ 5 more than last week" changeDir="down" />
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Monthly Revenue (฿)</h3>
          <BarChart
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
            values={[1820000, 2100000, 2800000, 2200000, 2418500, 1950000]}
          />
        </div>
        <div className="chart-card">
          <h3>Orders by Status</h3>
          <DonutChart />
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <h3>Recent Orders</h3>
          <div className="table-actions">
            <Link href="/admin/orders" className="btn btn-outline btn-sm">View All →</Link>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id}>
                <td><strong>{o.id}</strong></td>
                <td>{o.customer}</td>
                <td>{o.qty}× {o.product}</td>
                <td>{fmt(o.total)}</td>
                <td><Badge status={o.status} /></td>
                <td>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

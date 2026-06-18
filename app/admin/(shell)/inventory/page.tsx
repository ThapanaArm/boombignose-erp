"use client";

import { useErp } from "@/lib/store";
import Badge from "@/app/components/admin/Badge";

export default function InventoryPage() {
  const { products } = useErp();

  return (
    <>
      <div className="summary-row">
        <div className="summary-card">
          <div className="summary-icon blue">📦</div>
          <div className="summary-text"><strong>1,842</strong><span>Total SKUs</span></div>
        </div>
        <div className="summary-card">
          <div className="summary-icon orange">⚠️</div>
          <div className="summary-text"><strong>17</strong><span>Low Stock Alerts</span></div>
        </div>
        <div className="summary-card">
          <div className="summary-icon green">✅</div>
          <div className="summary-text"><strong>฿12.4M</strong><span>Inventory Value</span></div>
        </div>
      </div>
      <div className="table-card">
        <div className="table-header">
          <h3>Stock Levels</h3>
          <div className="table-actions">
            <button className="btn btn-outline btn-sm">Export</button>
            <button className="btn btn-primary btn-sm">+ Stock In</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>SKU</th><th>Product</th><th>Warehouse</th><th>On Hand</th><th>Reorder Pt.</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><code style={{ fontSize: 11, color: "#818cf8" }}>{p.sku}</code></td>
                <td>{p.name}</td>
                <td>Bangkok Warehouse</td>
                <td>{p.stock}</td>
                <td>{p.reorder}</td>
                <td><Badge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

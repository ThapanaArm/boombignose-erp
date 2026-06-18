"use client";

import { useState } from "react";
import { useErp } from "@/lib/store";
import { fmt } from "@/lib/format";
import { STATUSES } from "@/lib/data";
import type { OrderStatus } from "@/lib/types";
import Badge from "@/app/components/admin/Badge";
import Modal from "@/app/components/admin/Modal";
import Pagination, { paginate } from "@/app/components/admin/Pagination";

export default function OrdersPage() {
  const { orders, customers, products, addOrder, updateOrderStatus } = useErp();
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  // New-order form state
  const [custName, setCustName] = useState(customers[0]?.name ?? "");
  const [prodName, setProdName] = useState(products[0]?.name ?? "");
  const [status, setStatus] = useState<OrderStatus>("Pending");
  const [qty, setQty] = useState(1);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const { items, total, pages } = paginate(filtered, page);

  const handleCreate = () => {
    addOrder(custName, prodName, qty, status);
    setOpen(false);
    setPage(1);
  };

  const handleEdit = (id: string, current: OrderStatus) => {
    const next = window.prompt(
      `Current status: ${current}\nNew status (Pending/Processing/Shipped/Delivered/Cancelled):`,
      current
    );
    if (next && (STATUSES as string[]).includes(next)) {
      updateOrderStatus(id, next as OrderStatus);
    }
  };

  return (
    <>
      <div className="table-card">
        <div className="table-header">
          <h3>All Orders</h3>
          <div className="table-actions">
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>+ New Order</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((o) => (
              <tr key={o.id}>
                <td><strong>{o.id}</strong></td>
                <td>{o.customer}</td>
                <td>{o.qty}× {o.product}</td>
                <td>{fmt(o.total)}</td>
                <td><Badge status={o.status} /></td>
                <td>{o.date}</td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => handleEdit(o.id, o.status)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination info={`${total} orders`} current={page} pages={pages} onPage={setPage} />
      </div>

      <Modal
        open={open}
        title="New Order"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Create Order</button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group">
            <label>Customer</label>
            <select value={custName} onChange={(e) => setCustName(e.target.value)}>
              {customers.map((c) => <option key={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
              {STATUSES.filter((s) => s !== "Cancelled").map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Product</label>
            <select value={prodName} onChange={(e) => setProdName(e.target.value)}>
              {products.map((p) => <option key={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
          </div>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea rows={2} placeholder="Optional notes..." />
        </div>
      </Modal>
    </>
  );
}

"use client";

import { useState } from "react";
import { useErp } from "@/lib/store";
import { fmt } from "@/lib/format";
import Badge from "@/app/components/admin/Badge";
import Modal from "@/app/components/admin/Modal";

export default function InvoicesPage() {
  const { invoices, customers, addInvoice } = useErp();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);

  const [customer, setCustomer] = useState(customers[0]?.name ?? "");
  const [amount, setAmount] = useState(0);
  const [due, setDue] = useState("2026-07-18");

  const filtered = filter === "All" ? invoices : invoices.filter((i) => i.status === filter);

  const handleCreate = () => {
    addInvoice(customer, amount, due);
    setAmount(0);
    setOpen(false);
  };

  return (
    <>
      <div className="table-card">
        <div className="table-header">
          <h3>Invoices</h3>
          <div className="table-actions">
            <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option><option>Paid</option><option>Unpaid</option><option>Overdue</option>
            </select>
            <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>+ Create Invoice</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Invoice #</th><th>Customer</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id}>
                <td><strong>{inv.id}</strong></td>
                <td>{inv.customer}</td>
                <td>{fmt(inv.amount)}</td>
                <td>{inv.due}</td>
                <td><Badge status={inv.status} /></td>
                <td>
                  <button className="btn btn-outline btn-sm">View</button>
                  <button className="btn btn-outline btn-sm" style={{ marginLeft: 4 }}>PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title="Create Invoice"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Create Invoice</button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group">
            <label>Customer</label>
            <select value={customer} onChange={(e) => setCustomer(e.target.value)}>
              {customers.map((c) => <option key={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label>Amount (฿)</label>
          <input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea rows={2} placeholder="Payment terms, etc." />
        </div>
      </Modal>
    </>
  );
}

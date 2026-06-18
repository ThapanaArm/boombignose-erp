"use client";

import { useState } from "react";
import { useErp } from "@/lib/store";
import { fmt } from "@/lib/format";
import Modal from "@/app/components/admin/Modal";
import Pagination, { paginate } from "@/app/components/admin/Pagination";

export default function CustomersPage() {
  const { customers, addCustomer, deleteCustomer } = useErp();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const q = query.toLowerCase();
  const filtered = q
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      )
    : customers;
  const { items, total, pages } = paginate(filtered, page);

  const handleAdd = () => {
    if (!name.trim() || !email.trim()) {
      window.alert("Name and email are required.");
      return;
    }
    addCustomer({ name: name.trim(), company: company.trim(), email: email.trim(), phone: phone.trim() });
    setName(""); setCompany(""); setEmail(""); setPhone("");
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this customer?")) deleteCustomer(id);
  };

  return (
    <>
      <div className="table-card">
        <div className="table-header">
          <h3>Customers</h3>
          <div className="table-actions">
            <div className="search-box" style={{ padding: "5px 10px" }}>
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search customers..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                style={{ width: 160 }}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>+ Add Customer</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Company</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spend</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td>{c.company}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.orders}</td>
                <td>{fmt(c.spend)}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination info={`${total} customers`} current={page} pages={pages} onPage={setPage} />
      </div>

      <Modal
        open={open}
        title="Add Customer"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd}>Add Customer</button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Somchai Jaidee" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input type="text" placeholder="Company Co., Ltd." value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="email@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" placeholder="+66 8x xxx xxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
      </Modal>
    </>
  );
}

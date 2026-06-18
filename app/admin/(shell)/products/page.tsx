"use client";

import { useState } from "react";
import { useErp } from "@/lib/store";
import { fmt } from "@/lib/format";
import { CATEGORIES } from "@/lib/data";
import Badge from "@/app/components/admin/Badge";
import Modal from "@/app/components/admin/Modal";
import Pagination, { paginate } from "@/app/components/admin/Pagination";

export default function ProductsPage() {
  const { products, addProduct, deleteProduct } = useErp();
  const [cat, setCat] = useState("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [reorder, setReorder] = useState(10);

  const filtered = cat === "all" ? products : products.filter((p) => p.category === cat);
  const { items, total, pages } = paginate(filtered, page);

  const handleAdd = () => {
    if (!name.trim() || !sku.trim()) {
      window.alert("Name and SKU are required.");
      return;
    }
    addProduct({ name: name.trim(), sku: sku.trim(), category, price, stock, reorder });
    setName(""); setSku(""); setPrice(0); setStock(0); setReorder(10);
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this product?")) deleteProduct(id);
  };

  return (
    <>
      <div className="table-card">
        <div className="table-header">
          <h3>Products</h3>
          <div className="table-actions">
            <select className="filter-select" value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }}>
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>+ Add Product</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>SKU</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td><code style={{ fontSize: 11, color: "#818cf8" }}>{p.sku}</code></td>
                <td><strong>{p.name}</strong></td>
                <td>{p.category}</td>
                <td>{fmt(p.price)}</td>
                <td>{p.stock}</td>
                <td><Badge status={p.status} /></td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination info={`${total} products`} current={page} pages={pages} onPage={setPage} />
      </div>

      <Modal
        open={open}
        title="Add Product"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd}>Add Product</button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>SKU</label>
            <input type="text" placeholder="BBN-001" value={sku} onChange={(e) => setSku(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Price (฿)</label>
            <input type="number" placeholder="0" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Initial Stock</label>
            <input type="number" placeholder="0" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Reorder Point</label>
            <input type="number" placeholder="10" value={reorder} onChange={(e) => setReorder(Number(e.target.value))} />
          </div>
        </div>
      </Modal>
    </>
  );
}

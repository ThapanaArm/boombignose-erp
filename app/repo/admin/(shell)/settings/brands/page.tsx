"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/app/components/admin/Modal";
import Pagination, { paginate } from "@/app/components/admin/Pagination";
import type { Brand } from "@/lib/repo-brands";

export default function BrandsPage() {
  const [items, setItems] = useState<Brand[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [edit, setEdit] = useState<Brand | null>(null);
  const [form, setForm] = useState({ name: "", active: true });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetch("/api/repo/brands").then((r) => r.json()).then((d) => setItems(d.brands));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ name: "", active: true }); setAddOpen(true); };
  const openEdit = (b: Brand) => { setEdit(b); setForm({ name: b.name, active: b.active }); };

  const save = async () => {
    if (!form.name.trim()) { alert("กรุณากรอกชื่อยี่ห้อ"); return; }
    setSaving(true);
    if (edit) {
      await fetch(`/api/repo/brands/${edit.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setEdit(null);
    } else {
      await fetch("/api/repo/brands", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setAddOpen(false);
    }
    setSaving(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("ลบยี่ห้อนี้?")) return;
    await fetch(`/api/repo/brands/${id}`, { method: "DELETE" });
    load();
  };

  const q = query.toLowerCase();
  const filtered = items.filter((b) => !q || b.name.toLowerCase().includes(q));
  const { items: rows, total, pages } = paginate(filtered, page, 10);

  const modalForm = (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div className="form-group">
        <label>ชื่อยี่ห้อ *</label>
        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="เช่น TOYOTA" />
      </div>
      <div className="form-group">
        <label>สถานะ</label>
        <select value={form.active ? "1" : "0"} onChange={(e) => setForm((f) => ({ ...f, active: e.target.value === "1" }))}>
          <option value="1">ใช้งาน</option>
          <option value="0">ปิดใช้งาน</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      <div className="table-card">
        <div className="table-header">
          <h3>🏷️ ยี่ห้อรถยนต์</h3>
          <div className="table-actions">
            <div className="search-box" style={{ padding: "5px 10px" }}>
              <span>🔍</span>
              <input type="text" placeholder="ค้นหายี่ห้อ..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} style={{ width: 180 }} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={openAdd}>+ เพิ่มยี่ห้อ</button>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>รหัส</th><th>ชื่อยี่ห้อ</th><th>สถานะ</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id}>
                <td style={{ color: "var(--muted)" }}>{b.id}</td>
                <td style={{ fontWeight: 700 }}>{b.name}</td>
                <td>
                  <span style={{ background: (b.active ? "var(--green)" : "var(--muted)") + "22", color: b.active ? "var(--green)" : "var(--muted)", border: `1px solid ${(b.active ? "var(--green)" : "var(--muted)")}44`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                    {b.active ? "ใช้งาน" : "ปิดใช้งาน"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(b)}>แก้ไข</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(b.id)}>ลบ</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination info={`${total} ยี่ห้อ`} current={page} pages={pages} onPage={setPage} />
      </div>

      <Modal open={addOpen} title="เพิ่มยี่ห้อรถยนต์" onClose={() => setAddOpen(false)}
        footer={<>
          <button className="btn btn-outline" onClick={() => setAddOpen(false)}>ยกเลิก</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "กำลังบันทึก..." : "เพิ่ม"}</button>
        </>}>
        {modalForm}
      </Modal>

      <Modal open={!!edit} title={`แก้ไขยี่ห้อ: ${edit?.name}`} onClose={() => setEdit(null)}
        footer={<>
          <button className="btn btn-outline" onClick={() => setEdit(null)}>ยกเลิก</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "กำลังบันทึก..." : "บันทึก"}</button>
        </>}>
        {modalForm}
      </Modal>
    </>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/app/components/admin/Modal";
import Pagination, { paginate } from "@/app/components/admin/Pagination";
import type { Institution } from "@/lib/repo-institutions";

const EMPTY = { name: "", code: "", contactName: "", phone: "", active: true };

export default function InstitutionsPage() {
  const [items, setItems] = useState<Institution[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [edit, setEdit] = useState<Institution | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetch("/api/repo/institutions").then((r) => r.json()).then((d) => setItems(d.institutions));
  }, []);
  useEffect(() => { load(); }, [load]);

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: k === "active" ? e.target.value === "1" : e.target.value }));

  const openAdd = () => { setForm({ ...EMPTY }); setAddOpen(true); };
  const openEdit = (x: Institution) => {
    setEdit(x);
    setForm({ name: x.name, code: x.code, contactName: x.contactName, phone: x.phone, active: x.active });
  };

  const save = async () => {
    if (!form.name.trim()) { alert("กรุณากรอกชื่อสถาบัน"); return; }
    setSaving(true);
    if (edit) {
      await fetch(`/api/repo/institutions/${edit.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setEdit(null);
    } else {
      await fetch("/api/repo/institutions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setAddOpen(false);
    }
    setSaving(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("ลบสถาบันนี้?")) return;
    await fetch(`/api/repo/institutions/${id}`, { method: "DELETE" });
    load();
  };

  const q = query.toLowerCase();
  const filtered = items.filter((x) => !q || x.name.toLowerCase().includes(q) || x.code.toLowerCase().includes(q));
  const { items: rows, total, pages } = paginate(filtered, page, 10);

  const modalForm = (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div className="form-row">
        <div className="form-group">
          <label>ชื่อสถาบันสินเชื่อ *</label>
          <input value={form.name} onChange={f("name")} placeholder="เช่น กรุงศรี ออโต้" />
        </div>
        <div className="form-group">
          <label>รหัสย่อ</label>
          <input value={form.code} onChange={f("code")} placeholder="เช่น KSA" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>ผู้ติดต่อ / ฝ่าย</label>
          <input value={form.contactName} onChange={f("contactName")} placeholder="ฝ่ายเร่งรัดหนี้สิน" />
        </div>
        <div className="form-group">
          <label>เบอร์โทรศัพท์</label>
          <input value={form.phone} onChange={f("phone")} placeholder="02-xxx-xxxx" />
        </div>
      </div>
      <div className="form-group">
        <label>สถานะ</label>
        <select value={form.active ? "1" : "0"} onChange={f("active")}>
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
          <h3>🏦 สถาบันสินเชื่อ</h3>
          <div className="table-actions">
            <div className="search-box" style={{ padding: "5px 10px" }}>
              <span>🔍</span>
              <input type="text" placeholder="ค้นหาสถาบัน / รหัส..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} style={{ width: 200 }} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={openAdd}>+ เพิ่มสถาบัน</button>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>ชื่อสถาบัน</th><th>รหัส</th><th>ผู้ติดต่อ</th><th>โทรศัพท์</th><th>สถานะ</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td style={{ fontWeight: 700 }}>{x.name}</td>
                <td><span style={{ color: "var(--muted)" }}>{x.code || "—"}</span></td>
                <td>{x.contactName || "—"}</td>
                <td>{x.phone || "—"}</td>
                <td>
                  <span style={{ background: (x.active ? "var(--green)" : "var(--muted)") + "22", color: x.active ? "var(--green)" : "var(--muted)", border: `1px solid ${(x.active ? "var(--green)" : "var(--muted)")}44`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                    {x.active ? "ใช้งาน" : "ปิดใช้งาน"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(x)}>แก้ไข</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(x.id)}>ลบ</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination info={`${total} สถาบัน`} current={page} pages={pages} onPage={setPage} />
      </div>

      <Modal open={addOpen} title="เพิ่มสถาบันสินเชื่อ" onClose={() => setAddOpen(false)}
        footer={<>
          <button className="btn btn-outline" onClick={() => setAddOpen(false)}>ยกเลิก</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "กำลังบันทึก..." : "เพิ่ม"}</button>
        </>}>
        {modalForm}
      </Modal>

      <Modal open={!!edit} title={`แก้ไข: ${edit?.name}`} onClose={() => setEdit(null)}
        footer={<>
          <button className="btn btn-outline" onClick={() => setEdit(null)}>ยกเลิก</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "กำลังบันทึก..." : "บันทึก"}</button>
        </>}>
        {modalForm}
      </Modal>
    </>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/app/components/admin/Modal";
import Pagination, { paginate } from "@/app/components/admin/Pagination";
import type { PublicAgent, AgentStatus } from "@/lib/repo-agents";

const STATUS: { value: AgentStatus; label: string; color: string }[] = [
  { value: "available", label: "พร้อมรับงาน", color: "var(--green)" },
  { value: "busy",      label: "กำลังปฏิบัติงาน", color: "var(--orange)" },
  { value: "off",       label: "ไม่พร้อม",     color: "var(--muted)" },
];
const statusOf = (s: AgentStatus) => STATUS.find((x) => x.value === s) ?? STATUS[0];

const EMPTY = { name: "", username: "", password: "", phone: "", zone: "", status: "available" as AgentStatus };

export default function AgentsPage() {
  const [items, setItems] = useState<PublicAgent[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [edit, setEdit] = useState<PublicAgent | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetch("/api/repo/agents").then((r) => r.json()).then((d) => setItems(d.agents));
  }, []);
  useEffect(() => { load(); }, [load]);

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const openAdd = () => { setForm({ ...EMPTY }); setAddOpen(true); };
  const openEdit = (a: PublicAgent) => {
    setEdit(a);
    setForm({ name: a.name, username: a.username, password: "", phone: a.phone, zone: a.zone, status: a.status });
  };

  const save = async () => {
    if (!form.name.trim()) { alert("กรุณากรอกชื่อพนักงาน"); return; }
    if (!form.username.trim()) { alert("กรุณากรอก Username"); return; }
    if (!edit && !form.password.trim()) { alert("กรุณากรอกรหัสผ่าน"); return; }
    setSaving(true);
    if (edit) {
      await fetch(`/api/repo/agents/${edit.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setEdit(null);
    } else {
      await fetch("/api/repo/agents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setAddOpen(false);
    }
    setSaving(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("ลบพนักงานคนนี้?")) return;
    await fetch(`/api/repo/agents/${id}`, { method: "DELETE" });
    load();
  };

  const q = query.toLowerCase();
  const filtered = items.filter((a) => !q || a.name.toLowerCase().includes(q) || a.zone.toLowerCase().includes(q) || a.username.toLowerCase().includes(q));
  const { items: rows, total, pages } = paginate(filtered, page, 10);

  const modalForm = (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div className="form-row">
        <div className="form-group">
          <label>ชื่อ-นามสกุล *</label>
          <input value={form.name} onChange={f("name")} placeholder="ชื่อ นามสกุล" />
        </div>
        <div className="form-group">
          <label>เบอร์โทรศัพท์</label>
          <input value={form.phone} onChange={f("phone")} placeholder="08X-XXX-XXXX" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Username * (ใช้เข้าสู่ระบบ)</label>
          <input value={form.username} onChange={f("username")} placeholder="เช่น anucha" />
        </div>
        <div className="form-group">
          <label>{edit ? "รหัสผ่าน (เว้นว่าง = ไม่เปลี่ยน)" : "รหัสผ่าน *"}</label>
          <input type="text" value={form.password} onChange={f("password")} placeholder={edit ? "••••••" : "รหัสผ่าน"} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>พื้นที่รับผิดชอบ</label>
          <input value={form.zone} onChange={f("zone")} placeholder="เช่น กรุงเทพฯ และปริมณฑล" />
        </div>
        <div className="form-group">
          <label>สถานะ</label>
          <select value={form.status} onChange={f("status")}>
            {STATUS.map((st) => <option key={st.value} value={st.value}>{st.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="table-card">
        <div className="table-header">
          <h3>🧑‍✈️ พนักงานสนาม</h3>
          <div className="table-actions">
            <div className="search-box" style={{ padding: "5px 10px" }}>
              <span>🔍</span>
              <input type="text" placeholder="ค้นหาชื่อ / username / พื้นที่..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} style={{ width: 200 }} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={openAdd}>+ เพิ่มพนักงาน</button>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>รหัส</th><th>ชื่อ-นามสกุล</th><th>Username</th><th>โทรศัพท์</th><th>พื้นที่</th><th>สถานะ</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const st = statusOf(a.status);
              return (
                <tr key={a.id}>
                  <td style={{ color: "var(--muted)" }}>{a.id}</td>
                  <td style={{ fontWeight: 700 }}>{a.name}</td>
                  <td><code style={{ fontSize: 12 }}>{a.username || "—"}</code></td>
                  <td>{a.phone || "—"}</td>
                  <td>{a.zone || "—"}</td>
                  <td>
                    <span style={{ background: st.color + "22", color: st.color, border: `1px solid ${st.color}44`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                      {st.label}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(a)}>แก้ไข</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(a.id)}>ลบ</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination info={`${total} คน`} current={page} pages={pages} onPage={setPage} />
      </div>

      <Modal open={addOpen} title="เพิ่มพนักงานสนาม" onClose={() => setAddOpen(false)}
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

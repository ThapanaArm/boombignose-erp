"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/app/components/admin/Modal";
import Pagination, { paginate } from "@/app/components/admin/Pagination";
import type { Loan, LoanStatus } from "@/lib/repo-store";

const STATUS_OPTS: { value: LoanStatus; label: string; color: string }[] = [
  { value: "active",       label: "ปกติ",               color: "var(--green)" },
  { value: "overdue",      label: "ค้างชำระ",            color: "var(--orange)" },
  { value: "repossession", label: "อยู่ระหว่างยึดรถ",    color: "var(--red)" },
  { value: "repossessed",  label: "ยึดรถแล้ว",           color: "var(--purple)" },
  { value: "settled",      label: "ปิดบัญชีแล้ว",        color: "var(--blue)" },
];

const STATUS_COLORS: Record<LoanStatus, string> = {
  active:       "var(--green)",
  overdue:      "var(--orange)",
  repossession: "var(--red)",
  repossessed:  "var(--purple)",
  settled:      "var(--blue)",
};

const fmt = (n: number) =>
  n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

const EMPTY_FORM = {
  contractNo: "", borrowerName: "", borrowerIdNo: "", phone: "",
  vehicleInfo: "", licensePlate: "",
  loanAmount: "", monthlyPayment: "",
  startDate: "", endDate: "",
  overdueMonths: "0", overdueAmount: "0",
  status: "active" as LoanStatus,
  lastPaymentDate: "", notes: "",
};

export default function RepoAdminPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [editLoan, setEditLoan] = useState<Loan | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetch("/api/repo/loans")
      .then((r) => r.json())
      .then((d) => setLoans(d.loans));
  }, []);

  useEffect(() => { load(); }, [load]);

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const openAdd = () => { setForm({ ...EMPTY_FORM }); setAddOpen(true); };
  const openEdit = (loan: Loan) => {
    setEditLoan(loan);
    setForm({
      contractNo: loan.contractNo, borrowerName: loan.borrowerName,
      borrowerIdNo: loan.borrowerIdNo, phone: loan.phone,
      vehicleInfo: loan.vehicleInfo, licensePlate: loan.licensePlate,
      loanAmount: String(loan.loanAmount), monthlyPayment: String(loan.monthlyPayment),
      startDate: loan.startDate, endDate: loan.endDate,
      overdueMonths: String(loan.overdueMonths), overdueAmount: String(loan.overdueAmount),
      status: loan.status, lastPaymentDate: loan.lastPaymentDate ?? "", notes: loan.notes,
    });
  };

  const handleSave = async () => {
    if (!form.contractNo || !form.borrowerName) {
      alert("กรุณากรอกเลขที่สัญญาและชื่อผู้กู้"); return;
    }
    setSaving(true);
    const body = {
      ...form,
      loanAmount: Number(form.loanAmount),
      monthlyPayment: Number(form.monthlyPayment),
      overdueMonths: Number(form.overdueMonths),
      overdueAmount: Number(form.overdueAmount),
      lastPaymentDate: form.lastPaymentDate || null,
    };
    if (editLoan) {
      await fetch(`/api/repo/loans/${editLoan.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setEditLoan(null);
    } else {
      await fetch("/api/repo/loans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setAddOpen(false);
    }
    setSaving(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบรายการนี้?")) return;
    await fetch(`/api/repo/loans/${id}`, { method: "DELETE" });
    load();
  };

  const handleStatusChange = async (id: string, status: LoanStatus) => {
    await fetch(`/api/repo/loans/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const q = query.toLowerCase();
  const filtered = loans.filter((l) => {
    const matchQ = !q || l.contractNo.toLowerCase().includes(q) || l.borrowerName.toLowerCase().includes(q) || l.licensePlate.toLowerCase().includes(q);
    const matchS = filterStatus === "all" || l.status === filterStatus;
    return matchQ && matchS;
  });
  const { items, total, pages } = paginate(filtered, page, 10);

  const overdueCount = loans.filter((l) => l.status === "overdue" || l.status === "repossession").length;
  const totalOverdue = loans.reduce((s, l) => s + l.overdueAmount, 0);

  const modalForm = (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div className="form-row">
        <div className="form-group">
          <label>เลขที่สัญญา *</label>
          <input value={form.contractNo} onChange={f("contractNo")} placeholder="CNT-2024-XXX" />
        </div>
        <div className="form-group">
          <label>สถานะ</label>
          <select value={form.status} onChange={f("status")}>
            {STATUS_OPTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>ชื่อ-นามสกุลผู้กู้ *</label>
          <input value={form.borrowerName} onChange={f("borrowerName")} placeholder="ชื่อ นามสกุล" />
        </div>
        <div className="form-group">
          <label>เลขบัตรประชาชน</label>
          <input value={form.borrowerIdNo} onChange={f("borrowerIdNo")} placeholder="1-1001-XXXXX-XX-X" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>เบอร์โทรศัพท์</label>
          <input value={form.phone} onChange={f("phone")} placeholder="08X-XXX-XXXX" />
        </div>
        <div className="form-group">
          <label>ทะเบียนรถ</label>
          <input value={form.licensePlate} onChange={f("licensePlate")} placeholder="กข-1234 กรุงเทพฯ" />
        </div>
      </div>
      <div className="form-group">
        <label>รายละเอียดรถยนต์</label>
        <input value={form.vehicleInfo} onChange={f("vehicleInfo")} placeholder="ยี่ห้อ รุ่น ปี สี" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>วงเงินกู้ (บาท)</label>
          <input type="number" value={form.loanAmount} onChange={f("loanAmount")} placeholder="0" />
        </div>
        <div className="form-group">
          <label>ผ่อน/เดือน (บาท)</label>
          <input type="number" value={form.monthlyPayment} onChange={f("monthlyPayment")} placeholder="0" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>วันเริ่มสัญญา</label>
          <input type="date" value={form.startDate} onChange={f("startDate")} />
        </div>
        <div className="form-group">
          <label>วันสิ้นสุดสัญญา</label>
          <input type="date" value={form.endDate} onChange={f("endDate")} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>งวดค้างชำระ</label>
          <input type="number" value={form.overdueMonths} onChange={f("overdueMonths")} />
        </div>
        <div className="form-group">
          <label>ยอดค้างชำระ (บาท)</label>
          <input type="number" value={form.overdueAmount} onChange={f("overdueAmount")} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>ชำระล่าสุด</label>
          <input type="date" value={form.lastPaymentDate} onChange={f("lastPaymentDate")} />
        </div>
      </div>
      <div className="form-group">
        <label>หมายเหตุ</label>
        <textarea value={form.notes} onChange={f("notes")} rows={3} style={{ resize: "vertical", padding: 10, borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontSize: 13 }} />
      </div>
    </div>
  );

  return (
    <>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "สัญญาทั้งหมด", value: loans.length, icon: "📋", color: "var(--blue)" },
          { label: "ค้างชำระ / ยึดรถ", value: overdueCount, icon: "⚠️", color: "var(--red)" },
          { label: "ยอดค้างรวม", value: fmt(totalOverdue), icon: "💰", color: "var(--orange)", small: true },
          { label: "ยึดรถแล้ว", value: loans.filter((l) => l.status === "repossessed").length, icon: "🔒", color: "var(--purple)" },
        ].map((k) => (
          <div key={k.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{k.icon}</div>
            <div style={{ fontSize: k.small ? 18 : 28, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-header">
          <h3>🚗 สัญญาสินเชื่อรถยนต์</h3>
          <div className="table-actions">
            <div className="search-box" style={{ padding: "5px 10px" }}>
              <span>🔍</span>
              <input
                type="text" placeholder="ค้นหาสัญญา / ชื่อ / ทะเบียน..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                style={{ width: 200 }}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              style={{ padding: "6px 10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontSize: 12 }}
            >
              <option value="all">สถานะทั้งหมด</option>
              {STATUS_OPTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={openAdd}>+ เพิ่มสัญญา</button>
            <a href="/repo" target="_blank" className="btn btn-outline btn-sm">🌐 หน้าค้นหา</a>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>เลขที่สัญญา</th>
              <th>ชื่อผู้กู้</th>
              <th>ทะเบียนรถ</th>
              <th>งวด/เดือน</th>
              <th>ค้างชำระ</th>
              <th>สถานะ</th>
              <th>เปลี่ยนสถานะ</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((loan) => (
              <tr key={loan.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>{loan.contractNo}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{loan.id}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{loan.borrowerName}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{loan.phone}</div>
                </td>
                <td>
                  <div>{loan.licensePlate}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{loan.vehicleInfo.slice(0, 30)}…</div>
                </td>
                <td>{fmt(loan.monthlyPayment)}</td>
                <td>
                  {loan.overdueMonths > 0 ? (
                    <div>
                      <div style={{ color: "var(--red)", fontWeight: 700 }}>{fmt(loan.overdueAmount)}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{loan.overdueMonths} งวด</div>
                    </div>
                  ) : <span style={{ color: "var(--muted)" }}>—</span>}
                </td>
                <td>
                  <span style={{
                    background: STATUS_COLORS[loan.status] + "22",
                    color: STATUS_COLORS[loan.status],
                    border: `1px solid ${STATUS_COLORS[loan.status]}44`,
                    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  }}>
                    {STATUS_OPTS.find((s) => s.value === loan.status)?.label ?? loan.status}
                  </span>
                </td>
                <td>
                  <select
                    value={loan.status}
                    onChange={(e) => handleStatusChange(loan.id, e.target.value as LoanStatus)}
                    style={{ padding: "4px 6px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontSize: 11 }}
                  >
                    {STATUS_OPTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(loan)}>แก้ไข</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(loan.id)}>ลบ</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination info={`${total} รายการ`} current={page} pages={pages} onPage={setPage} />
      </div>

      {/* Add Modal */}
      <Modal
        open={addOpen}
        title="เพิ่มสัญญาสินเชื่อใหม่"
        onClose={() => setAddOpen(false)}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setAddOpen(false)}>ยกเลิก</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "กำลังบันทึก..." : "เพิ่มสัญญา"}</button>
          </>
        }
      >
        {modalForm}
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editLoan}
        title={`แก้ไขสัญญา: ${editLoan?.contractNo}`}
        onClose={() => setEditLoan(null)}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setEditLoan(null)}>ยกเลิก</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "กำลังบันทึก..." : "บันทึก"}</button>
          </>
        }
      >
        {modalForm}
      </Modal>
    </>
  );
}

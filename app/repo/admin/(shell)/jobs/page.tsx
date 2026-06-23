"use client";

import { useState, useEffect, useCallback } from "react";
import Pagination, { paginate } from "@/app/components/admin/Pagination";
import type { Job, JobStatus } from "@/lib/repo-jobs";
import type { FieldAgent } from "@/lib/repo-agents";
import type { Institution } from "@/lib/repo-institutions";

const STATUS: { value: JobStatus; label: string; color: string }[] = [
  { value: "new",         label: "ใหม่",            color: "var(--blue)" },
  { value: "assigned",    label: "มอบหมายแล้ว",     color: "var(--purple)" },
  { value: "in_progress", label: "กำลังดำเนินการ",  color: "var(--orange)" },
  { value: "found",       label: "พบรถแล้ว",        color: "var(--green)" },
  { value: "repossessed", label: "ยึดรถสำเร็จ",     color: "var(--green)" },
  { value: "closed",      label: "ปิดงาน",          color: "var(--muted)" },
  { value: "cancelled",   label: "ยกเลิก",          color: "var(--red)" },
];
const statusOf = (s: JobStatus) => STATUS.find((x) => x.value === s) ?? STATUS[0];
const fmt = (n: number) => n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [agents, setAgents] = useState<FieldAgent[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    fetch("/api/repo/jobs").then((r) => r.json()).then((d) => setJobs(d.jobs));
  }, []);
  useEffect(() => {
    load();
    fetch("/api/repo/agents").then((r) => r.json()).then((d) => setAgents(d.agents));
    fetch("/api/repo/institutions").then((r) => r.json()).then((d) => setInstitutions(d.institutions));
  }, [load]);

  const instName = (id: string | null) => institutions.find((x) => x.id === id)?.name;

  const patch = async (id: string, body: Partial<Job>) => {
    await fetch(`/api/repo/jobs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    load();
  };

  const assign = (job: Job, agentId: string) =>
    patch(job.id, {
      assignedAgentId: agentId || null,
      status: agentId && job.status === "new" ? "assigned" : (!agentId && job.status === "assigned" ? "new" : job.status),
    });

  const del = async (id: string) => {
    if (!confirm("ลบงานนี้?")) return;
    await fetch(`/api/repo/jobs/${id}`, { method: "DELETE" });
    load();
  };

  const q = query.toLowerCase();
  const filtered = jobs.filter((j) => {
    const matchQ = !q || j.contractNo.toLowerCase().includes(q) || j.borrowerName.toLowerCase().includes(q) || j.licensePlate.toLowerCase().includes(q) || j.brand.toLowerCase().includes(q);
    const matchS = filterStatus === "all" || j.status === filterStatus;
    return matchQ && matchS;
  });
  const { items, total, pages } = paginate(filtered, page, 10);

  const count = (s: JobStatus) => jobs.filter((j) => j.status === s).length;
  const kpis = [
    { label: "งานทั้งหมด", value: jobs.length, icon: "🧰", color: "var(--blue)" },
    { label: "รอมอบหมาย", value: count("new"), icon: "📥", color: "var(--orange)" },
    { label: "กำลังดำเนินการ", value: count("assigned") + count("in_progress") + count("found"), icon: "🚓", color: "var(--purple)" },
    { label: "ยึดสำเร็จ", value: count("repossessed"), icon: "✅", color: "var(--green)" },
  ];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{k.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-header">
          <h3>🧰 งานยึดรถ (Jobs)</h3>
          <div className="table-actions">
            <div className="search-box" style={{ padding: "5px 10px" }}>
              <span>🔍</span>
              <input type="text" placeholder="ค้นหาสัญญา / ชื่อ / ทะเบียน / ยี่ห้อ..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} style={{ width: 220 }} />
            </div>
            <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} style={{ padding: "6px 10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontSize: 12 }}>
              <option value="all">สถานะทั้งหมด</option>
              {STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Job / สัญญา</th><th>ผู้กู้ / รถ</th><th>ทะเบียน</th><th>ภาระหนี้</th>
              <th>สถาบัน</th><th>พนักงานสนาม</th><th>สถานะ</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((j) => {
              const st = statusOf(j.status);
              return (
                <tr key={j.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{j.jobNo}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{j.contractNo}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{j.borrowerName}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{j.brand} {j.model} {j.color && `· ${j.color}`}</div>
                  </td>
                  <td>{j.licensePlate || "—"}</td>
                  <td style={{ fontWeight: 700, color: "var(--red)" }}>{fmt(j.debtAmount)}</td>
                  <td style={{ fontSize: 12 }}>{instName(j.institutionId) ?? "—"}</td>
                  <td>
                    <select value={j.assignedAgentId ?? ""} onChange={(e) => assign(j, e.target.value)}
                      style={{ padding: "4px 6px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontSize: 11, maxWidth: 140 }}>
                      <option value="">— ยังไม่มอบหมาย —</option>
                      {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={j.status} onChange={(e) => patch(j.id, { status: e.target.value as JobStatus })}
                      style={{ padding: "4px 6px", borderRadius: 6, border: `1px solid ${st.color}55`, background: st.color + "18", color: st.color, fontSize: 11, fontWeight: 700 }}>
                      {STATUS.map((s) => <option key={s.value} value={s.value} style={{ color: "var(--text)" }}>{s.label}</option>)}
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => del(j.id)}>ลบ</button>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: 30 }}>
                ยังไม่มีงาน — นำเข้าจากเมนู “นำเข้า PDF”
              </td></tr>
            )}
          </tbody>
        </table>
        <Pagination info={`${total} งาน`} current={page} pages={pages} onPage={setPage} />
      </div>
    </>
  );
}

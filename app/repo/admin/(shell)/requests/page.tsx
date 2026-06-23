"use client";

import { useState, useEffect, useCallback } from "react";
import type { InfoRequest } from "@/lib/repo-requests";
import type { PublicAgent } from "@/lib/repo-agents";
import type { Loan } from "@/lib/repo-store";

const STATUS: Record<string, { label: string; color: string }> = {
  pending:  { label: "รออนุมัติ", color: "var(--orange)" },
  approved: { label: "อนุมัติแล้ว", color: "var(--green)" },
  rejected: { label: "ปฏิเสธ",     color: "var(--red)" },
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<InfoRequest[]>([]);
  const [agents, setAgents] = useState<PublicAgent[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(() => {
    fetch("/api/repo/requests").then((r) => r.json()).then((d) => setRequests(d.requests));
  }, []);
  useEffect(() => {
    load();
    fetch("/api/repo/agents").then((r) => r.json()).then((d) => setAgents(d.agents));
    fetch("/api/repo/loans").then((r) => r.json()).then((d) => setLoans(d.loans));
  }, [load]);

  // auto-refresh so new requests appear without manual reload
  useEffect(() => {
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, [load]);

  const agentName = (id: string) => agents.find((a) => a.id === id)?.name ?? id;
  const loanOf = (id: string) => loans.find((l) => l.id === id);

  const decide = async (id: string, status: "approved" | "rejected") => {
    await fetch(`/api/repo/requests/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };

  const fmtTime = (iso: string) => new Date(iso).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" });
  const list = requests.filter((r) => filter === "all" || r.status === filter).slice().reverse();
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "คำขอทั้งหมด", value: requests.length, icon: "📨", color: "var(--blue)" },
          { label: "รออนุมัติ", value: pendingCount, icon: "⏳", color: "var(--orange)" },
          { label: "อนุมัติแล้ว", value: requests.filter((r) => r.status === "approved").length, icon: "✅", color: "var(--green)" },
        ].map((k) => (
          <div key={k.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{k.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-header">
          <h3>📨 คำขอข้อมูลรถจากพนักงานสนาม</h3>
          <div className="table-actions">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontSize: 12 }}>
              <option value="all">ทั้งหมด</option>
              <option value="pending">รออนุมัติ</option>
              <option value="approved">อนุมัติแล้ว</option>
              <option value="rejected">ปฏิเสธ</option>
            </select>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>เวลา</th><th>พนักงานสนาม</th><th>ทะเบียน / รถ</th><th>ตำแหน่ง</th><th>รูป</th><th>สถานะ</th><th>ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => {
              const loan = loanOf(r.loanId);
              const st = STATUS[r.status];
              return (
                <tr key={r.id}>
                  <td style={{ fontSize: 12 }}>{fmtTime(r.createdAt)}</td>
                  <td style={{ fontWeight: 600 }}>{agentName(r.agentId)}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{r.plate || loan?.licensePlate?.split(" ")[0]}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{loan?.vehicleInfo ?? "—"}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {r.lat != null && r.lng != null
                      ? <a href={`https://maps.google.com/?q=${r.lat},${r.lng}`} target="_blank" style={{ color: "var(--primary-light)" }}>📍 ดูแผนที่</a>
                      : <span style={{ color: "var(--muted)" }}>—</span>}
                  </td>
                  <td>
                    {r.photos.length > 0 ? (
                      <div style={{ display: "flex", gap: 4 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {r.photos.slice(0, 3).map((p, i) => <img key={i} src={p} alt={`p${i}`} style={{ width: 34, height: 34, objectFit: "cover", borderRadius: 4, border: "1px solid var(--border)" }} />)}
                        {r.photos.length > 3 && <span style={{ fontSize: 11, color: "var(--muted)", alignSelf: "center" }}>+{r.photos.length - 3}</span>}
                      </div>
                    ) : <span style={{ color: "var(--muted)" }}>—</span>}
                  </td>
                  <td>
                    <span style={{ background: st.color + "22", color: st.color, border: `1px solid ${st.color}44`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{st.label}</span>
                  </td>
                  <td>
                    {r.status === "pending" ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => decide(r.id, "approved")}>อนุมัติ</button>
                        <button className="btn btn-danger btn-sm" onClick={() => decide(r.id, "rejected")}>ปฏิเสธ</button>
                      </div>
                    ) : <span style={{ color: "var(--muted)", fontSize: 12 }}>—</span>}
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: 30 }}>ไม่มีคำขอ</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

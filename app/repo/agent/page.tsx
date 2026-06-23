"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import "@/styles/admin.css";
import type { Job, JobStatus } from "@/lib/repo-jobs";
import type { PublicAgent } from "@/lib/repo-agents";
import type { ChatMessage } from "@/lib/repo-chat";
import type { Loan } from "@/lib/repo-store";
import type { InfoRequest } from "@/lib/repo-requests";

const STATUS: { value: JobStatus; label: string; color: string }[] = [
  { value: "assigned",    label: "รับงานแล้ว",      color: "var(--purple)" },
  { value: "in_progress", label: "กำลังลงพื้นที่",   color: "var(--orange)" },
  { value: "found",       label: "พบรถแล้ว",        color: "var(--blue)" },
  { value: "repossessed", label: "ยึดรถสำเร็จ",     color: "var(--green)" },
  { value: "cancelled",   label: "ยกเลิก/ไม่พบรถ",   color: "var(--red)" },
];
const statusOf = (s: JobStatus) => STATUS.find((x) => x.value === s) ?? { value: s, label: s, color: "var(--muted)" };

const LOAN_STATUS: Record<string, { label: string; color: string }> = {
  active:       { label: "ปกติ",            color: "var(--green)" },
  overdue:      { label: "ค้างชำระ",         color: "var(--orange)" },
  repossession: { label: "อยู่ระหว่างยึดรถ", color: "var(--red)" },
  repossessed:  { label: "ยึดรถแล้ว",       color: "var(--purple)" },
  settled:      { label: "ปิดบัญชีแล้ว",     color: "var(--blue)" },
};

const fmt = (n: number) => n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });
const colorOf = (v: string) => (v.match(/\(([^)]+)\)/)?.[1] ?? "—").replace(/^สี/, "");
const vehicleNoColor = (v: string) => v.replace(/\s*\([^)]*\)\s*$/, "").trim();

type Tab = "search" | "jobs" | "chat";

export default function AgentPortalPage() {
  const router = useRouter();
  const [agentId, setAgentId] = useState<string | null>(null);
  const [me, setMe] = useState<PublicAgent | null>(null);
  const [tab, setTab] = useState<Tab>("search");

  // search list
  const [plate, setPlate] = useState("");
  const [results, setResults] = useState<Loan[] | null>(null);
  const [searching, setSearching] = useState(false);

  // search detail
  const [selected, setSelected] = useState<Loan | null>(null);
  const [request, setRequest] = useState<InfoRequest | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // jobs
  const [jobs, setJobs] = useState<Job[]>([]);

  // chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Auth gate (demo: identity stored at login)
  useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem("repoAgentId") : null;
    if (!id) { router.replace("/repo/agent/login"); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only identity from localStorage
    setAgentId(id);
  }, [router]);

  const loadJobs = useCallback((id: string) => {
    fetch("/api/repo/jobs").then((r) => r.json())
      .then((d: { jobs: Job[] }) => setJobs(d.jobs.filter((j) => j.assignedAgentId === id)));
  }, []);

  useEffect(() => {
    if (!agentId) return;
    fetch("/api/repo/agents").then((r) => r.json())
      .then((d: { agents: PublicAgent[] }) => setMe(d.agents.find((a) => a.id === agentId) ?? null));
    loadJobs(agentId);
  }, [agentId, loadJobs]);

  // ----- search -----
  const doSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/repo/search?plate=${encodeURIComponent(plate)}`);
      const data = await res.json();
      setResults(data.results);
    } finally {
      setSearching(false);
    }
  };

  const loadRequest = useCallback((loanId: string, aId: string) => {
    fetch(`/api/repo/requests?agentId=${aId}&loanId=${loanId}`).then((r) => r.json())
      .then((d) => setRequest(d.request ?? null));
  }, []);

  const openDetail = (loan: Loan) => {
    setSelected(loan);
    setRequest(null);
    if (agentId) loadRequest(loan.id, agentId);
  };
  const backToList = () => { setSelected(null); setRequest(null); setConfirmOpen(false); };

  // poll while a request is pending → flips to approved when officer acts
  useEffect(() => {
    if (!selected || !agentId || request?.status !== "pending") return;
    const t = setInterval(() => loadRequest(selected.id, agentId), 3000);
    return () => clearInterval(t);
  }, [selected, agentId, request?.status, loadRequest]);

  const confirmRequest = async () => {
    if (!selected || !agentId) return;
    setRequesting(true);
    let lat: number | null = null, lng: number | null = null;
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 4000 }));
      lat = pos.coords.latitude; lng = pos.coords.longitude;
    } catch { /* location optional */ }
    const res = await fetch("/api/repo/requests", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, loanId: selected.id, plate: selected.licensePlate, lat, lng }),
    });
    const data = await res.json();
    setRequest(data.request);
    setConfirmOpen(false);
    setRequesting(false);
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !request) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await fetch(`/api/repo/requests/${request.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: reader.result }),
      });
      const data = await res.json();
      setRequest(data.request);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // ----- chat -----
  const loadChat = useCallback((id: string) => {
    fetch(`/api/repo/chat/${id}`).then((r) => r.json()).then((d) => setMessages(d.messages));
  }, []);
  useEffect(() => {
    if (!agentId || tab !== "chat") return;
    loadChat(agentId);
    const t = setInterval(() => loadChat(agentId), 3000);
    return () => clearInterval(t);
  }, [agentId, tab, loadChat]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, tab]);

  const updateStatus = async (jobId: string, status: JobStatus) => {
    await fetch(`/api/repo/jobs/${jobId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (agentId) loadJobs(agentId);
  };
  const sendMsg = async () => {
    if (!text.trim() || !agentId) return;
    const body = text; setText(""); setSending(true);
    await fetch(`/api/repo/chat/${agentId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sender: "agent", text: body }) });
    setSending(false); loadChat(agentId);
  };

  const logout = () => { localStorage.removeItem("repoAgentId"); router.push("/repo/agent/login"); };
  const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

  if (!agentId) return null; // redirecting to login
  const openCount = jobs.filter((j) => j.status !== "repossessed" && j.status !== "closed" && j.status !== "cancelled").length;
  const approved = request?.status === "approved";

  return (
    <div style={s.shell}>
      <div style={s.phone}>
        <header style={s.header}>
          <div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>พนักงานสนาม · AutoFinance</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{me?.name ?? "…"}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{me?.zone}</div>
          </div>
          <button onClick={logout} style={s.logout}>ออกจากระบบ</button>
        </header>

        <div style={s.tabs}>
          <button onClick={() => { setTab("search"); }} style={{ ...s.tab, ...(tab === "search" ? s.tabActive : {}) }}>🔍 ค้นหา</button>
          <button onClick={() => setTab("jobs")} style={{ ...s.tab, ...(tab === "jobs" ? s.tabActive : {}) }}>
            🧰 งานของฉัน {openCount > 0 && <span style={s.badge}>{openCount}</span>}
          </button>
          <button onClick={() => setTab("chat")} style={{ ...s.tab, ...(tab === "chat" ? s.tabActive : {}) }}>💬 แชท</button>
        </div>

        {/* ===== SEARCH ===== */}
        {tab === "search" && !selected && (
          <div style={s.body}>
            <form onSubmit={doSearch} style={{ display: "flex", gap: 8 }}>
              <input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="ค้นหาทะเบียนรถ เช่น 1234" style={s.input} />
              <button className="btn btn-primary" disabled={searching}>{searching ? "..." : "ค้นหา"}</button>
            </form>
            {results === null && <div style={s.empty}>ค้นหาทะเบียนรถเพื่อดูรายการงาน</div>}
            {results && results.length === 0 && <div style={s.empty}>ไม่พบทะเบียนที่ค้นหา</div>}
            {results?.map((loan) => {
              return (
                <button key={loan.id} onClick={() => openDetail(loan)} style={s.listItem}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{loan.licensePlate.split(" ")[0]} <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 12 }}>{loan.licensePlate.split(" ").slice(1).join(" ")}</span></div>
                    <div style={{ fontSize: 13 }}>{vehicleNoColor(loan.vehicleInfo)}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>สี{colorOf(loan.vehicleInfo)}</div>
                  </div>
                  <span style={{ color: "var(--primary-light)", fontSize: 13, whiteSpace: "nowrap" }}>เปิดดูงาน ›</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ===== DETAIL ===== */}
        {tab === "search" && selected && (
          <div style={s.body}>
            <button onClick={backToList} style={s.back}>‹ กลับ</button>
            <div style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{selected.licensePlate.split(" ")[0]}</div>
                {(() => { const st = LOAN_STATUS[selected.status]; return <span style={{ background: st.color + "22", color: st.color, border: `1px solid ${st.color}55`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{st.label}</span>; })()}
              </div>
              {/* basic info */}
              <Row label="บริษัท" value={selected.company} />
              <Row label="ยี่ห้อ/รุ่น" value={vehicleNoColor(selected.vehicleInfo)} />
              <Row label="สี" value={colorOf(selected.vehicleInfo)} />
              <Row label="ทะเบียน" value={selected.licensePlate} />

              {/* gated full info */}
              {approved && (
                <>
                  <div style={s.divider} />
                  <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 700, marginBottom: 6 }}>✓ เจ้าหน้าที่อนุมัติแล้ว — ข้อมูลเต็ม</div>
                  <Row label="เลขที่สัญญา" value={selected.contractNo} />
                  <Row label="ชื่อ-สกุล" value={selected.borrowerName} />
                  <Row label="เลขตัวรถ" value={selected.chassisNo} />
                  <Row label="ภาระหนี้" value={fmt(selected.overdueAmount || selected.monthlyPayment)} />
                  <Row label="โทร" value={selected.phone} />
                </>
              )}
            </div>

            {/* action zone */}
            {!request || request.status === "rejected" ? (
              <>
                {request?.status === "rejected" && <div style={{ ...s.empty, color: "var(--red)", padding: "10px" }}>คำขอก่อนหน้าถูกปฏิเสธ — ขอใหม่ได้</div>}
                <button className="btn btn-primary btn-block" onClick={() => setConfirmOpen(true)}>ข้อมูลรถเพิ่มเติม</button>
              </>
            ) : request.status === "pending" ? (
              <div style={s.waiting}>
                <div style={s.waitCircle}>รอเจ้าหน้าที่<br />ดำเนินการ</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>ส่งคำขอแล้ว · กำลังรออนุมัติ</div>
              </div>
            ) : (
              <>
                {/* approved: chat + upload */}
                <button className="btn btn-outline btn-block" onClick={() => setTab("chat")}>💬 แชทกับเจ้าหน้าที่</button>
                <div style={s.card}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>📷 รูปภาพเพิ่มเติม ({request.photos.length})</div>
                  {request.photos.length > 0 && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {request.photos.map((p, i) => <img key={i} src={p} alt={`photo-${i}`} style={{ width: 76, height: 76, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />)}
                    </div>
                  )}
                  <label className="btn btn-primary btn-block" style={{ cursor: "pointer" }}>
                    {uploading ? "กำลังอัปโหลด..." : "+ อัปโหลดรูป"}
                    <input type="file" accept="image/*" onChange={onUpload} style={{ display: "none" }} />
                  </label>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== JOBS ===== */}
        {tab === "jobs" && (
          <div style={s.body}>
            {jobs.length === 0 && <div style={s.empty}>ยังไม่มีงานที่ได้รับมอบหมาย</div>}
            {jobs.map((j) => {
              const st = statusOf(j.status);
              return (
                <div key={j.id} style={s.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{j.jobNo}</div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{j.borrowerName || "—"}</div>
                    </div>
                    <span style={{ background: st.color + "22", color: st.color, border: `1px solid ${st.color}55`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{st.label}</span>
                  </div>
                  <div style={s.rows}>
                    <Row label="รถ" value={`${j.brand} ${j.model}`.trim() || "—"} />
                    <Row label="ทะเบียน" value={j.licensePlate || "—"} />
                    <Row label="เลขตัวรถ" value={j.chassisNo || "—"} />
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <label style={{ fontSize: 11, color: "var(--muted)", display: "block", marginBottom: 4 }}>อัปเดตสถานะงาน</label>
                    <select value={j.status} onChange={(e) => updateStatus(j.id, e.target.value as JobStatus)} style={s.statusSelect}>
                      {STATUS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== CHAT ===== */}
        {tab === "chat" && (
          <div style={s.chatWrap}>
            <div style={s.chatBody}>
              {messages.length === 0 && <div style={s.empty}>ยังไม่มีข้อความ — เริ่มแชทกับออฟฟิศได้เลย</div>}
              {messages.map((m) => {
                const mine = m.sender === "agent";
                return (
                  <div key={m.id} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "78%" }}>
                    <div style={{ background: mine ? "var(--primary)" : "var(--surface)", color: mine ? "#fff" : "var(--text)", border: mine ? "none" : "1px solid var(--border)", borderRadius: 12, padding: "9px 13px", fontSize: 14, lineHeight: 1.45, wordBreak: "break-word" }}>{m.text}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3, textAlign: mine ? "right" : "left" }}>{mine ? "ฉัน" : "ออฟฟิศ"} · {fmtTime(m.createdAt)}</div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>
            <div style={s.inputBar}>
              <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendMsg(); }} placeholder="พิมพ์ข้อความถึงออฟฟิศ..." style={s.input} />
              <button className="btn btn-primary" onClick={sendMsg} disabled={sending || !text.trim()}>ส่ง</button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm modal (อนุญาตตำแหน่งที่ตั้ง) */}
      {confirmOpen && (
        <div style={s.overlay} onClick={() => !requesting && setConfirmOpen(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 34, textAlign: "center" }}>📍</div>
            <h3 style={{ textAlign: "center", margin: "8px 0 6px" }}>อนุญาตตำแหน่งที่ตั้ง</h3>
            <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>
              การขอข้อมูลรถเพิ่มเติมจะแชร์ตำแหน่งปัจจุบันของคุณให้เจ้าหน้าที่ และส่งคำขอเพื่อรอการอนุมัติ
            </p>
            <button className="btn btn-primary btn-block" onClick={confirmRequest} disabled={requesting}>
              {requesting ? "กำลังส่งคำขอ..." : "ยืนยัน"}
            </button>
            <button className="btn btn-outline btn-block" style={{ marginTop: 8 }} onClick={() => setConfirmOpen(false)} disabled={requesting}>ยกเลิก</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 8, fontSize: 13, marginTop: 5 }}>
      <span style={{ color: "var(--muted)", minWidth: 88 }}>{label}</span>
      <span style={{ fontWeight: 500, wordBreak: "break-word" }}>{value || "—"}</span>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  shell: { minHeight: "100vh", background: "var(--bg)", display: "flex", justifyContent: "center" },
  phone: { width: "100%", maxWidth: 480, minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "#0f172a", borderBottom: "1px solid var(--border)", color: "#fff" },
  logout: { background: "transparent", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer" },
  tabs: { display: "flex", borderBottom: "1px solid var(--border)", background: "var(--surface)" },
  tab: { flex: 1, padding: "12px 6px", background: "transparent", border: "none", borderBottom: "2px solid transparent", color: "var(--muted)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 },
  tabActive: { color: "var(--primary-light)", borderBottom: "2px solid var(--primary)" },
  badge: { background: "var(--red)", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 },
  body: { flex: 1, padding: 14, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" },
  listItem: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 14, cursor: "pointer", color: "var(--text)", textAlign: "left" },
  card: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 14 },
  rows: { marginTop: 8 },
  divider: { height: 1, background: "var(--border)", margin: "12px 0" },
  back: { alignSelf: "flex-start", background: "transparent", border: "none", color: "var(--primary-light)", fontSize: 14, cursor: "pointer", padding: 0 },
  statusSelect: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontSize: 14, fontWeight: 600 },
  waiting: { textAlign: "center", padding: "20px 0" },
  waitCircle: { width: 130, height: 130, borderRadius: "50%", border: "3px solid var(--green)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontWeight: 700, fontSize: 14, lineHeight: 1.4, textAlign: "center" },
  empty: { textAlign: "center", color: "var(--muted)", padding: "40px 20px", fontSize: 14 },
  chatWrap: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 },
  chatBody: { flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 },
  inputBar: { borderTop: "1px solid var(--border)", padding: 10, display: "flex", gap: 8, background: "var(--surface)" },
  input: { flex: 1, border: "1.5px solid var(--border)", borderRadius: 10, padding: "10px 14px", background: "var(--surface2)", color: "var(--text)", fontSize: 14, outline: "none" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50 },
  modal: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, width: "100%", maxWidth: 360 },
};

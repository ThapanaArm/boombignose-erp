"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { renderPdf, ocrCanvases, parseRows, emptyRow, type ParsedRow } from "@/lib/pdf-ocr";
import type { Institution } from "@/lib/repo-institutions";
import type { FieldAgent } from "@/lib/repo-agents";

type Phase = "idle" | "processing" | "review";

const COLS: { key: keyof ParsedRow; label: string; w: number }[] = [
  { key: "contractNo",   label: "เลขที่สัญญา", w: 120 },
  { key: "borrowerName", label: "ชื่อ-สกุล",    w: 150 },
  { key: "debtAmount",   label: "ภาระหนี้",     w: 90 },
  { key: "brand",        label: "ยี่ห้อ",        w: 90 },
  { key: "model",        label: "รุ่น",          w: 110 },
  { key: "overdueInfo",  label: "งวดค้าง",       w: 90 },
  { key: "color",        label: "สี",            w: 70 },
  { key: "chassisNo",    label: "เลขตัวรถ",      w: 140 },
  { key: "licensePlate", label: "ทะเบียน",       w: 90 },
];

export default function ImportPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [maxPages, setMaxPages] = useState(2);
  const [scale, setScale] = useState(3);
  const [sharpen, setSharpen] = useState(true);
  const [engPass, setEngPass] = useState(true);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [institutionId, setInstitutionId] = useState("");
  const [agentId, setAgentId] = useState("");
  const [creating, setCreating] = useState(false);

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [agents, setAgents] = useState<FieldAgent[]>([]);

  useEffect(() => {
    fetch("/api/repo/institutions").then((r) => r.json()).then((d) => setInstitutions(d.institutions));
    fetch("/api/repo/agents").then((r) => r.json()).then((d) => setAgents(d.agents));
  }, []);

  const run = async () => {
    if (!file) { setError("กรุณาเลือกไฟล์ PDF ก่อน"); return; }
    setError("");
    setPhase("processing");
    try {
      const canvases = await renderPdf(file, maxPages, setProgress, { scale, preprocess: sharpen });
      const ocr = await ocrCanvases(canvases, setProgress, { dualPass: engPass });
      const parsed = parseRows(ocr);
      setProgress("");
      setRows(parsed.length ? parsed : [emptyRow()]);
      setPhase("review");
    } catch (e) {
      console.error(e);
      setError("เกิดข้อผิดพลาดในการอ่านไฟล์: " + (e as Error).message);
      setPhase("idle");
    }
  };

  const setCell = (i: number, key: keyof ParsedRow, val: string) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  const removeRow = (i: number) => setRows((rs) => rs.filter((_, idx) => idx !== i));
  const addRow = () => setRows((rs) => [...rs, emptyRow()]);

  const createJobs = async () => {
    const valid = rows.filter((r) => r.contractNo.trim() || r.borrowerName.trim());
    if (!valid.length) { setError("ไม่มีรายการที่จะสร้าง"); return; }
    setCreating(true);
    const payload = {
      rows: valid.map((r) => ({
        contractNo: r.contractNo, borrowerName: r.borrowerName,
        debtAmount: Number(r.debtAmount) || 0, brand: r.brand, model: r.model,
        overdueInfo: r.overdueInfo, statusCode: r.statusCode, color: r.color,
        chassisNo: r.chassisNo, licensePlate: r.licensePlate,
        institutionId: institutionId || null, assignedAgentId: agentId || null,
        source: "pdf",
      })),
    };
    await fetch("/api/repo/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setCreating(false);
    router.push("/repo/admin/jobs");
  };

  return (
    <>
      {error && (
        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "var(--red)", padding: "10px 14px", borderRadius: 10, marginBottom: 16, fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Upload card */}
      {phase !== "review" && (
        <div className="table-card" style={{ padding: 28, marginBottom: 20 }}>
          <h3 style={{ marginBottom: 6 }}>📄 นำเข้าข้อมูลสินเชื่อจาก PDF</h3>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20 }}>
            อัปโหลดเอกสารรายการสินเชื่อ (PDF) ระบบจะอ่านด้วย OCR ภาษาไทย แล้วให้ตรวจ/แก้ไขก่อนสร้างเป็นงานยึดรถ (Job)
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="form-group" style={{ flex: "1 1 260px" }}>
              <label>ไฟล์ PDF</label>
              <input type="file" accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                style={{ padding: 8 }} />
            </div>
            <div className="form-group" style={{ width: 130 }}>
              <label>อ่านสูงสุด (หน้า)</label>
              <input type="number" min={1} max={20} value={maxPages}
                onChange={(e) => setMaxPages(Math.max(1, Number(e.target.value) || 1))} />
            </div>
            <div className="form-group" style={{ width: 150 }}>
              <label>ความละเอียด</label>
              <select value={scale} onChange={(e) => setScale(Number(e.target.value))}>
                <option value={2}>มาตรฐาน (เร็ว)</option>
                <option value={3}>สูง (แนะนำ)</option>
                <option value={4}>สูงมาก (ช้า)</option>
              </select>
            </div>
            <div className="form-group" style={{ width: 170 }}>
              <label>ปรับภาพคมชัด</label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, height: 40, fontSize: 13, color: "var(--text)", fontWeight: 400 }}>
                <input type="checkbox" checked={sharpen} onChange={(e) => setSharpen(e.target.checked)} style={{ width: "auto" }} />
                ขาว-ดำ (binarize)
              </label>
            </div>
            <div className="form-group" style={{ width: 210 }}>
              <label>คอลัมน์อังกฤษ</label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, height: 40, fontSize: 13, color: "var(--text)", fontWeight: 400 }}>
                <input type="checkbox" checked={engPass} onChange={(e) => setEngPass(e.target.checked)} style={{ width: "auto" }} />
                อ่านแยกรอบ (ยี่ห้อ/เลขตัวรถ)
              </label>
            </div>
            <button className="btn btn-primary" onClick={run} disabled={phase === "processing" || !file} style={{ height: 42 }}>
              {phase === "processing" ? "กำลังอ่าน..." : "เริ่มอ่าน PDF"}
            </button>
          </div>

          {phase === "processing" && (
            <div style={{ marginTop: 20, padding: 16, background: "var(--surface2)", borderRadius: 10, border: "1px solid var(--border)", display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 22 }}>⏳</span>
              <div>
                <div style={{ fontWeight: 600 }}>{progress || "กำลังเตรียมการ..."}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  OCR ตารางหนาแน่นอาจใช้เวลาหลายสิบวินาทีต่อหน้า — โปรดรอสักครู่
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 18, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            💡 ระบบใช้โมเดล OCR ความแม่นยำสูง (tessdata_best) เรนเดอร์ความละเอียดสูง และอ่านคอลัมน์อังกฤษ
            (ยี่ห้อ/เลขตัวรถ) แยกอีกรอบเพื่อความแม่นยำ · เปิด “อ่านแยกรอบ” จะช้าขึ้นเท่าตัวแต่แม่นกว่า
            · การอ่านครั้งแรกต้องดาวน์โหลดโมเดล (ต้องมีอินเทอร์เน็ต) · เอกสารสแกนตารางหนาแน่นยังมีโอกาสคลาดเคลื่อน
            — กรุณาตรวจ/แก้ไขก่อนสร้าง Job
          </div>
        </div>
      )}

      {/* Review grid */}
      {phase === "review" && (
        <>
          <div className="table-card" style={{ padding: 18, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div className="form-group" style={{ width: 220, marginBottom: 0 }}>
                  <label>สถาบันสินเชื่อ (ใช้กับทุกรายการ)</label>
                  <select value={institutionId} onChange={(e) => setInstitutionId(e.target.value)}>
                    <option value="">— ไม่ระบุ —</option>
                    {institutions.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ width: 220, marginBottom: 0 }}>
                  <label>มอบหมายพนักงาน (ทุกรายการ)</label>
                  <select value={agentId} onChange={(e) => setAgentId(e.target.value)}>
                    <option value="">— ยังไม่มอบหมาย —</option>
                    {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                ตรวจพบ <strong style={{ color: "var(--text)" }}>{rows.length}</strong> รายการ
              </div>
            </div>
          </div>

          <div className="table-card">
            <div className="table-header">
              <h3>✏️ ตรวจสอบ / แก้ไขข้อมูลก่อนสร้าง Job</h3>
              <div className="table-actions">
                <button className="btn btn-outline btn-sm" onClick={addRow}>+ เพิ่มแถว</button>
                <button className="btn btn-outline btn-sm" onClick={() => { setPhase("idle"); setRows([]); }}>เริ่มใหม่</button>
                <button className="btn btn-primary btn-sm" onClick={createJobs} disabled={creating}>
                  {creating ? "กำลังสร้าง..." : `สร้าง Job (${rows.length})`}
                </button>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    {COLS.map((c) => <th key={c.key} style={{ minWidth: c.w }}>{c.label}</th>)}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      {COLS.map((c) => (
                        <td key={c.key} style={{ padding: 4 }}>
                          <input
                            value={r[c.key]}
                            onChange={(e) => setCell(i, c.key, e.target.value)}
                            style={{ width: c.w, padding: "6px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontSize: 12 }}
                          />
                        </td>
                      ))}
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => removeRow(i)}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}

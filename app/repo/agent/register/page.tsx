"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/admin.css";

export default function AgentRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: "", name: "", address: "", email: "", password: "", newsletter: false });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: k === "newsletter" ? e.target.checked : e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!form.phone || !form.name || !form.email || !form.password) {
      setError("กรุณากรอก เบอร์โทร, ชื่อ-นามสกุล, อีเมล และรหัสผ่าน");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/repo/agent/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "สมัครไม่สำเร็จ"); return; }
      localStorage.setItem("repoAgentId", data.agent.id); // auto login
      router.push("/repo/agent");
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-body">
      <div className="auth-card" style={{ maxWidth: 420 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <Link href="/repo/agent/login" aria-label="ปิด" style={{ fontSize: 22, color: "var(--muted)", textDecoration: "none", lineHeight: 1 }}>×</Link>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>🚗 AutoFinance สนาม</div>
        </div>
        <h2 style={{ marginBottom: 2 }}>ลงชื่อสมัคร</h2>
        <p className="auth-sub">สมัครเป็นพนักงานสนามเพื่อเข้าใช้งานระบบ</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>เบอร์โทรศัพท์ *</label>
            <input type="tel" value={form.phone} onChange={set("phone")} placeholder="08X-XXX-XXXX" autoComplete="tel" required />
          </div>
          <div className="form-group">
            <label>ชื่อ - นามสกุล *</label>
            <input type="text" value={form.name} onChange={set("name")} placeholder="ชื่อ นามสกุล" autoComplete="name" required />
          </div>
          <div className="form-group">
            <label>ที่อยู่</label>
            <input type="text" value={form.address} onChange={set("address")} placeholder="ที่อยู่ปัจจุบัน" autoComplete="street-address" />
          </div>
          <div className="form-group">
            <label>อีเมล *</label>
            <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" autoComplete="email" required />
          </div>
          <div className="form-group">
            <label>รหัสผ่าน *</label>
            <div style={{ position: "relative" }}>
              <input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="••••••••" autoComplete="new-password" required style={{ width: "100%" }} />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--primary-light)", fontSize: 13, cursor: "pointer" }}>
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12, color: "var(--muted)", margin: "6px 0 16px", cursor: "pointer", fontWeight: 400 }}>
            <input type="checkbox" checked={form.newsletter} onChange={set("newsletter")} style={{ width: "auto", marginTop: 2 }} />
            ฉันต้องการรับจดหมายข่าวและข้อมูลส่งเสริมการขายอื่น ๆ จากคุณ
          </label>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "var(--red)", padding: "8px 12px", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
          </button>
        </form>

        <Link href="/repo/agent/login" className="back-link">มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</Link>
      </div>
    </div>
  );
}

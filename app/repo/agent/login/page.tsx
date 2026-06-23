"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/admin.css";

export default function AgentLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/repo/agent/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }
      localStorage.setItem("repoAgentId", data.agent.id);
      router.push("/repo/agent");
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-body">
      <div className="auth-card">
        <div className="auth-logo">
          <span>🚗</span>
          <span>
            AutoFinance <strong>สนาม</strong>
          </span>
        </div>
        <h2>เข้าสู่ระบบพนักงานสนาม</h2>
        <p className="auth-sub">สำหรับเจ้าหน้าที่ภาคสนาม — ค้นหาข้อมูลสินเชื่อ และติดต่อออฟฟิศ</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username หรือ เบอร์โทรศัพท์</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="เช่น anucha หรือ 081-111-2222"
              autoComplete="username"
              required
            />
          </div>
          <div className="form-group">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "var(--red)", padding: "8px 12px", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>
              ⚠️ {error}
            </div>
          )}
          <div className="login-hint">เดโม: <strong>anucha</strong> (หรือ 081-111-2222) / รหัส <strong>1234</strong></div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
        <Link href="/repo" className="back-link">← กลับหน้าค้นหา</Link>
      </div>
    </div>
  );
}

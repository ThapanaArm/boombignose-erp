"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/admin.css";

export default function RepoAdminLogin() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/repo/admin");
  };

  return (
    <div className="auth-body">
      <div className="auth-card">
        <div className="auth-logo">
          <span>🚗</span>
          <span>
            AutoFinance <strong>Thailand</strong>
          </span>
        </div>
        <h2>เข้าสู่ระบบเจ้าหน้าที่</h2>
        <p className="auth-sub">ระบบจัดการสินเชื่อและการยึดรถ</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>อีเมล</label>
            <input type="email" placeholder="staff@autofinance.co.th" defaultValue="staff@autofinance.co.th" required />
          </div>
          <div className="form-group">
            <label>รหัสผ่าน</label>
            <input type="password" placeholder="••••••••" defaultValue="repo1234" required />
          </div>
          <div className="login-hint">ข้อมูลทดสอบกรอกไว้ให้แล้ว — กด เข้าสู่ระบบ ได้เลย</div>
          <button type="submit" className="btn btn-primary btn-block">
            เข้าสู่ระบบ
          </button>
        </form>
        <Link href="/repo" className="back-link">
          ← กลับหน้าค้นหา
        </Link>
      </div>
    </div>
  );
}

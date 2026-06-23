"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/admin.css";

export default function RepoAdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="admin-layout">
      <aside className={"sidebar" + (open ? " open" : "")}>
        <div className="sidebar-logo">
          <span>🚗</span>
          <span>
            AutoFinance <strong style={{ color: "#818cf8" }}>TH</strong>
          </span>
        </div>

        <div>
          <div className="sidebar-section-title">จัดการ</div>
          <Link href="/repo/admin" className="nav-item active">
            <span className="nav-icon">🚗</span> สัญญาสินเชื่อ
          </Link>
          <a href="/repo" target="_blank" className="nav-item">
            <span className="nav-icon">🌐</span> หน้าค้นหา (Public)
          </a>
        </div>

        <div className="sidebar-footer">
          <div className="avatar">S</div>
          <div className="sidebar-footer-info">
            <strong>เจ้าหน้าที่</strong>
            <span>staff@autofinance.co.th</span>
          </div>
          <button
            className="logout-btn"
            onClick={() => router.push("/repo/admin/login")}
            title="ออกจากระบบ"
          >
            ⏏
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <button
            className="icon-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div>
            <div className="topbar-title">จัดการสินเชื่อรถยนต์</div>
            <div className="topbar-sub">ระบบตรวจสอบและจัดการยึดรถ</div>
          </div>
          <div className="topbar-spacer" />
          <div className="topbar-actions">
            <div className="icon-btn" style={{ position: "relative" }}>
              🔔<span className="notif-dot" />
            </div>
            <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>S</div>
          </div>
        </header>
        <div className="page">{children}</div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "@/styles/admin.css";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
  sub: string;
}
interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    title: "จัดการ",
    items: [
      { href: "/repo/admin", label: "สัญญาสินเชื่อ", icon: "🚗", exact: true, sub: "ระบบตรวจสอบและจัดการยึดรถ" },
      { href: "/repo/admin/jobs", label: "งานยึดรถ", icon: "🧰", sub: "ติดตามและมอบหมายงานยึดรถ" },
    ],
  },
  {
    title: "ปฏิบัติการ",
    items: [
      { href: "/repo/admin/requests", label: "คำขอข้อมูล", icon: "📨", sub: "อนุมัติคำขอข้อมูลรถจากพนักงานสนาม" },
      { href: "/repo/admin/import", label: "นำเข้า PDF", icon: "📄", sub: "อ่านเอกสารสินเชื่อเพื่อสร้าง Job" },
      { href: "/repo/admin/chat", label: "แชทพนักงานสนาม", icon: "💬", sub: "สื่อสารกับพนักงานสนาม" },
    ],
  },
  {
    title: "ตั้งค่า",
    items: [
      { href: "/repo/admin/settings/brands", label: "ยี่ห้อรถยนต์", icon: "🏷️", sub: "จัดการยี่ห้อรถยนต์" },
      { href: "/repo/admin/settings/institutions", label: "สถาบันสินเชื่อ", icon: "🏦", sub: "จัดการสถาบันสินเชื่อ" },
      { href: "/repo/admin/settings/agents", label: "พนักงานสนาม", icon: "🧑‍✈️", sub: "จัดการพนักงานสนาม" },
    ],
  },
];

const ALL_ITEMS = NAV.flatMap((s) => s.items);

function isActive(item: NavItem, pathname: string): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export default function RepoAdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // หา nav item ที่ตรงที่สุด (href ยาวสุด) เพื่อใช้เป็นหัวข้อ topbar
  const current =
    [...ALL_ITEMS]
      .filter((it) => isActive(it, pathname))
      .sort((a, b) => b.href.length - a.href.length)[0] ?? ALL_ITEMS[0];

  return (
    <div className="admin-layout">
      <aside className={"sidebar" + (open ? " open" : "")}>
        <div className="sidebar-logo">
          <span>🚗</span>
          <span>
            AutoFinance <strong style={{ color: "#818cf8" }}>TH</strong>
          </span>
        </div>

        {NAV.map((section) => (
          <div key={section.title}>
            <div className="sidebar-section-title">{section.title}</div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={"nav-item" + (isActive(item, pathname) ? " active" : "")}
                onClick={() => setOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span> {item.label}
              </Link>
            ))}
          </div>
        ))}

        <div>
          <div className="sidebar-section-title">ลิงก์</div>
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
            <div className="topbar-title">{current.label}</div>
            <div className="topbar-sub">{current.sub}</div>
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

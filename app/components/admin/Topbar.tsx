"use client";

import { usePathname } from "next/navigation";
import { PAGE_TITLES } from "./navConfig";

export default function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const pathname = usePathname();
  const slug = pathname.split("/")[2] ?? "dashboard";
  const [title, sub] = PAGE_TITLES[slug] ?? ["Dashboard", ""];

  return (
    <header className="topbar" id="topbar">
      <button
        className="icon-btn"
        id="sidebarToggle"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      <div>
        <div className="topbar-title">{title}</div>
        <div className="topbar-sub">{sub}</div>
      </div>
      <div className="topbar-spacer" />
      <div className="search-box">
        <span>🔍</span>
        <input type="text" placeholder="Search anything..." />
      </div>
      <div className="topbar-actions">
        <div className="icon-btn">🌙</div>
        <div className="icon-btn" style={{ position: "relative" }}>
          🔔<span className="notif-dot" />
        </div>
        <div className="avatar" style={{ width: 34, height: 34, fontSize: 13, cursor: "pointer" }}>
          A
        </div>
      </div>
    </header>
  );
}

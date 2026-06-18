"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { NAV_SECTIONS } from "./navConfig";

export default function Sidebar({ open }: { open: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeSlug = pathname.split("/")[2] ?? "dashboard";

  return (
    <aside className={"sidebar" + (open ? " open" : "")} id="sidebar">
      <div className="sidebar-logo">
        <span>🐘</span>
        <span>
          BoomBigNose <strong style={{ color: "#818cf8" }}>ERP</strong>
        </span>
      </div>

      {NAV_SECTIONS.map((section) => (
        <div key={section.title}>
          <div className="sidebar-section-title">{section.title}</div>
          {section.links.map((link) => (
            <Link
              key={link.slug}
              href={`/admin/${link.slug}`}
              className={"nav-item" + (activeSlug === link.slug ? " active" : "")}
            >
              <span className="nav-icon">{link.icon}</span> {link.label}
              {link.badge && <span className="nav-badge">{link.badge}</span>}
            </Link>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <div className="avatar">A</div>
        <div className="sidebar-footer-info">
          <strong>Admin User</strong>
          <span>admin@boombignose.org</span>
        </div>
        <button
          className="logout-btn"
          onClick={() => router.push("/admin/login")}
          title="Logout"
        >
          ⏏
        </button>
      </div>
    </aside>
  );
}

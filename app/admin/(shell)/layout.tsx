"use client";

import { useState } from "react";
import { ErpProvider } from "@/lib/store";
import Sidebar from "@/app/components/admin/Sidebar";
import Topbar from "@/app/components/admin/Topbar";
import "@/styles/admin.css";

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ErpProvider>
      <div className="admin-layout">
        <Sidebar open={sidebarOpen} />
        <div className="main-content">
          <Topbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
          <div className="page">{children}</div>
        </div>
      </div>
    </ErpProvider>
  );
}

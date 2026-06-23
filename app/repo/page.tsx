"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Loan } from "@/lib/repo-store";

export default function RepoSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Loan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/repo/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results);
    } finally {
      setLoading(false);
    }
  };

  const statusLabel: Record<string, { label: string; color: string }> = {
    active:       { label: "ปกติ",              color: "#10b981" },
    overdue:      { label: "ค้างชำระ",           color: "#f59e0b" },
    repossession: { label: "อยู่ระหว่างยึดรถ",    color: "#ef4444" },
    repossessed:  { label: "ยึดรถแล้ว",          color: "#8b5cf6" },
    settled:      { label: "ปิดบัญชีแล้ว",       color: "#6366f1" },
  };

  return (
    <div style={styles.root}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <span style={{ fontSize: 28 }}>🚗</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: ".3px" }}>
                AutoFinance Thailand
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: ".5px" }}>
                ระบบตรวจสอบสถานะสินเชื่อยานยนต์
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="/repo/agent/login" style={styles.adminLink}>
              พนักงานสนาม →
            </a>
            <a href="/repo/admin/login" style={styles.adminLink}>
              เจ้าหน้าที่ออฟฟิศ →
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>🔍 ตรวจสอบสถานะ</div>
          <h1 style={styles.heroTitle}>ตรวจสอบสถานะ<br />การชำระสินเชื่อรถยนต์</h1>
          <p style={styles.heroSub}>
            ค้นหาด้วยเลขที่สัญญา, เลขบัตรประชาชน, หรือทะเบียนรถ
          </p>

          <form onSubmit={handleSearch} style={styles.searchForm}>
            <div style={styles.searchBox}>
              <span style={{ fontSize: 18, color: "#64748b" }}>🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="เช่น CNT-2024-001 หรือ 1-1001-23456-78-9 หรือ กข-1234"
                style={styles.searchInput}
                autoComplete="off"
              />
            </div>
            <button type="submit" style={styles.searchBtn} disabled={loading}>
              {loading ? "กำลังค้นหา..." : "ค้นหา"}
            </button>
          </form>

          <div style={styles.hints}>
            <span style={styles.hintChip}>เลขที่สัญญา</span>
            <span style={styles.hintChip}>เลขบัตรประชาชน</span>
            <span style={styles.hintChip}>ทะเบียนรถ</span>
            <span style={styles.hintChip}>ชื่อ-นามสกุล</span>
          </div>
        </div>
      </section>

      {/* Results */}
      {searched && (
        <section style={styles.resultsSection}>
          <div style={styles.resultsInner}>
            {loading ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: 40 }}>⏳</div>
                <p>กำลังค้นหา...</p>
              </div>
            ) : results && results.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: 40 }}>📭</div>
                <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>ไม่พบข้อมูล</p>
                <p style={{ color: "#64748b", fontSize: 14 }}>
                  กรุณาตรวจสอบข้อมูลที่ค้นหาและลองใหม่อีกครั้ง
                </p>
              </div>
            ) : (
              <>
                <h2 style={styles.resultsTitle}>
                  พบ {results?.length} รายการ
                </h2>
                <div style={styles.cardGrid}>
                  {results?.map((loan) => {
                    const st = statusLabel[loan.status] ?? { label: loan.status, color: "#64748b" };
                    const fmt = (n: number) =>
                      n.toLocaleString("th-TH", { style: "currency", currency: "THB" });
                    return (
                      <div key={loan.id} style={styles.resultCard}>
                        <div style={styles.cardTop}>
                          <div>
                            <div style={styles.contractNo}>{loan.contractNo}</div>
                            <div style={styles.borrowerName}>{loan.borrowerName}</div>
                          </div>
                          <span style={{ ...styles.statusBadge, background: st.color + "22", color: st.color, border: `1px solid ${st.color}44` }}>
                            {st.label}
                          </span>
                        </div>
                        <div style={styles.cardDivider} />
                        <div style={styles.cardBody}>
                          <InfoRow icon="🚗" label="รถยนต์" value={loan.vehicleInfo} />
                          <InfoRow icon="🔖" label="ทะเบียน" value={loan.licensePlate} />
                          <InfoRow icon="💳" label="วงเงินกู้" value={fmt(loan.loanAmount)} />
                          <InfoRow icon="📅" label="งวดชำระ/เดือน" value={fmt(loan.monthlyPayment)} />
                          {loan.overdueMonths > 0 && (
                            <InfoRow
                              icon="⚠️"
                              label="ค้างชำระ"
                              value={`${loan.overdueMonths} เดือน — ${fmt(loan.overdueAmount)}`}
                              highlight
                            />
                          )}
                          {loan.lastPaymentDate && (
                            <InfoRow icon="✅" label="ชำระล่าสุด" value={loan.lastPaymentDate} />
                          )}
                        </div>
                        {loan.status === "overdue" || loan.status === "repossession" ? (
                          <div style={styles.warningBox}>
                            <strong>⚠️ กรุณาติดต่อเจ้าหน้าที่</strong> โทร{" "}
                            <a href="tel:021234567" style={{ color: "#ef4444" }}>02-123-4567</a>{" "}
                            เพื่อชำระหนี้ค้างและหลีกเลี่ยงการยึดรถ
                          </div>
                        ) : null}
                        <button
                          style={styles.detailBtn}
                          onClick={() => router.push(`/repo/result/${loan.id}`)}
                        >
                          ดูรายละเอียด →
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Info Cards */}
      {!searched && (
        <section style={styles.infoSection}>
          <div style={styles.infoGrid}>
            {[
              { icon: "📋", title: "เลขที่สัญญา", desc: "กรอกเลขที่สัญญาที่ระบุในเอกสารสัญญาเช่าซื้อ" },
              { icon: "🪪", title: "เลขบัตรประชาชน", desc: "ใช้เลขบัตรประชาชน 13 หลักของผู้กู้ (มีหรือไม่มีเส้นขีด)" },
              { icon: "🔖", title: "ทะเบียนรถ", desc: "ป้อนหมายเลขทะเบียนรถที่จดทะเบียนตามสัญญา" },
            ].map((c) => (
              <div key={c.title} style={styles.infoCard}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{c.title}</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        © 2024 AutoFinance Thailand · ระบบตรวจสอบสินเชื่อยานยนต์ · โทร 02-123-4567
      </footer>
    </div>
  );
}

function InfoRow({ icon, label, value, highlight }: {
  icon: string; label: string; value: string; highlight?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13 }}>
      <span style={{ width: 20, flexShrink: 0 }}>{icon}</span>
      <span style={{ color: "#64748b", minWidth: 110 }}>{label}</span>
      <span style={{ fontWeight: highlight ? 700 : 500, color: highlight ? "#ef4444" : "#1e293b" }}>
        {value}
      </span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', 'Sarabun', sans-serif", color: "#1e293b" },
  header: { background: "#0f172a", borderBottom: "1px solid #1e293b", padding: "0 24px" },
  headerInner: { maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 },
  logo: { display: "flex", alignItems: "center", gap: 10, color: "#fff" },
  adminLink: { fontSize: 12, color: "#94a3b8", textDecoration: "none", padding: "6px 12px", border: "1px solid #334155", borderRadius: 6 },
  hero: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    padding: "80px 24px 60px",
    textAlign: "center" as const,
  },
  heroContent: { maxWidth: 680, margin: "0 auto" },
  badge: { display: "inline-block", background: "rgba(99,102,241,.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,.3)", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, marginBottom: 20, letterSpacing: ".5px" },
  heroTitle: { fontSize: "clamp(28px,5vw,44px)", fontWeight: 800, color: "#f1f5f9", lineHeight: 1.2, marginBottom: 16 },
  heroSub: { color: "#94a3b8", fontSize: 16, marginBottom: 36 },
  searchForm: { display: "flex", gap: 10, maxWidth: 600, margin: "0 auto 16px" },
  searchBox: { flex: 1, display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "0 16px", boxShadow: "0 2px 8px rgba(0,0,0,.06)" },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: 14, padding: "14px 0", background: "transparent", color: "#1e293b" },
  searchBtn: { padding: "0 28px", height: 50, background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", whiteSpace: "nowrap" as const },
  hints: { display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" as const },
  hintChip: { background: "rgba(255,255,255,.08)", color: "#94a3b8", border: "1px solid rgba(255,255,255,.12)", borderRadius: 20, padding: "3px 12px", fontSize: 11 },
  resultsSection: { padding: "40px 24px", background: "#f8fafc" },
  resultsInner: { maxWidth: 900, margin: "0 auto" },
  resultsTitle: { fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#1e293b" },
  cardGrid: { display: "flex", flexDirection: "column" as const, gap: 16 },
  resultCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,.05)" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  contractNo: { fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: ".5px", marginBottom: 2 },
  borrowerName: { fontSize: 20, fontWeight: 700, color: "#1e293b" },
  statusBadge: { padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" as const },
  cardDivider: { height: 1, background: "#f1f5f9", marginBottom: 14 },
  cardBody: { marginBottom: 14 },
  warningBox: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 14 },
  detailBtn: { background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer", width: "100%" },
  emptyState: { textAlign: "center" as const, padding: "60px 20px", color: "#94a3b8" },
  infoSection: { padding: "60px 24px", background: "#fff", borderTop: "1px solid #f1f5f9" },
  infoGrid: { maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 },
  infoCard: { textAlign: "center" as const, padding: 28, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" },
  footer: { textAlign: "center" as const, padding: "24px", color: "#94a3b8", fontSize: 12, background: "#0f172a", borderTop: "1px solid #1e293b" },
};

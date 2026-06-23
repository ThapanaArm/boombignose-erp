"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Loan } from "@/lib/repo-store";

const STATUS_MAP: Record<string, { label: string; color: string; icon: string; desc: string }> = {
  active:       { label: "ปกติ",            color: "#10b981", icon: "✅", desc: "บัญชีสินเชื่อของท่านอยู่ในสถานะปกติ ไม่มียอดค้างชำระ" },
  overdue:      { label: "ค้างชำระ",        color: "#f59e0b", icon: "⚠️", desc: "พบยอดค้างชำระ กรุณาติดต่อชำระโดยเร็วที่สุดเพื่อหลีกเลี่ยงการดำเนินการทางกฎหมาย" },
  repossession: { label: "อยู่ระหว่างยึดรถ", color: "#ef4444", icon: "🚨", desc: "บัญชีของท่านถูกส่งดำเนินการยึดรถแล้ว กรุณาติดต่อเจ้าหน้าที่ทันที" },
  repossessed:  { label: "ยึดรถแล้ว",       color: "#8b5cf6", icon: "🔒", desc: "รถยนต์ถูกยึดเรียบร้อยแล้ว กรุณาติดต่อเพื่อชำระหนี้และรับรถคืน" },
  settled:      { label: "ปิดบัญชีแล้ว",    color: "#6366f1", icon: "🎉", desc: "สัญญาเช่าซื้อปิดบัญชีเรียบร้อยแล้ว ขอบคุณที่ชำระครบถ้วน" },
};

const fmt = (n: number) =>
  n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

export default function RepoResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/repo/loans/${params.id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((d) => { if (d) setLoan(d.loan); })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <CenterMessage icon="⏳" msg="กำลังโหลดข้อมูล..." />;
  if (notFound || !loan) return <CenterMessage icon="📭" msg="ไม่พบข้อมูลสัญญา" />;

  const st = STATUS_MAP[loan.status] ?? { label: loan.status, color: "#64748b", icon: "❓", desc: "" };
  const progress = Math.min(100, Math.max(0,
    Math.round((new Date().getTime() - new Date(loan.startDate).getTime()) /
      (new Date(loan.endDate).getTime() - new Date(loan.startDate).getTime()) * 100)
  ));

  return (
    <div style={styles.root}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
            <span style={{ fontSize: 24 }}>🚗</span>
            <span style={{ fontWeight: 700 }}>AutoFinance Thailand</span>
          </div>
          <button style={styles.backBtn} onClick={() => router.push("/repo")}>← กลับค้นหา</button>
        </div>
      </header>

      <div style={styles.body}>
        {/* Status Banner */}
        <div style={{ ...styles.statusBanner, background: st.color + "18", border: `1.5px solid ${st.color}44` }}>
          <div style={{ fontSize: 36 }}>{st.icon}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: st.color }}>{st.label}</div>
            <div style={{ color: "#475569", fontSize: 14, marginTop: 4 }}>{st.desc}</div>
          </div>
        </div>

        <div style={styles.grid}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Borrower */}
            <Card title="ข้อมูลผู้กู้" icon="🪪">
              <Field label="ชื่อ-นามสกุล" value={loan.borrowerName} bold />
              <Field label="เลขบัตรประชาชน" value={maskId(loan.borrowerIdNo)} />
              <Field label="เบอร์โทรศัพท์" value={loan.phone} />
            </Card>

            {/* Vehicle */}
            <Card title="ข้อมูลรถยนต์" icon="🚗">
              <Field label="รายละเอียดรถ" value={loan.vehicleInfo} bold />
              <Field label="ทะเบียนรถ" value={loan.licensePlate} />
            </Card>

            {/* Notes */}
            {loan.notes && (
              <Card title="หมายเหตุจากเจ้าหน้าที่" icon="📝">
                <p style={{ color: "#475569", fontSize: 14 }}>{loan.notes}</p>
              </Card>
            )}
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Contract */}
            <Card title="ข้อมูลสัญญา" icon="📋">
              <Field label="เลขที่สัญญา" value={loan.contractNo} bold />
              <Field label="วงเงินกู้ทั้งหมด" value={fmt(loan.loanAmount)} />
              <Field label="ผ่อนชำระ/เดือน" value={fmt(loan.monthlyPayment)} />
              <Field label="วันเริ่มสัญญา" value={loan.startDate} />
              <Field label="วันสิ้นสุดสัญญา" value={loan.endDate} />
              {loan.lastPaymentDate && (
                <Field label="ชำระล่าสุด" value={loan.lastPaymentDate} />
              )}
              {/* Progress */}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", marginBottom: 6 }}>
                  <span>ความคืบหน้าสัญญา</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4 }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: "#6366f1", borderRadius: 4, transition: "width .5s" }} />
                </div>
              </div>
            </Card>

            {/* Overdue */}
            {loan.overdueMonths > 0 && (
              <Card title="ยอดค้างชำระ" icon="⚠️" danger>
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: ".5px", marginBottom: 4 }}>ยอดรวมค้างชำระทั้งหมด</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: "#ef4444" }}>{fmt(loan.overdueAmount)}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>ค้างชำระ {loan.overdueMonths} งวด</div>
                </div>
              </Card>
            )}

            {/* Contact */}
            {(loan.status === "overdue" || loan.status === "repossession") && (
              <div style={styles.contactCard}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>📞</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>ติดต่อเพื่อชำระหนี้</div>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 14 }}>
                  ศูนย์บริการลูกค้าสินเชื่อยานยนต์ — เปิดทำการ จ–ศ 08:00–17:30 น.
                </div>
                <a href="tel:021234567" style={styles.callBtn}>📞 โทร 02-123-4567</a>
                <div style={{ marginTop: 10, fontSize: 12, color: "#94a3b8" }}>
                  หรือ LINE: @autofinanceth
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        © 2024 AutoFinance Thailand · ระบบตรวจสอบสินเชื่อยานยนต์ · โทร 02-123-4567
      </footer>
    </div>
  );
}

function maskId(id: string) {
  const clean = id.replace(/-/g, "");
  if (clean.length < 6) return id;
  return clean.slice(0, 3) + "xxxxxxxxx" + clean.slice(-1);
}

function Card({ title, icon, children, danger }: { title: string; icon: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div style={{
      background: "#fff",
      border: danger ? "1.5px solid #fecaca" : "1px solid #e2e8f0",
      borderRadius: 14,
      padding: 24,
      boxShadow: "0 2px 8px rgba(0,0,0,.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h3 style={{ fontWeight: 700, fontSize: 15 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, gap: 12 }}>
      <span style={{ color: "#64748b" }}>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 500, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function CenterMessage({ icon, msg }: { icon: string; msg: string }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#64748b", fontFamily: "'Inter','Sarabun',sans-serif" }}>
      <div style={{ fontSize: 48 }}>{icon}</div>
      <p style={{ fontSize: 16 }}>{msg}</p>
      <a href="/repo" style={{ color: "#6366f1", fontSize: 14 }}>← กลับหน้าค้นหา</a>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter','Sarabun',sans-serif", color: "#1e293b" },
  header: { background: "#0f172a", padding: "0 24px" },
  headerInner: { maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 },
  backBtn: { fontSize: 13, color: "#94a3b8", background: "transparent", border: "1px solid #334155", borderRadius: 6, padding: "6px 14px", cursor: "pointer" },
  body: { maxWidth: 1000, margin: "0 auto", padding: "32px 24px" },
  statusBanner: { borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, marginBottom: 28 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  contactCard: { background: "#fff", border: "1.5px solid #6366f1", borderRadius: 14, padding: 24, textAlign: "center" as const },
  callBtn: { display: "block", background: "#6366f1", color: "#fff", borderRadius: 8, padding: "12px", fontWeight: 700, fontSize: 15, textDecoration: "none" },
  footer: { textAlign: "center" as const, padding: 24, color: "#94a3b8", fontSize: 12, background: "#0f172a", marginTop: 60 },
};

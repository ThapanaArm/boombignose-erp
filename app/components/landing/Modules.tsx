const MODULES = [
  { color: "orange", icon: "🛒", title: "Sales & CRM", items: ["Quotation & invoice management", "Customer pipeline tracking", "Sales team performance", "Multi-channel order intake"] },
  { color: "blue", icon: "📦", title: "Inventory", items: ["Multi-warehouse management", "Low stock alerts", "Barcode & QR scanning", "Batch & serial tracking"] },
  { color: "green", icon: "💰", title: "Accounting", items: ["General ledger & journal", "Accounts payable/receivable", "Thai e-Tax Invoice (ETAX)", "Financial statements"] },
  { color: "purple", icon: "👥", title: "HR & Payroll", items: ["Employee records", "Leave & attendance", "Automated payroll", "Social security filing"] },
  { color: "red", icon: "🏭", title: "Manufacturing", items: ["Bill of Materials (BOM)", "Work order tracking", "Production cost analysis", "Quality control"] },
  { color: "teal", icon: "📊", title: "Reports & BI", items: ["Executive dashboard", "Custom report builder", "Export to Excel/PDF", "Scheduled email reports"] },
];

export default function Modules() {
  return (
    <section className="modules" id="modules">
      <div className="container">
        <div className="section-header">
          <h2>Powerful Modules, One Platform</h2>
          <p>Activate only what you need. Pay only for what you use.</p>
        </div>
        <div className="modules-grid">
          {MODULES.map((m) => (
            <div className="module-card" key={m.title}>
              <div className={`module-header ${m.color}`}>
                <span>{m.icon}</span> {m.title}
              </div>
              <ul>
                {m.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

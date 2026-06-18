const FEATURES = [
  { icon: "⚡", title: "Real-time Data", desc: "All departments see the same up-to-the-minute numbers. No more spreadsheet chaos." },
  { icon: "🔒", title: "Role-Based Access", desc: "Fine-grained permissions so each team member sees only what they need." },
  { icon: "📱", title: "Mobile Ready", desc: "Approve purchase orders, check stock, and view reports from any device." },
  { icon: "🤖", title: "AI Insights", desc: "Automated forecasting and anomaly alerts powered by machine learning." },
  { icon: "🔗", title: "Open API", desc: "Connect with Lazada, Shopee, Shopify, LINE, and 100+ other platforms." },
  { icon: "🇹🇭", title: "Thai Tax Ready", desc: "VAT, withholding tax, and e-Tax Invoice compliant out of the box." },
];

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-header">
          <h2>Everything you need to run your business</h2>
          <p>From small shops to enterprise, BoomBigNose scales with you.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  {
    tier: "Starter",
    amount: "฿990",
    per: "/mo",
    desc: "Perfect for small shops & freelancers",
    featured: false,
    cta: "Get Started",
    ctaClass: "btn-outline",
    features: [
      "✅ Up to 3 users",
      "✅ Sales & Inventory modules",
      "✅ Basic reports",
      "✅ Email support",
      "❌ Accounting module",
      "❌ API access",
    ],
  },
  {
    tier: "Business",
    amount: "฿2,490",
    per: "/mo",
    desc: "For growing SMEs that need more power",
    featured: true,
    cta: "Start Free Trial",
    ctaClass: "btn-primary",
    features: [
      "✅ Up to 15 users",
      "✅ All core modules",
      "✅ AI insights",
      "✅ API access",
      "✅ Priority support",
      "❌ Custom integrations",
    ],
  },
  {
    tier: "Enterprise",
    amount: "Custom",
    per: "",
    desc: "For large organisations with complex needs",
    featured: false,
    cta: "Contact Sales",
    ctaClass: "btn-outline",
    features: [
      "✅ Unlimited users",
      "✅ All modules + custom",
      "✅ On-premise option",
      "✅ Dedicated account manager",
      "✅ SLA guarantee",
      "✅ Custom integrations",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="section-header">
          <h2>Simple, Transparent Pricing</h2>
          <p>No hidden fees. Cancel anytime.</p>
        </div>
        <div className="pricing-grid">
          {PLANS.map((p) => (
            <div className={"price-card" + (p.featured ? " featured" : "")} key={p.tier}>
              {p.featured && <div className="price-badge">Most Popular</div>}
              <div className="price-tier">{p.tier}</div>
              <div className="price-amount">
                {p.amount}
                {p.per && <span>{p.per}</span>}
              </div>
              <div className="price-desc">{p.desc}</div>
              <ul className="price-features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a href="#contact" className={`btn ${p.ctaClass} btn-block`}>
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

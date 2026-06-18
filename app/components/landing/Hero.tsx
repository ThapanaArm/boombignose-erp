export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">🚀 Now in Beta — Join Early Access</div>
          <h1 className="hero-title">
            Run Your Business
            <br />
            <span className="gradient-text">Smarter, Faster.</span>
          </h1>
          <p className="hero-desc">
            BoomBigNose ERP unifies your sales, inventory, purchasing, finance, and HR
            into one powerful platform built for growing businesses in Southeast Asia.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary btn-lg">Start Free Trial</a>
            <a href="#features" className="btn btn-ghost btn-lg">See How It Works →</a>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>500+</strong><span>Businesses</span></div>
            <div className="stat-div" />
            <div className="stat"><strong>99.9%</strong><span>Uptime</span></div>
            <div className="stat-div" />
            <div className="stat"><strong>24/7</strong><span>Support</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="dashboard-mock">
            <div className="mock-topbar">
              <span className="mock-dot red" />
              <span className="mock-dot yellow" />
              <span className="mock-dot green" />
              <span className="mock-title">BoomBigNose ERP Dashboard</span>
            </div>
            <div className="mock-body">
              <div className="mock-sidebar">
                <div className="mock-nav-item active">📊 Dashboard</div>
                <div className="mock-nav-item">🛒 Orders</div>
                <div className="mock-nav-item">📦 Inventory</div>
                <div className="mock-nav-item">💰 Finance</div>
                <div className="mock-nav-item">👥 HR</div>
              </div>
              <div className="mock-main">
                <div className="mock-kpi-row">
                  <div className="mock-kpi blue"><div className="kpi-val">฿2.4M</div><div className="kpi-label">Revenue</div></div>
                  <div className="mock-kpi green"><div className="kpi-val">1,284</div><div className="kpi-label">Orders</div></div>
                  <div className="mock-kpi orange"><div className="kpi-val">342</div><div className="kpi-label">Products</div></div>
                </div>
                <div className="mock-chart">
                  <div className="chart-bar" style={{ height: "60%" }} />
                  <div className="chart-bar" style={{ height: "80%" }} />
                  <div className="chart-bar" style={{ height: "55%" }} />
                  <div className="chart-bar" style={{ height: "95%" }} />
                  <div className="chart-bar" style={{ height: "70%" }} />
                  <div className="chart-bar" style={{ height: "85%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

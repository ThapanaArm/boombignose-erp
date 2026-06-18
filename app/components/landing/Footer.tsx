export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ marginBottom: 12 }}>
              <span className="logo-icon">🐘</span>
              <span className="logo-text">BoomBigNose ERP</span>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 14 }}>
              Smart business management for Southeast Asian enterprises.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#modules">Modules</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">API Reference</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 BoomBigNose.org — All rights reserved.</span>
          <span>
            <a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

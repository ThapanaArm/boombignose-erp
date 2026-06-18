"use client";

import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Ready to get started?</h2>
            <p>Talk to our team and get a free personalised demo in under 30 minutes.</p>
            <div className="contact-details">
              <div className="contact-item">📧 <a href="mailto:hello@boombignose.org">hello@boombignose.org</a></div>
              <div className="contact-item">📞 <a href="tel:+66800000000">+66 80 000 0000</a></div>
              <div className="contact-item">📍 Bangkok, Thailand</div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Somchai Jaidee" required />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input type="text" placeholder="My Company Co., Ltd." />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@company.com" required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" placeholder="+66 8x xxx xxxx" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows={4} placeholder="Tell us about your business and what you need..." />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Send Message</button>
            <div className={"form-success" + (sent ? " show" : "")}>
              ✅ Message sent! We&apos;ll be in touch within 24 hours.
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

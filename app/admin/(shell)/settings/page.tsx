"use client";

import { useState } from "react";

type Tab = "general" | "security" | "integrations" | "notifications" | "billing";

const TABS: { id: Tab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "security", label: "Security" },
  { id: "integrations", label: "Integrations" },
  { id: "notifications", label: "Notifications" },
  { id: "billing", label: "Billing" },
];

function Toggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <button
      className={"toggle " + (on ? "on" : "off")}
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
    />
  );
}

function Field({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="settings-field">
      <div className="settings-field-info">
        <strong>{title}</strong>
        <span>{sub}</span>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("general");

  return (
    <div className="settings-grid">
      <div className="settings-nav">
        {TABS.map((t) => (
          <div
            key={t.id}
            className={"settings-nav-item" + (tab === t.id ? " active" : "")}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </div>
        ))}
      </div>

      <div className="settings-section">
        {tab === "general" && (
          <>
            <h3>General Settings</h3>
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" defaultValue="BoomBigNose Co., Ltd." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Currency</label>
                <select><option>THB — Thai Baht</option><option>USD</option><option>SGD</option></select>
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <select><option>Asia/Bangkok (GMT+7)</option><option>UTC</option></select>
              </div>
            </div>
            <div className="form-group">
              <label>Tax ID (เลขประจำตัวผู้เสียภาษี)</label>
              <input type="text" defaultValue="0105550012345" />
            </div>
            <div className="form-group">
              <label>Default VAT Rate</label>
              <select><option>7% (Standard)</option><option>0% (Export)</option></select>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 8 }}>Save Changes</button>
          </>
        )}

        {tab === "security" && (
          <>
            <h3>Security</h3>
            <Field title="Two-Factor Authentication" sub="Add an extra layer of security">
              <Toggle initial={false} />
            </Field>
            <Field title="Session Timeout" sub="Auto-logout after inactivity">
              <select className="filter-select"><option>30 minutes</option><option>1 hour</option><option>8 hours</option></select>
            </Field>
            <Field title="Login Alerts" sub="Email on new device login">
              <Toggle initial={true} />
            </Field>
          </>
        )}

        {tab === "integrations" && (
          <>
            <h3>Integrations</h3>
            <Field title="Shopee" sub="Sync orders from Shopee">
              <button className="btn btn-outline btn-sm">Connect</button>
            </Field>
            <Field title="Lazada" sub="Sync orders from Lazada">
              <button className="btn btn-outline btn-sm">Connect</button>
            </Field>
            <Field title="LINE Notify" sub="Get alerts on LINE">
              <button className="btn btn-primary btn-sm">Connected ✓</button>
            </Field>
            <Field title="Thai e-Tax Invoice (ETDA)" sub="ETAX filing integration">
              <button className="btn btn-outline btn-sm">Configure</button>
            </Field>
          </>
        )}

        {tab === "notifications" && (
          <>
            <h3>Notifications</h3>
            <Field title="Low Stock Alerts" sub="When product reaches reorder point">
              <Toggle initial={true} />
            </Field>
            <Field title="New Order Alerts" sub="Instant notification on new order">
              <Toggle initial={true} />
            </Field>
            <Field title="Overdue Invoice Reminder" sub="Daily digest of unpaid invoices">
              <Toggle initial={false} />
            </Field>
          </>
        )}

        {tab === "billing" && (
          <>
            <h3>Billing & Plan</h3>
            <div
              style={{
                background: "rgba(99,102,241,.1)",
                border: "1px solid rgba(99,102,241,.3)",
                borderRadius: 10,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 13, color: "#818cf8", fontWeight: 600, marginBottom: 4 }}>
                Current Plan: Business
              </div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>฿2,490 / month</div>
              <div style={{ fontSize: 12, color: "#8b8bac", marginTop: 4 }}>Next billing: July 18, 2026</div>
            </div>
            <button className="btn btn-outline" style={{ marginRight: 10 }}>Download Invoice</button>
            <button className="btn btn-primary">Upgrade to Enterprise</button>
          </>
        )}
      </div>
    </div>
  );
}

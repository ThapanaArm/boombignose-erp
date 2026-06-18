"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/admin.css";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/admin/dashboard");
  };

  return (
    <div className="auth-body">
      <div className="auth-card">
        <div className="auth-logo">
          <span>🐘</span>
          <span>
            BoomBigNose <strong>ERP</strong>
          </span>
        </div>
        <h2>Admin Login</h2>
        <p className="auth-sub">Sign in to access your ERP dashboard</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="admin@boombignose.org" defaultValue="admin@boombignose.org" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" defaultValue="admin1234" required />
          </div>
          <div className="login-hint">Demo credentials are pre-filled — just click Login</div>
          <button type="submit" className="btn btn-primary btn-block">
            Login to Dashboard
          </button>
        </form>
        <Link href="/" className="back-link">
          ← Back to Landing Page
        </Link>
      </div>
    </div>
  );
}

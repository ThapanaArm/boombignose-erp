"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")} id="navbar">
      <div className="nav-inner">
        <Link href="/" className="logo">
          <span className="logo-icon">🐘</span>
          <span className="logo-text">
            BoomBigNose<span className="logo-dot"> ERP</span>
          </span>
        </Link>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#modules">Modules</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-cta">
          <Link href="/admin/login" className="btn btn-outline">Admin Login</Link>
          <a href="#contact" className="btn btn-primary">Get Started</a>
        </div>
        <button
          className="hamburger"
          id="hamburger"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>
      </div>
      <div className={"mobile-menu" + (menuOpen ? " open" : "")} id="mobileMenu">
        <a href="#features" onClick={closeMenu}>Features</a>
        <a href="#modules" onClick={closeMenu}>Modules</a>
        <a href="#pricing" onClick={closeMenu}>Pricing</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
        <Link href="/admin/login" className="btn btn-primary" style={{ marginTop: 8 }} onClick={closeMenu}>
          Admin Login
        </Link>
      </div>
    </nav>
  );
}

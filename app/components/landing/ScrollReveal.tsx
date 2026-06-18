"use client";

import { useEffect } from "react";

/**
 * Reveals landing cards on scroll — ports the IntersectionObserver effect
 * from the original landing.js. Renders nothing.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(
      ".feature-card, .module-card, .price-card"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

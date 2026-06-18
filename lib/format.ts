// ==========================================
//  BoomBigNose ERP — Formatting helpers
// ==========================================

import type { BadgeVariant } from "./types";

/** Format a number as Thai Baht currency. */
export const fmt = (n: number): string => "฿" + Number(n).toLocaleString("en-US");

/** Map a status string to its badge colour variant. */
export function badgeVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    Delivered: "green",
    Paid: "green",
    Active: "green",
    Processing: "blue",
    Pending: "orange",
    Unpaid: "orange",
    "Low Stock": "orange",
    "On Leave": "orange",
    Shipped: "purple",
    Cancelled: "red",
    Overdue: "red",
    "Out of Stock": "red",
  };
  return map[status] ?? "muted";
}

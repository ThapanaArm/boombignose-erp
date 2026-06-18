interface Slice {
  label: string;
  val: number;
  color: string;
}

const DEFAULT_DATA: Slice[] = [
  { label: "Delivered", val: 42, color: "#10b981" },
  { label: "Shipped", val: 18, color: "#8b5cf6" },
  { label: "Processing", val: 22, color: "#3b82f6" },
  { label: "Pending", val: 12, color: "#f59e0b" },
  { label: "Cancelled", val: 6, color: "#ef4444" },
];

/** Orders-by-status donut — ports renderDonut SVG math. */
export default function DonutChart({ data = DEFAULT_DATA }: { data?: Slice[] }) {
  const total = data.reduce((s, d) => s + d.val, 0);
  const cx = 60;
  const cy = 60;
  const r = 48;
  const stroke = 16;
  const rInner = r - stroke / 2;
  const circumference = 2 * Math.PI * rInner;

  const pcts = data.map((d) => d.val / total);
  // Cumulative fraction preceding each slice (no render-time mutation).
  const before = pcts.map((_, i) => pcts.slice(0, i).reduce((s, p) => s + p, 0));
  const segments = data.map((d, i) => {
    const pct = pcts[i];
    const dash = pct * circumference;
    const gap = circumference - dash;
    const rot = before[i] * 360;
    const after = before[i] + pct;
    const dashoffset = circumference * 0.25 - after * circumference + dash;
    return { ...d, dash, gap, rot, dashoffset };
  });

  return (
    <div className="donut-wrap">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {segments.map((s) => (
          <circle
            key={s.label}
            cx={cx}
            cy={cy}
            r={rInner}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={s.dashoffset}
            transform={`rotate(${s.rot - 90} ${cx} ${cy})`}
          />
        ))}
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="#e2e8f0">
          {total}
        </text>
      </svg>
      <div className="donut-legend">
        {data.map((d) => (
          <div className="legend-item" key={d.label}>
            <span className="legend-dot" style={{ background: d.color }} />
            <span className="legend-label">{d.label}</span>
            <span className="legend-val">{d.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BarChartProps {
  labels: string[];
  values: number[];
  maxPx?: number;
}

/** Monthly revenue bar chart — ports renderRevenueChart (px-height fix). */
export default function BarChart({ labels, values, maxPx = 120 }: BarChartProps) {
  const max = Math.max(...values);
  return (
    <div className="bar-chart">
      {labels.map((label, i) => (
        <div className="bar-group" key={label}>
          <div
            className="bar-fill"
            style={{ height: `${Math.round((values[i] / max) * maxPx)}px` }}
          />
          <div className="bar-label">{label}</div>
        </div>
      ))}
    </div>
  );
}

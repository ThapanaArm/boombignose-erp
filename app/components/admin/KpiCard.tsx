interface KpiCardProps {
  color: "blue" | "green" | "orange" | "purple" | "red";
  icon: string;
  label: string;
  value: string;
  change: string;
  changeDir?: "up" | "down";
  valueStyle?: React.CSSProperties;
}

export default function KpiCard({
  color,
  icon,
  label,
  value,
  change,
  changeDir = "up",
  valueStyle,
}: KpiCardProps) {
  return (
    <div className={`kpi-card ${color}`}>
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={valueStyle}>{value}</div>
      <div className={`kpi-change ${changeDir}`}>{change}</div>
    </div>
  );
}

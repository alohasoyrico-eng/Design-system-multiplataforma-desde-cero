import "../../css/data/Donut.css";

export interface FlowDonutProps {
  /** Percentage 0–100. */
  value: number;
  /** Pixel size of the ring. */
  size?: number;
  /** Stroke thickness in viewBox units (0–50). */
  thickness?: number;
  /** Accessible label; the percentage is appended. */
  label?: string;
}

/** FlowDonut — a single-value progress ring. Colors come from comp.donut tokens. */
export function FlowDonut({ value, size = 96, thickness = 10, label }: FlowDonutProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const r = 50 - thickness / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (clamped / 100) * circumference;

  return (
    <div className="flow-donut" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="flow-donut__svg"
        role="img"
        aria-label={label ? `${label}: ${clamped}%` : `${clamped}%`}
      >
        <circle
          className="flow-donut__track"
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth={thickness}
        />
        <circle
          className="flow-donut__indicator"
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth={thickness}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className="flow-donut__value">{clamped}%</span>
    </div>
  );
}

import "../../css/data/Sparkline.css";

export interface FlowSparklineProps {
  /** Series of numeric values. */
  data: number[];
  width?: number;
  height?: number;
  tone?: "accent" | "positive" | "muted";
  /** Accessible label describing the trend. */
  label?: string;
}

/** FlowSparkline — a compact trend line. Stroke color comes from comp.sparkline tokens. */
export function FlowSparkline({
  data,
  width = 120,
  height = 36,
  tone = "accent",
  label,
}: FlowSparklineProps) {
  const w = 100;
  const h = 30;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = data.length > 1 ? w / (data.length - 1) : 0;
  const points = data
    .map((v, i) => `${(i * step).toFixed(2)},${(h - ((v - min) / span) * h).toFixed(2)}`)
    .join(" ");

  return (
    <svg
      className="flow-sparkline"
      data-tone={tone}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ width, height }}
      role="img"
      aria-label={label ?? "Tendencia"}
    >
      <polyline className="flow-sparkline__line" fill="none" points={points} />
    </svg>
  );
}

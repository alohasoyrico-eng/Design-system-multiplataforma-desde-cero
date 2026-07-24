import type { ReactNode } from "react";
import "../../css/fintech/MapCanvas.css";

export interface MapPin {
  /** Position in percent of the canvas (0–100). */
  x: number;
  y: number;
  label: string;
  /** Use the accent color (e.g. surge price). */
  accent?: boolean;
}

export interface FlowMapCanvasProps {
  pins?: MapPin[];
  /** Route points in percent (0–100). */
  route?: { x: number; y: number }[];
  ariaLabel: string;
  /** Optional real tile layer rendered behind the schematic (e.g. an OSM map). */
  children?: ReactNode;
}

const W = 320;
const H = 200;

/** FlowMapCanvas — schematic map surface with a route and price pins. Token-driven; slot a real tile layer via children. */
export function FlowMapCanvas({ pins = [], route, ariaLabel, children }: FlowMapCanvasProps) {
  const px = (x: number) => (x / 100) * W;
  const py = (y: number) => (y / 100) * H;

  return (
    <div className="flow-map" role="img" aria-label={ariaLabel}>
      {children && <div className="flow-map__tiles">{children}</div>}
      <svg
        className="flow-map__svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g className="flow-map__grid">
          {[0.2, 0.4, 0.6, 0.8].map((f) => (
            <line key={`h${f}`} x1={0} x2={W} y1={H * f} y2={H * f} />
          ))}
          {[0.2, 0.4, 0.6, 0.8].map((f) => (
            <line key={`v${f}`} x1={W * f} x2={W * f} y1={0} y2={H} />
          ))}
        </g>
        {route && route.length > 1 && (
          <polyline
            className="flow-map__route"
            points={route.map((p) => `${px(p.x)},${py(p.y)}`).join(" ")}
          />
        )}
        {pins.map((pin, i) => {
          const w = pin.label.length * 6.5 + 16;
          const x = px(pin.x);
          const y = py(pin.y);
          return (
            <g key={i} className="flow-map__pin" data-accent={pin.accent || undefined}>
              <rect
                x={x - w / 2}
                y={y - 26}
                width={w}
                height={18}
                rx={9}
                className="flow-map__pin-bg"
              />
              <text
                x={x}
                y={y - 17}
                dy="0.32em"
                textAnchor="middle"
                className="flow-map__pin-label"
              >
                {pin.label}
              </text>
              <circle cx={x} cy={y} r={4} className="flow-map__pin-dot" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

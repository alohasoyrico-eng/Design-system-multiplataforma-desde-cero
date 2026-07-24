import type { HTMLAttributes, ReactNode } from "react";
import "../../css/display/StatTile.css";

export interface FlowStatTileProps extends HTMLAttributes<HTMLDivElement> {
  /** Overline label, e.g. "Unidades activas". */
  label: ReactNode;
  /** The number — rendered in JetBrains Mono, protagonist of the tile. */
  value: ReactNode;
  /** Optional trailing detail, e.g. a delta or unit. */
  detail?: ReactNode;
}

/** FlowStatTile — KPI tile. The value is always mono; the label is an uppercase overline. */
export function FlowStatTile({ label, value, detail, ...rest }: FlowStatTileProps) {
  return (
    <div className="flow-stat-tile" {...rest}>
      <span className="flow-stat-tile__label">{label}</span>
      <span className="flow-stat-tile__value">{value}</span>
      {detail && <span className="flow-stat-tile__detail">{detail}</span>}
    </div>
  );
}

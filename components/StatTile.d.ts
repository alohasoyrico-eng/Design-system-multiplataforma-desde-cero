/** Compact KPI tile: overline label, mono value, trend delta. */
export interface StatTileProps {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  icon?: string;
  /** Icon color token. */
  tone?: string;
  style?: React.CSSProperties;
}
export declare function StatTile(props: StatTileProps): JSX.Element;

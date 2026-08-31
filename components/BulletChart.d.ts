export interface BulletRow { label: string; value: number; target: number; prev?: number; max?: number; }
/** Real-vs-target bar per entity — denser than a gauge, good for comparing many entities against budget at once. */
export interface BulletChartProps {
  rows: BulletRow[];
  format?: (v: number) => string;
  style?: React.CSSProperties;
}
export declare function BulletChart(props: BulletChartProps): JSX.Element;

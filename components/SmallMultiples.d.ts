export interface SmallMultipleItem { id: string; label: string; values: number[]; }
/** Grid of mini sparklines sharing one Y scale — compare shape/trend across many entities (regiones, subflotas) at a glance; outliers flagged via isOutlier. */
export interface SmallMultiplesProps {
  items: SmallMultipleItem[];
  height?: number;
  columns?: number;
  isOutlier?: (item: SmallMultipleItem) => boolean;
  format?: (v: number) => string;
  selectedId?: string;
  onSelect?: (item: SmallMultipleItem) => void;
  style?: React.CSSProperties;
}
export declare function SmallMultiples(props: SmallMultiplesProps): JSX.Element;

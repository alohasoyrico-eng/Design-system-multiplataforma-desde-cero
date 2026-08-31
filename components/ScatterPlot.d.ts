export interface ScatterPoint { id: string; x: number; y: number; label: string; size?: number; color?: string; }
/** Scatter with quadrant thresholds (dashed lines). For efficiency analysis across hundreds of units without listing rows. */
export interface ScatterPlotProps {
  points: ScatterPoint[];
  xLabel?: string;
  yLabel?: string;
  xThreshold?: number;
  yThreshold?: number;
  format?: { x?: (v: number) => string; y?: (v: number) => string };
  /** @deprecated Se ignora: el chart es responsivo al contenedor. */
  width?: number;
  height?: number;
  selectedId?: string;
  onSelect?: (point: ScatterPoint) => void;
  style?: React.CSSProperties;
}
export declare function ScatterPlot(props: ScatterPlotProps): JSX.Element;

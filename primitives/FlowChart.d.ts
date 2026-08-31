export interface ChartSeries {
  label: string;
  /** Numeros para line/bar/radar; [x,y] para scatter; [min,q1,med,q3,max] para boxplot. */
  values?: any[];
  /** Alternativa a values para donut/pie/funnel/treemap: [{label,value,color?}]. */
  data?: Array<{ label?: string; name?: string; value: number; color?: string }>;
  color?: string;
  symbolSize?: number;
}
export interface ChartMatrix { rows: string[]; cols: string[]; values: [number, number, number][] }
export type FlowChartType =
  | 'line' | 'area' | 'bar' | 'stackedBar' | 'stacked100'
  | 'donut' | 'pie' | 'scatter' | 'heatmap' | 'radar'
  | 'waterfall' | 'pareto' | 'gauge' | 'funnel' | 'treemap' | 'boxplot';

/** Envoltorio de ECharts con el tema de Flow. Lee los tokens en runtime: claro y oscuro salen del mismo componente. */
export interface FlowChartProps {
  type?: FlowChartType;
  series?: ChartSeries[];
  /** Etiquetas del eje de categorias. */
  labels?: string[];
  height?: number;
  /** Formatea valores en eje, tooltip y etiquetas. */
  format?: (value: number) => string;
  legend?: boolean;
  stack?: boolean;
  smooth?: boolean;
  /** Nombre de la serie que se pinta en --viz-accent. Una sola. */
  highlight?: string;
  horizontal?: boolean;
  showValues?: boolean;
  min?: number;
  max?: number;
  /** heatmap */
  matrix?: ChartMatrix;
  /** radar: nombres o [{name,max}]. */
  indicators?: Array<string | { name: string; max: number }>;
  /** gauge: valor mostrado. */
  target?: number;
  /** waterfall: indices que son totales, no deltas. */
  totals?: number[];
  /** 'auto' usa tinta+accent con 1-3 series y la categorica con 4+. */
  palette?: 'auto' | 'duo' | 'categorical';
  /** Animacion de montaje: barras crecen, lineas se dibujan, donut barre. */
  animate?: boolean;
  loading?: boolean;
  emptyLabel?: string;
  /** Merge profundo sobre la opcion generada. Escape hatch a ECharts crudo. */
  option?: Record<string, any>;
  onSelect?: (params: any) => void;
  ariaLabel?: string;
  style?: React.CSSProperties;
}
export declare function FlowChart(props: FlowChartProps): JSX.Element;
/** Carga ECharts del CDN una sola vez. Llamalo para precargar. */
export declare function loadEcharts(src?: string): Promise<any>;

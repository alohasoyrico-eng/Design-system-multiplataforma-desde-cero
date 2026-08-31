export interface TreemapNode { id: string; label: string; value: number; deviation?: number; children?: TreemapNode[]; }
/** Hierarchical treemap (entidad → región → unidad) with click-to-drill. Size = value, color = deviation vs budget (green under, red over). */
export interface TreemapProps {
  nodes: TreemapNode[];
  /** @deprecated Se ignora: el chart es responsivo al contenedor. */
  width?: number;
  height?: number;
  format?: (v: number) => string;
  onDrill?: (node: TreemapNode) => void;
  style?: React.CSSProperties;
}
export declare function Treemap(props: TreemapProps): JSX.Element;

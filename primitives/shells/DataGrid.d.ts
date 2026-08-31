/** Mecanica de tabla. Generado desde contracts/data-grid.json. */
export interface GridColumn<T = any> {
  key: string; label: string;
  width?: number | string;
  align?: 'left' | 'right' | 'center';
  mono?: boolean;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  editable?: boolean;
  render?: (row: T) => React.ReactNode;
}
export interface GridSort { key: string; dir: 1 | -1 }
export interface DataGridProps<T = any> {
  columns: GridColumn<T>[];
  /** Una fila con { __group: 'Nombre' } se pinta como encabezado de seccion. */
  rows: T[];
  rowKey?: string;
  density?: 'default' | 'dense';
  zebra?: boolean;
  stickyHeader?: boolean;
  sort?: GridSort | null;
  defaultSort?: GridSort;
  onSortChange?: (sort: GridSort | null) => void;
  /** Habilita la columna de seleccion. */
  selection?: string[];
  onSelectionChange?: (keys: string[]) => void;
  editable?: boolean;
  onEdit?: (rowKey: string, colKey: string, value: string) => void;
  tree?: boolean;
  childrenKey?: string;
  renderDetail?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
  selectedKey?: string | number;
  emptyLabel?: string;
  style?: React.CSSProperties;
  tableStyle?: React.CSSProperties;
}
export declare function DataGrid<T = any>(props: DataGridProps<T>): JSX.Element;

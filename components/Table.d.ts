export interface TableColumn<T = any> {
  key: string;
  label: string;
  width?: number | string;
  align?: 'left' | 'right' | 'center';
  mono?: boolean;
  /** Enables the sort button in the header; toggles asc → desc → none. */
  sortable?: boolean;
  /** Custom value to sort by when it differs from row[key] (e.g. sort a Badge column by severity). */
  sortValue?: (row: T) => string | number;
  render?: (row: T) => React.ReactNode;
}
/** Data table with hoverable/selectable rows and optional column sorting. */
export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey?: string;
  onRowClick?: (row: T) => void;
  selectedKey?: string | number;
  dense?: boolean;
  /** Activa filas expandibles: chevron en la primera columna + fila de detalle. */
  renderDetail?: (row: T) => React.ReactNode;
  /** Initial sort: {key, dir: 1 | -1}. */
  defaultSort?: { key: string; dir: 1 | -1 };
  style?: React.CSSProperties;
}
export declare function Table<T = any>(props: TableProps<T>): JSX.Element;

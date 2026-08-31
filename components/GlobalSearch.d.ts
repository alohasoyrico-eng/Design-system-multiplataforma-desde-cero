export interface SearchResult {
  id: string;
  label: string;
  /** Nombre del grupo, p.ej. 'Unidades'. Sin grupo cae en 'Otros'. */
  group?: string;
  icon?: string;
  /** Segunda linea: contexto que desambigua homonimos. */
  meta?: string;
  /** Renderiza el label en JetBrains Mono (placas, IDs, montos). */
  mono?: boolean;
  /** Nodo a la derecha, p.ej. un Badge de estado. */
  trailing?: React.ReactNode;
  [key: string]: any;
}
/** Busqueda global. No busca: orquesta la UI. Pasa `results` ya resueltos. */
export interface GlobalSearchProps {
  mode?: 'palette' | 'inline';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  results?: SearchResult[];
  /** Orden fijo de grupos; los no listados van al final, alfabeticos. */
  groupOrder?: string[];
  loading?: boolean;
  /** Se muestran cuando value < minChars. */
  recents?: SearchResult[];
  onSelect?: (item: SearchResult) => void;
  onClearRecents?: () => void;
  placeholder?: string;
  emptyHint?: string;
  /** Registra ⌘K / Ctrl+K. Solo mode 'palette'. */
  shortcut?: boolean;
  minChars?: number;
  style?: React.CSSProperties;
}
export declare function GlobalSearch(props: GlobalSearchProps): JSX.Element | null;

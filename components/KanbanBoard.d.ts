import * as React from 'react';

export interface KanbanColumn {
  id: string;
  label: string;
  /** Punto de color en la cabecera; la columna de salida no lo pinta. */
  color?: string;
  /** Tope de tarjetas: al alcanzarlo la columna rechaza el drop y lo anuncia. */
  limit?: number;
}

export interface KanbanAbandonColumn {
  id: string;
  label: string;
  reasonKey?: string;
}

export interface KanbanBoardProps<T = any> {
  columns: KanbanColumn[];
  items: T[];
  columnKey?: string;
  itemKey?: string;
  renderCard: (item: T, state: { dragging: boolean }) => React.ReactNode;
  onMove: (itemKey: string, toColumn: string) => void | boolean;
  onAdvance?: (itemKey: string) => void;
  abandonColumn?: KanbanAbandonColumn;
  renderDetail?: (item: T) => React.ReactNode;
  detailKey?: string | null;
  onDetailChange?: (itemKey: string | null) => void;
  style?: React.CSSProperties;
}

export declare function KanbanBoard<T = any>(props: KanbanBoardProps<T>): JSX.Element;

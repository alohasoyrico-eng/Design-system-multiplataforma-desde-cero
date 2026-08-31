import React from 'react';
import { DataGrid } from '../primitives/shells/DataGrid';

/** Tabla en arbol. rows: [{id, label, ...data, children: []}] */
export function TableTree({ columns = [], rows = [], rowKey = 'id', onRowClick, selectedKey, style }) {
  return React.createElement(DataGrid, {
    columns, rows, rowKey, onRowClick, selectedKey, tree: true, style,
  });
}

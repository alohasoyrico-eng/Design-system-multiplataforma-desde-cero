import React from 'react';
import { DataGrid } from '../primitives/shells/DataGrid';

/** columns: [{key, label, width?, align?, mono?, sortable?, sortValue?(row), render?(row)}]
 *  dense: paddings compactos. renderDetail?(row): filas expandibles. Ver contracts/table.json. */
export function Table({ columns = [], rows = [], rowKey, onRowClick, selectedKey, dense = false, defaultSort, renderDetail, style }) {
  return React.createElement(DataGrid, {
    columns, rows, rowKey, onRowClick, selectedKey, defaultSort, renderDetail,
    density: dense ? 'dense' : 'default', style,
  });
}

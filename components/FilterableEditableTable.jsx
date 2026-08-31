import React from 'react';
import { Input } from '../primitives/Input';
import { DataGrid } from '../primitives/shells/DataGrid';

/** Pattern de filtros + edicion en linea. La grid y la celda editable las pone DataGrid. */
export function FilterableEditableTable({ columns = [], rows = [], rowKey, onUpdate, onFilter, style }) {
  const [filters, setFilters] = React.useState({});

  const setFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    if (onFilter) onFilter(next);
  };

  const filtered = React.useMemo(() => rows.filter((row) =>
    Object.keys(filters).every((k) => {
      const f = filters[k];
      if (!f) return true;
      return String(row[k] == null ? '' : row[k]).toLowerCase().indexOf(String(f).toLowerCase()) > -1;
    })), [rows, filters]);

  const dirty = Object.keys(filters).some((k) => filters[k]);

  return React.createElement('div', { style: { ...style } },
    React.createElement('div', {
      style: {
        background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      },
    },
      React.createElement('span', {
        style: {
          fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: 'var(--tracking-overline)',
        },
      }, 'Filtrar:'),
      // El borde, el radio y el anillo de foco los pone ControlShell a traves de
      // Input: estos filtros los declaraban por su cuenta y eran la otra
      // infraccion de R3. El nombre accesible sigue diciendo la columna (fie-1).
      columns.filter((c) => c.filterable).map((c) => React.createElement(Input, {
        key: c.key, size: 'sm',
        'aria-label': 'Filtrar por ' + c.label,
        placeholder: c.label + '…',
        value: filters[c.key] || '',
        onChange: (v) => setFilter(c.key, v),
        style: { minWidth: 140 },
      })),
      dirty && React.createElement('button', {
        type: 'button',
        onClick: () => { setFilters({}); if (onFilter) onFilter({}); },
        style: {
          marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: 'var(--text-muted)',
        },
      }, 'Limpiar')),
    React.createElement(DataGrid, {
      columns, rows: filtered, rowKey, editable: true, onEdit: onUpdate,
      emptyLabel: dirty ? 'Ningún registro coincide con el filtro' : undefined,
      style: { borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', borderTop: 'none' },
    }));
}

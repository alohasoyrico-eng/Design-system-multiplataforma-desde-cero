import React from 'react';
import { DataGrid } from '../primitives/shells/DataGrid';
import { Button } from '../primitives/Button';
import { IconButton } from '../primitives/IconButton';

/** Pattern de seleccion multiple + toolbar de acciones. La grid la pone DataGrid; esto es el flujo. */
export function BulkActionsTable({ columns = [], rows = [], rowKey, actions = [], onActionClick, style }) {
  const [selection, setSelection] = React.useState([]);
  const n = selection.length;

  return React.createElement('div', { style: { ...style } },
    n > 0 && React.createElement('div', {
      role: 'toolbar', 'aria-label': 'Acciones sobre la selección',
      style: {
        background: 'var(--surface-accent-subtle)', border: '1px solid var(--border-focus)',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        animation: 'flowScaleIn var(--dur-fast) var(--ease-out)',
      },
    },
      React.createElement('span', {
        'aria-live': 'polite',
        style: { fontSize: 13, fontWeight: 600, color: 'var(--text-accent)' },
      }, n + ' seleccionado' + (n > 1 ? 's' : '')),
      React.createElement('div', { style: { flex: 1 } }),
      actions.map((a) => React.createElement(Button, {
        // El borde, el radio y el foco los pone Button: esta barra los declaraba
        // por su cuenta y era una de las dos infracciones de R3 que quedaban.
        key: a.id, variant: a.danger ? 'danger' : 'secondary', size: 'sm', icon: a.icon,
        onClick: () => onActionClick && onActionClick(a.id, selection.slice()),
      }, a.label)),
      React.createElement(IconButton, {
        // El glifo mide 18; el objetivo, --hit-target-min. Medía 18x18.
        icon: 'close', ariaLabel: 'Limpiar selección', variant: 'ghost', size: 'sm',
        onClick: () => setSelection([]),
      })),
    React.createElement(DataGrid, {
      columns, rows, rowKey, zebra: true,
      selection, onSelectionChange: setSelection,
      style: n > 0 ? { borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', borderTop: 'none' } : undefined,
    }));
}

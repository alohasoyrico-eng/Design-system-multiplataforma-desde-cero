import React from 'react';
import { Checkbox } from '../Checkbox';

const collator = new Intl.Collator('es');

/** La mecanica de una tabla. Ver contracts/data-grid.json. */
export function DataGrid({
  columns = [], rows = [], rowKey, density = 'default', zebra = false,
  stickyHeader = false, sort: sortProp, defaultSort, onSortChange,
  selection, onSelectionChange, editable = false, onEdit,
  tree = false, childrenKey = 'children', renderDetail,
  onRowClick, selectedKey, emptyLabel, style, tableStyle,
}) {
  const [hoverKey, setHoverKey] = React.useState(null);
  const [sortState, setSortState] = React.useState(defaultSort || null);
  const [expanded, setExpanded] = React.useState(() => new Set());
  const [edit, setEdit] = React.useState(null); // {key, col, value}
  const sort = sortProp !== undefined ? sortProp : sortState;

  const py = density === 'dense' ? 10 : 14;
  const keyOf = (row, i) => (rowKey ? row[rowKey] : i);

  const setSort = (next) => {
    if (sortProp === undefined) setSortState(next);
    if (onSortChange) onSortChange(next);
  };

  const sorted = React.useMemo(() => {
    if (!sort || tree) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const val = (r) => (col.sortValue ? col.sortValue(r) : r[sort.key]);
    return rows.slice().sort((a, b) => {
      const va = val(a), vb = val(b);
      if (va == null) return 1;
      if (vb == null) return -1;
      return (typeof va === 'number' && typeof vb === 'number' ? va - vb : collator.compare(String(va), String(vb))) * sort.dir;
    });
  }, [rows, sort, columns, tree]);

  // Arbol y filas de grupo se resuelven a una lista plana con depth
  const flat = React.useMemo(() => {
    if (!tree) return sorted.map((r) => ({ row: r, depth: 0 }));
    const out = [];
    const walk = (nodes, depth) => {
      nodes.forEach((n) => {
        out.push({ row: n, depth });
        const kids = n[childrenKey];
        if (kids && kids.length && expanded.has(rowKey ? n[rowKey] : n)) walk(kids, depth + 1);
      });
    };
    walk(sorted, 0);
    return out;
  }, [sorted, tree, expanded, childrenKey, rowKey]);

  const toggleExpand = (k) => setExpanded((prev) => {
    const n = new Set(prev);
    if (n.has(k)) n.delete(k); else n.add(k);
    return n;
  });

  const selectable = Array.isArray(selection);
  const allKeys = rows.filter((r) => !r.__group).map((r, i) => keyOf(r, i));
  const allOn = selectable && selection.length > 0 && selection.length === allKeys.length;
  const someOn = selectable && selection.length > 0 && !allOn;
  const toggleAll = () => onSelectionChange && onSelectionChange(allOn ? [] : allKeys);
  const toggleRow = (k) => {
    if (!onSelectionChange) return;
    onSelectionChange(selection.indexOf(k) > -1 ? selection.filter((x) => x !== k) : selection.concat([k]));
  };

  const utilityCol = (tree || renderDetail) ? 1 : 0;
  const nCols = columns.length + utilityCol + (selectable ? 1 : 0);

  const headCell = {
    padding: (py - 2) + 'px 16px', fontSize: 11, fontWeight: 600,
    letterSpacing: 'var(--tracking-overline)', textTransform: 'uppercase',
    color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)',
    background: 'var(--surface-sunken)', whiteSpace: 'nowrap',
    position: stickyHeader ? 'sticky' : undefined, top: stickyHeader ? 0 : undefined, zIndex: stickyHeader ? 2 : undefined,
  };

  const commitEdit = () => {
    if (edit && onEdit) onEdit(edit.key, edit.col, edit.value);
    setEdit(null);
  };

  return React.createElement('div', {
    style: {
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      // La tabla se separa de su tarjeta como cualquier otro bloque. Iba a sangre
      // contra el borde mientras el titulo de la tarjeta si respetaba --pad-card,
      // asi que la franja de cabecera parecia pegada al filo.
      padding: '0 var(--pad-card) var(--pad-card)',
      // El eje horizontal siempre desplaza: una tabla mas ancha que su contenedor
      // escondia la ultima columna sin scroll, y ahi viven los botones de accion
      // de cada fila. El vertical sigue dependiendo de la cabecera fija.
      overflowX: 'auto', overflowY: stickyHeader ? 'auto' : 'hidden',
      boxShadow: 'var(--shadow-rest)', ...style,
    },
  },
    React.createElement('table', {
      style: { width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13, ...tableStyle },
    },
      React.createElement('thead', null,
        React.createElement('tr', null,
          selectable && React.createElement('th', {
            key: '__sel', scope: 'col', style: { ...headCell, width: 44, padding: (py - 2) + 'px 12px', textAlign: 'center' },
          },
            // dg-4: checkbox real con indeterminate en el header
            React.createElement(Checkbox, {
              checked: allOn, indeterminate: someOn, onChange: toggleAll,
              style: { minHeight: 0 },
            })),
          utilityCol ? React.createElement('th', {
            key: '__util', scope: 'col', style: { ...headCell, width: 40, padding: (py - 2) + 'px 0 ' + (py - 2) + 'px 12px' },
          }) : null,
          columns.map((c) => {
            const active = sort && sort.key === c.key;
            const st = {
              ...headCell, textAlign: c.align || 'left', width: c.width,
              color: active ? 'var(--text-accent)' : headCell.color,
            };
            if (!c.sortable) return React.createElement('th', { key: c.key, scope: 'col', style: st }, c.label);
            // dg-2: aria-sort y boton enfocable
            return React.createElement('th', {
              key: c.key, scope: 'col',
              'aria-sort': active ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none',
              style: { ...st, padding: 0 },
            },
              React.createElement('button', {
                type: 'button',
                onClick: () => setSort(active && sort.dir === -1 ? null : { key: c.key, dir: active ? -1 : 1 }),
                style: {
                  display: 'inline-flex', alignItems: 'center', gap: 3, width: '100%', border: 'none',
                  background: 'transparent', cursor: 'pointer', font: 'inherit', color: 'inherit',
                  letterSpacing: 'inherit', textTransform: 'inherit',
                  padding: (py - 2) + 'px 16px', justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start',
                },
              },
                c.label,
                React.createElement('span', {
                  className: 'flow-symbol', 'aria-hidden': true,
                  style: {
                    fontSize: 14, opacity: active ? 1 : 0.35,
                    transform: active && sort.dir === -1 ? 'rotate(180deg)' : 'none',
                    transition: 'transform var(--dur-fast) var(--ease-spring), opacity var(--dur-fast) var(--ease-out)',
                  },
                }, 'arrow_upward')));
          }))),
      React.createElement('tbody', null,
        flat.length === 0 && emptyLabel
          ? React.createElement('tr', null, React.createElement('td', {
              colSpan: nCols,
              style: { padding: '28px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 },
            }, emptyLabel))
          : flat.map((entry, i) => {
              const row = entry.row;
              const k = keyOf(row, i);
              const isLast = i === flat.length - 1;

              // fila de grupo: encabezado de seccion dentro del cuerpo
              if (row.__group) {
                return React.createElement('tr', { key: '__g' + i },
                  React.createElement('td', {
                    colSpan: nCols,
                    style: {
                      padding: '12px 14px 6px', fontSize: 11, fontWeight: 700,
                      letterSpacing: 'var(--tracking-overline)', textTransform: 'uppercase',
                      color: 'var(--text-accent)',
                    },
                  }, row.__group));
              }

              const hovered = hoverKey === k;
              const isSel = selectable && selection.indexOf(k) > -1;
              const isPicked = selectedKey != null && selectedKey === k;
              const isOpen = renderDetail && expanded.has(k);
              const kids = tree && row[childrenKey] && row[childrenKey].length;
              const clickable = !!onRowClick || (!!renderDetail && !onRowClick);
              const bg = isSel || isPicked ? 'var(--surface-accent-subtle)'
                : hovered && (clickable || editable) ? 'var(--surface-sunken)'
                : zebra && i % 2 === 1 ? 'var(--surface-sunken)' : 'transparent';
              const bb = (isLast && !isOpen) ? 'none' : '1px solid var(--border-subtle)';

              const act = () => { if (onRowClick) onRowClick(row); else if (renderDetail) toggleExpand(k); };
              const main = React.createElement('tr', {
                key: k,
                onClick: clickable ? act : undefined,
                onMouseEnter: () => setHoverKey(k), onMouseLeave: () => setHoverKey(null),
                // dg-3: enfocable y operable con teclado
                tabIndex: clickable ? 0 : undefined,
                onKeyDown: clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } } : undefined,
                style: {
                  cursor: clickable ? 'pointer' : 'default', background: bg,
                  boxShadow: isPicked ? 'inset 3px 0 0 var(--action-accent)' : 'none',
                  transition: 'background var(--dur-instant) var(--ease-out)', outline: 'none',
                },
              },
                selectable && React.createElement('td', {
                  key: '__sel',
                  onClick: (e) => e.stopPropagation(),
                  style: { width: 44, padding: py + 'px 12px', textAlign: 'center', borderBottom: bb },
                },
                  React.createElement(Checkbox, { checked: isSel, onChange: () => toggleRow(k), style: { minHeight: 0 } })),
                utilityCol ? React.createElement('td', {
                  key: '__util',
                  style: { width: 40, padding: py + 'px 0 ' + py + 'px 12px', borderBottom: bb },
                },
                  (tree ? !!kids : true) && React.createElement('button', {
                    type: 'button',
                    'aria-expanded': (tree ? expanded.has(k) : !!isOpen),
                    'aria-label': (tree ? expanded.has(k) : !!isOpen) ? 'Contraer' : 'Expandir',
                    onClick: (e) => { e.stopPropagation(); toggleExpand(k); },
                    style: {
                      border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
                      color: 'var(--text-muted)', display: 'inline-flex',
                      transform: (tree ? expanded.has(k) : isOpen) ? 'rotate(90deg)' : 'none',
                      transition: 'transform var(--dur-fast) var(--ease-spring)',
                    },
                  }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18 } }, 'chevron_right'))) : null,
                columns.map((c, ci) => {
                  const editing = editable && c.editable && edit && edit.key === k && edit.col === c.key;
                  return React.createElement('td', {
                    key: c.key,
                    onDoubleClick: editable && c.editable ? () => setEdit({ key: k, col: c.key, value: row[c.key] }) : undefined,
                    style: {
                      padding: py + 'px 16px',
                      paddingLeft: tree && ci === 0 ? (entry.depth * 24 + 16) + 'px' : undefined,
                      textAlign: c.align || 'left',
                      fontFamily: c.mono ? 'var(--font-mono)' : 'var(--font-body)',
                      fontSize: c.mono ? 12.5 : 13,
                      color: 'var(--text-primary)', borderBottom: bb, whiteSpace: 'nowrap',
                      cursor: editable && c.editable ? 'text' : undefined,
                    },
                  },
                    // dg-5: Enter guarda, Escape cancela
                    editing ? React.createElement('input', {
                      autoFocus: true, type: 'text', value: edit.value,
                      onChange: (e) => setEdit({ ...edit, value: e.target.value }),
                      onBlur: commitEdit,
                      onKeyDown: (e) => {
                        if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
                        if (e.key === 'Escape') { e.preventDefault(); setEdit(null); }
                      },
                      style: {
                        width: '100%', minHeight: 32, boxSizing: 'border-box',
                        border: '1.5px solid var(--border-focus)', borderRadius: 'var(--radius-sm)',
                        padding: '0 8px', font: 'inherit', color: 'inherit', outline: 'none',
                        boxShadow: 'var(--focus-ring)',
                      },
                    }) : React.createElement('span', {
                      style: { display: 'inline-flex', alignItems: 'center', gap: 8 },
                    },
                      c.render ? c.render(row) : row[c.key],
                      editable && c.editable && hovered && React.createElement('span', {
                        className: 'flow-symbol', 'aria-hidden': true,
                        style: { fontSize: 14, color: 'var(--text-muted)', opacity: 0.6, flexShrink: 0 },
                      }, 'edit')));
                }));

              if (!isOpen) return main;
              return [main, React.createElement('tr', { key: k + '__d' },
                React.createElement('td', {
                  colSpan: nCols,
                  style: {
                    padding: '14px 16px 16px 52px', background: 'var(--surface-sunken)',
                    borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
                  },
                }, renderDetail(row)))];
            }))));
}

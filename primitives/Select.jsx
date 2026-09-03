import React from 'react';
import { ControlShell } from './shells/ControlShell';
import { Popover } from './shells/Popover';
import { Listbox } from './shells/Listbox';

let uid = 0;

/** Seleccion de una lista conocida. Ver contracts/select.json. */
export function Select({
  id, value, onChange, options = [], placeholder = 'Selecciona…',
  multiple = false, searchable = false, creatable = false, clearable = false, renderOption,
  icon, size = 'md', disabled = false, invalid = false, emptyLabel = 'Sin resultados', style, ...rest
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeId, setActiveId] = React.useState(undefined);
  const anchorRef = React.useRef(null);
  const fieldRef = React.useRef(null);
  const listRef = React.useRef(null);
  const lbId = React.useRef('flow-lb-' + (++uid)).current;
  const onActiveIdChange = React.useCallback((v) => setActiveId(v), []);

  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const typing = searchable || creatable;
  const arr = Array.isArray(value) ? value : [];
  const sel = items.filter((o) => (multiple ? arr.indexOf(o.value) > -1 : o.value === value));

  const label = multiple
    ? (arr.length ? arr.length + ' seleccionado' + (arr.length > 1 ? 's' : '') : placeholder)
    : (sel[0] ? sel[0].label : placeholder);
  const filled = multiple ? arr.length > 0 : !!sel[0];

  const close = () => { setOpen(false); setQuery(''); };
  const commit = (v) => {
    onChange && onChange(v);
    if (!multiple) { close(); if (fieldRef.current) fieldRef.current.focus(); }
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      if (e.key === ' ' && typing) return;
      e.preventDefault(); setOpen(true); return;
    }
    if (open && listRef.current && listRef.current.onKeyDown(e)) return;
    if (e.key === 'Tab' && open) close();
  };

  const q = typing ? query : '';
  const known = items.some((o) => o.label.toLowerCase() === q.trim().toLowerCase());
  const extraRow = creatable && q.trim() && !known
    ? React.createElement('div', {
        role: 'option', 'aria-selected': false, onMouseDown: (e) => e.preventDefault(),
        onClick: () => commit(q.trim()),
        style: {
          display: 'flex', alignItems: 'center', gap: 8, minHeight: 44, flexShrink: 0, boxSizing: 'border-box',
          padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
          font: 'var(--type-body)', color: 'var(--text-accent)',
        },
      },
        React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18 } }, 'add'),
        React.createElement('span', null, 'Usar «' + q.trim() + '»'))
    : null;

  // El trigger tambien puede llevar adorno propio: renderOption recibe trigger:true.
  const triggerNode = renderOption && !multiple && sel[0] && !open
    ? renderOption(sel[0], { active: false, selected: true, trigger: true })
    : null;

  const field = typing
    ? React.createElement('input', {
        id, ref: fieldRef, type: 'text',
        role: 'combobox', 'aria-expanded': open, 'aria-controls': lbId,
        'aria-activedescendant': open ? activeId : undefined,
        'aria-invalid': invalid || undefined, 'aria-autocomplete': 'list',
        disabled, placeholder: filled && !open ? undefined : placeholder,
        value: open ? query : (multiple ? (arr.length ? label : '') : (sel[0] ? sel[0].label : '')),
        onChange: (e) => { setQuery(e.target.value); setOpen(true); },
        onMouseDown: () => setOpen(true),
        onKeyDown,
        style: {
          flex: 1, minWidth: 0, alignSelf: 'stretch', border: 'none', outline: 'none', background: 'transparent', padding: 0,
          font: 'var(--type-body)', color: filled || open ? 'var(--text-primary)' : 'var(--text-muted)',
          textOverflow: 'ellipsis',
        },
        ...rest,
      })
    : React.createElement('button', {
        id, ref: fieldRef, type: 'button', disabled,
        role: 'combobox', 'aria-expanded': open, 'aria-controls': lbId, 'aria-haspopup': 'listbox',
        'aria-activedescendant': open ? activeId : undefined, 'aria-invalid': invalid || undefined,
        onClick: () => (open ? close() : setOpen(true)),
        onKeyDown,
        style: {
          flex: 1, minWidth: 0, alignSelf: 'stretch', display: 'flex', alignItems: 'center', gap: 8,
          border: 'none', outline: 'none', background: 'transparent', padding: 0,
          font: 'var(--type-body)', textAlign: 'left', cursor: disabled ? 'not-allowed' : 'pointer',
          color: filled ? 'var(--text-primary)' : 'var(--text-muted)',
        },
        ...rest,
      },
        renderOption && sel[0] ? renderOption(sel[0], { active: false, selected: true, trigger: true })
          : React.createElement('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, label));

  return React.createElement(React.Fragment, null,
    React.createElement(ControlShell, {
      ref: anchorRef, size, invalid, disabled, leading: icon || (typing ? triggerNode : null), style,
      onShellClick: () => { if (!disabled && fieldRef.current) fieldRef.current.focus(); },
      trailing: React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 } },
        clearable && filled && !open && React.createElement('button', {
          type: 'button', 'aria-label': 'Limpiar seleccion',
          // El boton vive en la zona trailing de la carcasa: un control no dibuja
          // nada encima de su propia area.
          onClick: (e) => { e.stopPropagation(); onChange && onChange(multiple ? [] : undefined); },
          style: {
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            // El glifo mide 16px; el area operable, --hit-target-min. Se estira al
            // alto interior de la carcasa en vez de fijar una caja pequena (a11y-2).
            width: 'var(--hit-target-min)', alignSelf: 'stretch', flexShrink: 0,
            border: 'none', borderRadius: 'var(--radius-pill)',
            background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: 0,
          },
        }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 16 } }, 'close')),
        React.createElement('span', {
          className: 'flow-symbol', 'aria-hidden': true,
          style: {
            fontSize: 22, flexShrink: 0, color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform var(--dur-fast) var(--ease-spring)',
          },
        }, 'expand_more')),
    }, field),
    React.createElement(Popover, {
      open, onOpenChange: (v) => (v ? setOpen(true) : close()),
      anchorRef, returnFocusRef: fieldRef, minWidth: 220,
    },
      React.createElement(Listbox, {
        ref: listRef, idPrefix: lbId, items, value, multiple, query: q,
        onSelect: commit, renderItem: renderOption, emptyLabel, extraRow, onActiveIdChange,
      })
    )
  );
}

import React from 'react';

const norm = (o) => (typeof o === 'string' ? { value: o, label: o } : o);

/** La maquina de una lista seleccionable. Ver contracts/listbox.json. */
export const Listbox = React.forwardRef(function Listbox({
  idPrefix = 'flow-lb', items = [], value, onSelect, multiple = false,
  query = '', groupOrder, renderItem, emptyLabel = 'Sin resultados',
  onActiveIdChange, maxHeight = 260, extraRow,
}, ref) {
  const all = items.map(norm);
  const q = String(query || '').trim().toLowerCase();
  const rows = q
    ? all.filter((o) => (o.label + ' ' + o.value + ' ' + (o.hint || '')).toLowerCase().indexOf(q) > -1)
    : all;

  const groups = [];
  if (rows.some((o) => o.group)) {
    const names = groupOrder || Array.from(new Set(rows.map((o) => o.group || '')));
    names.forEach((g) => {
      const inG = rows.filter((o) => (o.group || '') === g);
      if (inG.length) groups.push({ name: g, items: inG });
    });
  } else {
    groups.push({ name: null, items: rows });
  }
  const flat = groups.reduce((a, g) => a.concat(g.items), []);

  const [active, setActive] = React.useState(0);
  const listRef = React.useRef(null);
  const buf = React.useRef({ s: '', t: 0 });
  React.useEffect(() => { setActive(0); }, [query, items.length]);

  const activeId = flat[active] ? idPrefix + '-' + flat[active].value : undefined;
  React.useEffect(() => { onActiveIdChange && onActiveIdChange(activeId); }, [activeId, onActiveIdChange]);

  // lb-4: mantiene visible la fila activa moviendo el scroll del contenedor, nunca la pagina
  React.useEffect(() => {
    const c = listRef.current;
    if (!c) return;
    const el = c.querySelector('[data-active="1"]');
    if (!el) return;
    const t = el.offsetTop, b = t + el.offsetHeight;
    if (t < c.scrollTop) c.scrollTop = t;
    else if (b > c.scrollTop + c.clientHeight) c.scrollTop = b - c.clientHeight;
  }, [active, query]);

  const pick = (item) => {
    if (!item || item.disabled) return;
    if (multiple) {
      const arr = Array.isArray(value) ? value : [];
      onSelect(arr.indexOf(item.value) > -1 ? arr.filter((v) => v !== item.value) : arr.concat([item.value]));
    } else {
      onSelect(item.value);
    }
  };

  React.useImperativeHandle(ref, () => ({
    get activeItem() { return flat[active]; },
    get count() { return flat.length; },
    onKeyDown(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, flat.length - 1)); return true; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); return true; }
      if (e.key === 'Home') { e.preventDefault(); setActive(0); return true; }
      if (e.key === 'End') { e.preventDefault(); setActive(Math.max(0, flat.length - 1)); return true; }
      if (e.key === 'Enter') { e.preventDefault(); pick(flat[active]); return true; }
      // lb-3: typeahead cuando no hay campo de busqueda
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const now = Date.now();
        buf.current.s = now - buf.current.t < 700 ? buf.current.s + e.key : e.key;
        buf.current.t = now;
        const i = flat.findIndex((o) => o.label.toLowerCase().indexOf(buf.current.s.toLowerCase()) === 0);
        if (i > -1) { setActive(i); return true; }
      }
      return false;
    },
  }));

  const isSel = (v) => (multiple ? (Array.isArray(value) ? value.indexOf(v) > -1 : false) : value === v);

  return React.createElement('div', {
    ref: listRef, role: 'listbox', id: idPrefix,
    'aria-multiselectable': multiple || undefined,
    style: { maxHeight, overflowY: 'auto', padding: 6, display: 'flex', flexDirection: 'column', gap: 1 },
  },
    extraRow,
    flat.length === 0 && !extraRow && React.createElement('div', {
      style: { padding: '18px 12px', textAlign: 'center', font: 'var(--type-caption)', color: 'var(--text-muted)' },
    }, emptyLabel),
    groups.map((g) => React.createElement(React.Fragment, { key: g.name || '_' },
      g.name && React.createElement('div', {
        style: { font: 'var(--type-overline)', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)', padding: '10px 12px 4px' },
      }, g.name),
      g.items.map((o) => {
        const i = flat.indexOf(o);
        const sel = isSel(o.value);
        const act = i === active;
        return React.createElement('div', {
          key: o.value, role: 'option', id: idPrefix + '-' + o.value,
          'aria-selected': sel, 'aria-disabled': o.disabled || undefined,
          'data-active': act ? '1' : undefined,
          onMouseEnter: () => setActive(i),
          onMouseDown: (e) => e.preventDefault(),
          onClick: () => pick(o),
          style: {
            display: 'flex', alignItems: 'center', gap: 10,
            minHeight: 44, flexShrink: 0, boxSizing: 'border-box', padding: '10px 12px',
            borderRadius: 'var(--radius-sm)', cursor: o.disabled ? 'not-allowed' : 'pointer',
            font: 'var(--type-body)', opacity: o.disabled ? 0.45 : 1,
            background: act ? 'var(--surface-sunken)' : sel && !multiple ? 'var(--surface-accent-subtle)' : 'transparent',
            color: sel && !multiple ? 'var(--text-accent)' : 'var(--text-primary)',
            fontWeight: sel && !multiple ? 600 : 400,
            transition: 'background var(--dur-instant) var(--ease-out)',
          },
        },
          multiple && React.createElement('span', {
            'aria-hidden': true,
            style: {
              width: 18, height: 18, flexShrink: 0, borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center',
              border: sel ? 'none' : '1.5px solid var(--border-default)',
              background: sel ? 'var(--action-primary)' : 'transparent',
              color: 'var(--text-on-inverse)', fontSize: 14,
            },
          }, sel ? React.createElement('span', { className: 'flow-icon', style: { fontSize: 14 } }, 'check') : null),
          renderItem ? renderItem(o, { active: act, selected: sel })
            : React.createElement('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, o.label),
          // hint se pinta, no solo se filtra: un dato por el que se puede buscar y
          // que no se ve deja al usuario adivinando por que aparecio esa fila.
          !renderItem && o.hint && React.createElement('span', {
            style: { font: 'var(--type-data)', fontSize: 11.5, color: act || sel ? 'var(--text-accent)' : 'var(--text-muted)', flexShrink: 0 },
          }, o.hint),
          !multiple && sel && React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 18, flexShrink: 0 } }, 'check')
        );
      })
    ))
  );
});

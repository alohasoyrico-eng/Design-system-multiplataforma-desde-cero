import React from 'react';
import { OverlayShell } from '../primitives/shells/OverlayShell';

/**
 * Búsqueda global de entidades: agrupa resultados por tipo, navega con teclado,
 * y expone modo 'palette' (overlay ⌘K) o 'inline' (dropdown bajo el input).
 *
 * Los resultados son del contenedor: pasa `results` ya resueltos y `loading`.
 * El componente no busca — orquesta la UI de búsqueda.
 */
export function GlobalSearch({
  mode = 'palette',
  open = false,
  onOpenChange,
  value = '',
  onValueChange,
  results = [],
  groupOrder = [],
  loading = false,
  recents = [],
  onSelect,
  onClearRecents,
  placeholder = 'Busca unidades, conductores, viajes…',
  emptyHint = 'Prueba con una placa, un nombre o un ID de viaje.',
  shortcut = true,
  minChars = 1,
  style,
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);
  const rootRef = React.useRef(null);

  const showRecents = value.length < minChars && recents.length > 0;
  const items = showRecents ? recents : results;

  // agrupa preservando groupOrder, luego alfabético para grupos no listados
  const groups = React.useMemo(() => {
    const by = new Map();
    items.forEach((r) => {
      const g = showRecents ? 'Recientes' : (r.group || 'Otros');
      if (!by.has(g)) by.set(g, []);
      by.get(g).push(r);
    });
    const names = Array.from(by.keys()).sort((a, b) => {
      const ia = groupOrder.indexOf(a);
      const ib = groupOrder.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return names.map((name) => ({ name, items: by.get(name) }));
  }, [items, groupOrder, showRecents]);

  const flat = React.useMemo(() => groups.flatMap((g) => g.items), [groups]);

  React.useEffect(() => { setActiveIndex(0); }, [value, showRecents]);

  // ⌘K / Ctrl+K abre, Escape cierra
  React.useEffect(() => {
    if (!shortcut || mode !== 'palette') return;
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange && onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shortcut, mode, open, onOpenChange]);

  React.useEffect(() => {
    if (mode === 'palette' && open && inputRef.current) inputRef.current.focus();
  }, [mode, open]);

  // click fuera cierra el dropdown inline
  React.useEffect(() => {
    if (mode !== 'inline' || !open) return;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) onOpenChange && onOpenChange(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [mode, open, onOpenChange]);

  function commit(item) {
    if (!item) return;
    onSelect && onSelect(item);
    onOpenChange && onOpenChange(false);
  }

  function onInputKeyDown(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!flat.length) return;
      const dir = e.key === 'ArrowDown' ? 1 : -1;
      const next = (activeIndex + dir + flat.length) % flat.length;
      setActiveIndex(next);
      const node = listRef.current && listRef.current.querySelector('[data-idx="' + next + '"]');
      if (node && node.parentNode) {
        const box = node.parentNode.parentNode;
        if (box && box.scrollTop !== undefined) {
          const top = node.offsetTop;
          if (top < box.scrollTop) box.scrollTop = top - 8;
          else if (top + node.offsetHeight > box.scrollTop + box.clientHeight) {
            box.scrollTop = top + node.offsetHeight - box.clientHeight + 8;
          }
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      commit(flat[activeIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onOpenChange && onOpenChange(false);
    }
  }

  // resalta la coincidencia sin innerHTML
  function highlight(text) {
    if (!value || showRecents) return text;
    const i = String(text).toLowerCase().indexOf(value.toLowerCase());
    if (i === -1) return text;
    return [
      String(text).slice(0, i),
      React.createElement('mark', {
        key: 'm',
        style: { background: 'var(--surface-accent-subtle)', color: 'var(--text-accent)', fontWeight: 700, borderRadius: 3, padding: '0 1px' },
      }, String(text).slice(i, i + value.length)),
      String(text).slice(i + value.length),
    ];
  }

  const searchField = React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap: 10, padding: mode === 'palette' ? '14px 16px' : '0 12px', borderBottom: mode === 'palette' ? '1px solid var(--border-subtle)' : 'none', flex: mode === 'palette' ? 'none' : 1, minWidth: 0 },
  },
    React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 20, color: 'var(--text-muted)', flex: 'none' } }, 'search'),
    React.createElement('input', {
      ref: inputRef,
      type: 'text',
      role: 'combobox',
      'aria-expanded': true,
      'aria-controls': 'flow-search-list',
      'aria-activedescendant': flat[activeIndex] ? 'flow-search-opt-' + activeIndex : undefined,
      'aria-label': placeholder,
      autoComplete: 'off',
      placeholder: placeholder,
      value: value,
      onChange: (e) => onValueChange && onValueChange(e.target.value),
      onKeyDown: onInputKeyDown,
      style: {
        flex: 1, border: 'none', outline: 'none', background: 'transparent',
        fontSize: mode === 'palette' ? 15 : 13, fontFamily: 'inherit',
        color: 'var(--text-primary)', minHeight: 44, padding: 0,
      },
    }),
    value
      ? React.createElement('button', {
          type: 'button', onClick: () => { onValueChange && onValueChange(''); inputRef.current && inputRef.current.focus(); },
          'aria-label': 'Limpiar búsqueda',
          style: { border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4, minWidth: 'var(--hit-target-min)', minHeight: 'var(--hit-target-min)', alignItems: 'center', justifyContent: 'center', flex: 'none' },
        }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18 } }, 'close'))
      : (mode === 'palette' && shortcut && React.createElement('kbd', {
          'aria-hidden': true,
          style: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '2px 6px', flex: 'none' },
        }, '⌘K')));

  let body;
  if (loading) {
    body = React.createElement('div', {
      role: 'status', 'aria-live': 'polite',
      style: { padding: '28px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 13 },
    },
      React.createElement('span', {
        'aria-hidden': true,
        style: { width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--border-subtle)', borderTopColor: 'var(--action-accent)', animation: 'flowSpin 700ms linear infinite' },
      }),
      'Buscando…');
  } else if (!flat.length) {
    body = React.createElement('div', {
      style: { padding: '28px 20px', textAlign: 'center' },
    },
      React.createElement('div', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 28, color: 'var(--text-muted)' } }, value.length >= minChars ? 'search_off' : 'search'),
      React.createElement('p', { style: { margin: '8px 0 2px', fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' } },
        value.length >= minChars ? 'Sin resultados para «' + value + '»' : 'Busca en toda la plataforma'),
      React.createElement('p', { style: { margin: 0, fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 } }, emptyHint));
  } else {
    let idx = -1;
    body = React.createElement('div', {
      id: 'flow-search-list', role: 'listbox', ref: listRef,
      style: { overflowY: 'auto', maxHeight: mode === 'palette' ? 380 : 320, padding: '6px 0' },
    }, groups.map((g) =>
      React.createElement('div', { key: g.name, role: 'group', 'aria-labelledby': 'flow-sg-' + g.name },
        React.createElement('div', {
          id: 'flow-sg-' + g.name,
          style: { padding: '8px 16px 4px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        },
          g.name,
          showRecents && onClearRecents && React.createElement('button', {
            type: 'button', onClick: onClearRecents,
            style: { border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase' },
          }, 'Limpiar')),
        g.items.map((r) => {
          idx += 1;
          const i = idx;
          const active = i === activeIndex;
          return React.createElement('div', {
            key: r.id, id: 'flow-search-opt-' + i, 'data-idx': i,
            role: 'option', 'aria-selected': active,
            onMouseEnter: () => setActiveIndex(i),
            onClick: () => commit(r),
            style: {
              display: 'flex', alignItems: 'center', gap: 12, padding: '9px 16px', cursor: 'pointer',
              minHeight: 44, boxSizing: 'border-box',
              background: active ? 'var(--surface-sunken)' : 'transparent',
            },
          },
            r.icon && React.createElement('span', {
              className: 'flow-symbol', 'aria-hidden': true,
              style: { fontSize: 20, color: active ? 'var(--text-primary)' : 'var(--text-muted)', flex: 'none' },
            }, r.icon),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', {
                style: {
                  fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)',
                  fontFamily: r.mono ? 'var(--font-mono)' : 'inherit',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                },
              }, highlight(r.label)),
              r.meta && React.createElement('div', {
                style: { fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 },
              }, r.meta)),
            r.trailing && React.createElement('div', { style: { flex: 'none' } }, r.trailing),
            active && React.createElement('span', {
              className: 'flow-symbol', 'aria-hidden': true,
              style: { fontSize: 16, color: 'var(--text-muted)', flex: 'none' },
            }, 'keyboard_return'));
        }))));
  }

  const footer = mode === 'palette' && React.createElement('div', {
    style: { display: 'flex', gap: 16, padding: '9px 16px', borderTop: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-secondary)', flex: 'none' },
  },
    React.createElement('span', null, '↑↓ navegar'),
    React.createElement('span', null, '↵ abrir'),
    React.createElement('span', null, 'esc cerrar'));

  if (mode === 'inline') {
    return React.createElement('div', { ref: rootRef, style: { position: 'relative', ...style } },
      React.createElement('div', {
        style: {
          display: 'flex', alignItems: 'center', background: 'var(--surface-sunken)',
          border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
        },
        onFocus: () => onOpenChange && onOpenChange(true),
      }, searchField),
      open && React.createElement('div', {
        style: {
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 60,
          background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-float)', overflow: 'hidden',
          animation: 'flowScaleIn var(--dur-fast) var(--ease-out)', transformOrigin: 'top center',
        },
      }, body));
  }

  return React.createElement(OverlayShell, {
    open, onClose: () => onOpenChange && onOpenChange(false),
    align: 'start', zIndex: 900, label: 'Búsqueda global', backdropStyle: style,
  },
    React.createElement('div', {
      style: {
        width: '100%', maxWidth: 560, background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-overlay)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-body)',
      },
    }, searchField, body, footer));
}

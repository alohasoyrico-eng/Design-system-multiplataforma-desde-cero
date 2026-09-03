import React from 'react';
import { Popover } from '../primitives/shells/Popover';

/** items: [{label, icon?, danger?, disabled?, onClick?}] o 'divider'.
 *  El anclaje, la colision, el portal y Escape los resuelve Popover: este
 *  archivo solo pone los items y su teclado. Ver contracts/popover.json.
 */
export function Menu({ trigger, items = [], align = 'left', style }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const anchorRef = React.useRef(null);
  const itemRefs = React.useRef([]);

  const usable = items
    .map((it, i) => (it !== 'divider' && !it.disabled ? i : -1))
    .filter((i) => i > -1);

  // El foco entra a lo que se abre (a11y-4). Lo mueve Popover con autoFocus,
  // porque solo el shell sabe cuando el panel ya esta colocado y visible.
  React.useEffect(() => { setActive(usable[0] ?? 0); }, [open]);

  const move = (dir) => {
    if (!usable.length) return;
    const at = usable.indexOf(active);
    const next = usable[(at + dir + usable.length) % usable.length];
    setActive(next);
    const el = itemRefs.current[next];
    if (el && el.focus) el.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(usable[0]); itemRefs.current[usable[0]].focus(); }
    else if (e.key === 'End') { e.preventDefault(); const l = usable[usable.length - 1]; setActive(l); itemRefs.current[l].focus(); }
    else if (e.key === 'Tab') setOpen(false);
  };

  const pick = (it) => { setOpen(false); it.onClick && it.onClick(); };

  // alignSelf/alignItems explicitos: como flex item, la raiz se estiraria al alto
  // del contenedor y el disparador con radius-pill se deforma en ovalo.
  return React.createElement('div', { style: { display: 'inline-flex', alignItems: 'center', alignSelf: 'center', ...style } },
    React.createElement('span', {
      ref: anchorRef,
      onClick: () => setOpen((o) => !o),
      style: { display: 'inline-flex', alignItems: 'center' },
      'aria-haspopup': 'menu', 'aria-expanded': open,
    }, trigger),
    React.createElement(Popover, {
      open, onOpenChange: setOpen, anchorRef,
      placement: align === 'right' ? 'bottom-end' : 'bottom-start',
      matchAnchorWidth: false, minWidth: 200, autoFocus: true,
    },
      React.createElement('div', { role: 'menu', onKeyDown, style: { padding: 6 } },
        items.map((it, i) => it === 'divider'
          ? React.createElement('div', { key: i, role: 'separator', style: { height: 1, background: 'var(--border-subtle)', margin: '6px 4px' } })
          : React.createElement('button', {
            key: i, role: 'menuitem', type: 'button', disabled: it.disabled,
            ref: (el) => { itemRefs.current[i] = el; },
            tabIndex: active === i ? 0 : -1,
            onClick: () => pick(it),
            onMouseEnter: () => !it.disabled && setActive(i),
            style: {
              // 44px de alto: el item es un objetivo tactil (a11y-2), no una fila de lista.
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 44, padding: '0 12px',
              border: 'none', borderRadius: 'var(--radius-sm)', textAlign: 'left', cursor: it.disabled ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 500,
              background: active === i && !it.disabled ? (it.danger ? 'var(--status-danger-bg)' : 'var(--surface-sunken)') : 'transparent',
              color: it.danger ? 'var(--status-danger-text)' : 'var(--text-primary)',
              opacity: it.disabled ? 0.45 : 1,
              transition: 'background var(--dur-instant) var(--ease-out)',
            },
          },
            it.icon && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18, color: it.danger ? 'inherit' : 'var(--text-muted)' } }, it.icon),
            it.label)))));
}

import React from 'react';

let uid = 0;

/** Secciones expandibles. Ver contracts/accordion.json. */
export function Accordion({ items = [], defaultOpen, multiple = false, style }) {
  const [open, setOpen] = React.useState(() => new Set(defaultOpen ? [defaultOpen] : []));
  // aria-expanded sin aria-controls anuncia "expandido" sin poder decir que se
  // expandio: hacen falta las dos mitades, y para eso hace falta un id (acc-1).
  const base = React.useId ? React.useId() : 'flow-acc-' + (++uid);
  const toggle = (id) => setOpen(prev => {
    const next = new Set(multiple ? prev : []);
    if (prev.has(id)) { if (multiple) next.delete(id); } else next.add(id);
    return next;
  });
  return React.createElement('div', {
    style: { background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-rest)', fontFamily: 'var(--font-body)', ...style },
  }, items.map((it, i) => {
    const isOpen = open.has(it.id);
    const panelId = base + '-p-' + it.id;
    const cabId = base + '-h-' + it.id;
    return React.createElement('div', { key: it.id, style: { borderBottom: i < items.length - 1 ? '1px solid var(--border-subtle)' : 'none' } },
      React.createElement('button', {
        id: cabId, type: 'button', 'aria-expanded': isOpen, 'aria-controls': panelId,
        onClick: () => toggle(it.id),
        onMouseEnter: (e) => e.currentTarget.style.background = 'var(--surface-sunken)',
        onMouseLeave: (e) => e.currentTarget.style.background = 'transparent',
        style: {
          display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '0 20px',
          border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
          fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
          transition: 'background var(--dur-instant) var(--ease-out)',
        },
      },
        it.icon && React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 20, color: 'var(--text-muted)' } }, it.icon),
        React.createElement('span', { style: { flex: 1 } }, it.title),
        it.meta && React.createElement('span', { style: { fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' } }, it.meta),
        React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 22, color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-base) var(--ease-spring)' } }, 'expand_more')),
      React.createElement('div', {
        id: panelId, role: 'region', 'aria-labelledby': cabId,
        style: { display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows var(--dur-base) var(--ease-out)' },
      }, React.createElement('div', {
        // Cerrado no basta con alto cero: con overflow hidden el contenido sigue
        // en el orden de tabulacion y en la busqueda de la pagina. visibility lo
        // saca de los dos sin romper la animacion de la rejilla (acc-3).
        style: { overflow: 'hidden', visibility: isOpen ? 'visible' : 'hidden' },
      },
        React.createElement('div', { style: { padding: '2px 20px 18px', fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-secondary)' } }, it.content))));
  }));
}

import React from 'react';

/** items: [{label, href?, onClick?}] — last item is the current page */
export function Breadcrumb({ items = [], style }) {
  return React.createElement('nav', { 'aria-label': 'Ruta', style: { fontFamily: 'var(--font-body)', ...style } },
    React.createElement('ol', { style: { display: 'flex', alignItems: 'center', gap: 4, listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' } },
      items.map((it, i) => {
        const last = i === items.length - 1;
        return React.createElement('li', { key: i, style: { display: 'flex', alignItems: 'center', gap: 4 } },
          last
            ? React.createElement('span', { 'aria-current': 'page', style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', minHeight: 'var(--hit-target-min)', padding: '0 6px' } }, it.label)
            : React.createElement('a', {
              href: it.href || '#',
              onClick: it.onClick ? (e) => { e.preventDefault(); it.onClick(); } : undefined,
              style: {
                fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none',
                // El enlace es un objetivo tactil: medía 16px de alto (brc-4).
                display: 'inline-flex', alignItems: 'center', minHeight: 'var(--hit-target-min)',
                padding: '0 6px', borderRadius: 'var(--radius-sm)',
                transition: 'color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
              },
              onMouseEnter: (e) => { e.currentTarget.style.color = 'var(--text-accent)'; e.currentTarget.style.background = 'var(--surface-sunken)'; },
              onMouseLeave: (e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; },
            }, it.label),
          !last && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 16, color: 'var(--flow-ink-300)' } }, 'chevron_right'));
      })));
}

import React from 'react';

/** Bottom tab bar for mobile shells. items: [{id, icon, label, badge?}] */
export function TabBar({ items = [], activeId, onChange, style }) {
  return React.createElement('nav', {
    'aria-label': 'Navegación principal',
    style: {
      position: 'sticky', bottom: 0, display: 'flex',
      background: 'var(--surface-card)', borderTop: '1px solid var(--border-subtle)',
      padding: '6px 8px calc(6px + env(safe-area-inset-bottom))', fontFamily: 'var(--font-body)',
      ...style,
    },
  }, items.map(it => {
    const active = it.id === activeId;
    return React.createElement('button', {
      key: it.id, type: 'button', 'aria-current': active ? 'page' : undefined,
      onClick: () => onChange && onChange(it.id),
      style: {
        flex: 1, minHeight: 52, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 2, border: 'none', background: 'transparent', cursor: 'pointer',
        fontFamily: 'inherit', position: 'relative',
        color: active ? 'var(--text-accent)' : 'var(--text-muted)',
        transition: 'color var(--dur-fast) var(--ease-out)',
      },
    },
      React.createElement('span', { style: { position: 'relative', display: 'inline-flex' } },
        React.createElement('span', {
          className: 'flow-symbol' + (active ? ' flow-symbol--fill' : ''), 'aria-hidden': true,
          style: { fontSize: 24, display: 'block', transform: active ? 'scale(1.12)' : 'none', transition: 'transform var(--dur-fast) var(--ease-spring)' },
        }, it.icon),
        it.badge && React.createElement('span', {
          'aria-hidden': true,
          style: {
            position: 'absolute', top: -2, right: -6, minWidth: 15, height: 15, borderRadius: 999,
            background: 'var(--action-accent)', color: 'var(--text-on-accent)', fontSize: 9.5, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', boxSizing: 'border-box',
          },
        }, typeof it.badge === 'number' ? (it.badge > 9 ? '9+' : it.badge) : '')),
      React.createElement('span', { style: { fontSize: 10.5, fontWeight: active ? 700 : 500 } }, it.label));
  }));
}

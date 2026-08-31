import React from 'react';
import { OverlayShell } from '../primitives/shells/OverlayShell';

let uid = 0;

export function Drawer({ open = false, onClose, title, children, footer, width = 400, side = 'right', style }) {
  const titleId = React.useRef('flow-drw-' + (++uid)).current;
  return React.createElement(OverlayShell, {
    open, onClose, align: side === 'right' ? 'end' : 'side-start', zIndex: 95,
    labelledBy: typeof title === 'string' ? titleId : undefined,
    label: typeof title === 'string' ? undefined : 'Panel',
  },
    React.createElement('aside', {
      style: {
        width, maxWidth: '92vw', height: '100%', boxSizing: 'border-box',
        background: 'var(--surface-card)', boxShadow: 'var(--shadow-overlay)',
        borderRadius: side === 'right' ? '28px 0 0 28px' : '0 28px 28px 0',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-body)', color: 'var(--text-primary)', ...style,
      },
    },
      React.createElement('header', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '22px 24px 14px', flex: 'none' } },
        React.createElement('div', { id: titleId, style: { flex: 1, fontSize: 17, fontWeight: 700, letterSpacing: 'var(--tracking-tight)' } }, title),
        onClose && React.createElement('button', {
          type: 'button', 'aria-label': 'Cerrar', onClick: onClose,
          style: { width: 'var(--hit-target-min)', height: 'var(--hit-target-min)', border: 'none', background: 'transparent', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--dur-instant) var(--ease-out)' },
          onMouseEnter: (e) => e.currentTarget.style.background = 'var(--surface-sunken)',
          onMouseLeave: (e) => e.currentTarget.style.background = 'transparent',
        }, React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 20 } }, 'close'))),
      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '4px 24px 24px' } }, children),
      footer && React.createElement('footer', { style: { flex: 'none', padding: '14px 24px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 10 } }, footer)));
}

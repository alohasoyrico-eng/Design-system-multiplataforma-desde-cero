import React from 'react';
import { OverlayShell } from '../primitives/shells/OverlayShell';

let uid = 0;

export function Dialog({ open = false, onClose, title, description, children, actions, width = 440, tone, style }) {
  const titleId = React.useRef('flow-dlg-' + (++uid)).current;
  const toneIcon = { danger: ['warning', 'var(--status-danger)', 'var(--status-danger-bg)'], success: ['check_circle', 'var(--status-success-text)', 'var(--status-success-bg)'] }[tone];

  return React.createElement(OverlayShell, {
    open, onClose, align: 'center',
    labelledBy: typeof title === 'string' ? titleId : undefined,
    label: typeof title === 'string' ? undefined : 'Diálogo',
  },
    React.createElement('div', {
      style: {
        background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', width, maxWidth: '100%',
        boxShadow: 'var(--shadow-overlay)', padding: 28, boxSizing: 'border-box',
        fontFamily: 'var(--font-body)', color: 'var(--text-primary)', ...style,
      },
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 14 } },
        toneIcon && React.createElement('span', {
          style: { width: 44, height: 44, borderRadius: '50%', background: toneIcon[2], display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' },
        }, React.createElement('span', { className: 'flow-symbol flow-symbol--fill', 'aria-hidden': true, style: { fontSize: 24, color: toneIcon[1] } }, toneIcon[0])),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          title && React.createElement('div', { id: titleId, style: { fontSize: 18, fontWeight: 700, letterSpacing: 'var(--tracking-tight)' } }, title),
          description && React.createElement('div', { style: { fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55, marginTop: 6 } }, description)),
        onClose && React.createElement('button', {
          type: 'button', 'aria-label': 'Cerrar', onClick: onClose,
          style: { width: 'var(--hit-target-min)', height: 'var(--hit-target-min)', flex: 'none', border: 'none', background: 'transparent', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--dur-instant) var(--ease-out)', margin: '-6px -6px 0 0' },
          onMouseEnter: (e) => e.currentTarget.style.background = 'var(--surface-sunken)',
          onMouseLeave: (e) => e.currentTarget.style.background = 'transparent',
        }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 20 } }, 'close'))),
      children && React.createElement('div', { style: { marginTop: 18 } }, children),
      actions && React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 } }, actions)));
}

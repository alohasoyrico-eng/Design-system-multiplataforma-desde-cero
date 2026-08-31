import React from 'react';
import { OverlayShell } from '../primitives/shells/OverlayShell';

let uid = 0;

/** Sheet movil con asa. fixed=false para vivir dentro de un contenedor relativo (marco de telefono). */
export function BottomSheet({ open = false, onClose, title, children, height = 'auto', fixed = true, style }) {
  const titleId = React.useRef('flow-bs-' + (++uid)).current;
  return React.createElement(OverlayShell, {
    open, onClose, align: 'bottom', fixed, zIndex: 96,
    labelledBy: typeof title === 'string' ? titleId : undefined,
    label: typeof title === 'string' ? undefined : 'Panel',
  },
    React.createElement('section', {
      style: {
        background: 'var(--surface-card)', borderRadius: '28px 28px 0 0', boxShadow: 'var(--shadow-overlay)',
        maxHeight: '86%', height, display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-body)', color: 'var(--text-primary)', ...style,
      },
    },
      React.createElement('button', {
        type: 'button', 'aria-label': 'Cerrar', onClick: onClose,
        style: { border: 'none', background: 'transparent', padding: 0, minHeight: 'var(--hit-target-min)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' },
      }, React.createElement('span', { 'aria-hidden': true, style: { width: 40, height: 5, borderRadius: 999, background: 'var(--border-default)' } })),
      title && React.createElement('div', { id: titleId, style: { padding: '6px 24px 12px', fontSize: 17, fontWeight: 700, letterSpacing: 'var(--tracking-tight)', flex: 'none' } }, title),
      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '0 24px 28px' } }, children)));
}

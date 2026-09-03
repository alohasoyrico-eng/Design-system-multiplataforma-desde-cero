import React from 'react';

const TONES = {
  neutral: { icon: 'info', color: 'var(--text-on-inverse)' },
  success: { icon: 'check_circle', color: 'var(--status-success)' },
  warning: { icon: 'warning', color: 'var(--status-warning)' },
  danger: { icon: 'error', color: 'var(--status-danger)' },
};

export function Toast({ tone = 'neutral', message, actionLabel, onAction, onDismiss, style }) {
  const t = TONES[tone] || TONES.neutral;
  return React.createElement('div', {
    role: 'status',
    style: {
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'var(--surface-inverse)', color: 'var(--text-on-inverse)',
      borderRadius: 'var(--radius-lg)', padding: '14px 18px', minWidth: 280, maxWidth: 420,
      boxShadow: 'var(--shadow-overlay)', fontFamily: 'var(--font-body)', fontSize: 13.5,
      animation: 'flowIn var(--dur-base) var(--ease-spring)', ...style,
    },
  },
    React.createElement('span', { className: 'flow-symbol flow-symbol--fill', 'aria-hidden': true, style: { fontSize: 20, color: t.color, flex: 'none' } }, t.icon),
    React.createElement('span', { style: { flex: 1, lineHeight: 1.45 } }, message),
    actionLabel && React.createElement('button', {
      type: 'button', onClick: onAction,
      style: { border: 'none', background: 'transparent', color: 'var(--text-accent-on-inverse)', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '6px 8px', borderRadius: 8, whiteSpace: 'nowrap' },
    }, actionLabel),
    onDismiss && React.createElement('button', {
      type: 'button', 'aria-label': 'Cerrar aviso', onClick: onDismiss,
      style: { border: 'none', background: 'transparent', color: 'inherit', opacity: 0.6, cursor: 'pointer', display: 'inline-flex', padding: 4, borderRadius: '50%' },
    }, React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18 } }, 'close')));
}

/** Fixed-position stack, bottom center. */
export function ToastStack({ children, style }) {
  return React.createElement('div', {
    style: { position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 90, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', ...style },
  }, children);
}

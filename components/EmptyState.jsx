import React from 'react';

export function EmptyState({ icon = 'inbox', title, description, action, style }) {
  return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 8, padding: '40px 24px', textAlign: 'center', fontFamily: 'var(--font-body)', ...style,
    },
  },
    React.createElement('span', {
      style: {
        width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-sunken)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
      },
    }, React.createElement('span', { className: 'flow-icon', 'aria-hidden': true, style: { fontSize: 30, color: 'var(--text-muted)' } }, icon)),
    title && React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }, title),
    description && React.createElement('div', { style: { fontSize: 13, color: 'var(--text-muted)', maxWidth: 340, lineHeight: 1.55 } }, description),
    action && React.createElement('div', { style: { marginTop: 10 } }, action));
}

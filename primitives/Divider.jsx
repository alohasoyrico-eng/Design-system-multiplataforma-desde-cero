import React from 'react';

/** Content separator. Optional centered label splits the line ("O", "12 mar"). Vertical for inline groups (toolbars). */
export function Divider({ orientation = 'horizontal', label, style }) {
  if (orientation === 'vertical') {
    return React.createElement('span', {
      role: 'separator', 'aria-orientation': 'vertical',
      style: { display: 'inline-block', width: 1, alignSelf: 'stretch', background: 'var(--border-subtle)', ...style },
    });
  }
  if (!label) {
    return React.createElement('hr', {
      role: 'separator',
      style: { border: 'none', height: 1, background: 'var(--border-subtle)', margin: 0, width: '100%', ...style },
    });
  }
  return React.createElement('div', {
    role: 'separator', 'aria-label': label,
    style: {
      display: 'flex', alignItems: 'center', gap: 12, width: '100%', color: 'var(--text-muted)',
      fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', ...style,
    },
  },
    React.createElement('span', { style: { flex: 1, height: 1, background: 'var(--border-subtle)' } }),
    React.createElement('span', null, label),
    React.createElement('span', { style: { flex: 1, height: 1, background: 'var(--border-subtle)' } }));
}

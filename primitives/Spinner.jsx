import React from 'react';

export function Spinner({ size = 24, color = 'var(--action-accent)', label = 'Cargando', style }) {
  return React.createElement('span', {
    role: 'status', 'aria-label': label,
    style: {
      display: 'inline-block', width: size, height: size, flex: 'none',
      border: Math.max(2, size / 9) + 'px solid var(--border-subtle)',
      borderTopColor: color, borderRadius: '50%',
      animation: 'flowSpin .7s linear infinite', ...style,
    },
  });
}

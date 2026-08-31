import React from 'react';

/** steps: [{label, description?}] · current: 0-based index */
export function Stepper({ steps = [], current = 0, orientation = 'horizontal', style }) {
  const horiz = orientation === 'horizontal';
  return React.createElement('ol', {
    style: {
      display: 'flex', flexDirection: horiz ? 'row' : 'column', alignItems: horiz ? 'flex-start' : 'stretch',
      gap: horiz ? 0 : 4, listStyle: 'none', margin: 0, padding: 0, fontFamily: 'var(--font-body)', ...style,
    },
  },
    // El progreso se dice en texto para quien no ve los circulos: aria-current
    // marca el paso, pero "paso 2 de 4" es lo que se puede oir (stp-1).
    React.createElement('span', {
      style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' },
    }, 'Paso ' + (current + 1) + ' de ' + steps.length + (steps[current] ? ': ' + (steps[current].label || '') : '')),
  steps.map((s, i) => {
    const done = i < current, active = i === current;
    const dot = React.createElement('span', {
      'aria-hidden': true,
      style: {
        width: 30, height: 30, borderRadius: '50%', flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: done ? 'var(--action-accent)' : active ? 'var(--surface-inverse)' : 'var(--surface-card)',
        color: done || active ? 'var(--text-on-inverse)' : 'var(--text-muted)',
        border: done || active ? 'none' : '1.5px solid var(--border-default)',
        fontSize: 13, fontWeight: 700,
        boxShadow: active ? 'var(--shadow-accent-glow)' : 'none',
        transform: active ? 'scale(1.1)' : 'scale(1)',
        transition: 'all var(--dur-base) var(--ease-spring)',
      },
    }, done ? React.createElement('span', { className: 'flow-icon', style: { fontSize: 16, animation: 'flowScaleIn var(--dur-fast) var(--ease-spring)' } }, 'check') : i + 1);
    const text = React.createElement('span', { style: { display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 } },
      React.createElement('span', { style: { fontSize: 13, fontWeight: active ? 700 : 500, color: active || done ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' } }, s.label),
      s.description && React.createElement('span', { style: { fontSize: 11.5, color: 'var(--text-muted)' } }, s.description));
    const connector = i < steps.length - 1 && React.createElement('span', {
      'aria-hidden': true,
      style: horiz
        ? { flex: 1, height: 2, margin: '14px 10px 0', borderRadius: 999, background: i < current ? 'var(--action-accent)' : 'var(--border-default)', minWidth: 24, transition: 'background var(--dur-base) var(--ease-out)' }
        : { width: 2, height: 22, margin: '2px 0 2px 14px', borderRadius: 999, background: i < current ? 'var(--action-accent)' : 'var(--border-default)', transition: 'background var(--dur-base) var(--ease-out)' },
    });
    return React.createElement(React.Fragment, { key: i },
      React.createElement('li', {
        'aria-current': active ? 'step' : undefined,
        style: { display: 'flex', alignItems: 'center', gap: 10, flexDirection: horiz ? 'column' : 'row', textAlign: horiz ? 'center' : 'left', flex: 'none' },
      }, dot, text),
      connector);
  }));
}

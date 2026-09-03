import React from 'react';
import { ToggleControl } from './shells/ToggleControl';

export function Switch({ checked = false, onChange, label, disabled = false, style }) {
  return React.createElement(ToggleControl, {
    type: 'switch', checked, onChange, label, disabled, style,
    renderIndicator: (s) => React.createElement('span', {
      'aria-hidden': true,
      style: {
        width: 48, height: 28, borderRadius: 999, padding: 3, boxSizing: 'border-box', display: 'flex',
        background: s.checked ? 'var(--action-accent)' : 'var(--border-strong)',
        boxShadow: s.focus ? 'var(--focus-ring)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      },
    }, React.createElement('span', {
      style: {
        width: s.press ? 26 : 22, height: 22, borderRadius: 'var(--radius-pill)', background: 'var(--surface-card)',
        boxShadow: 'var(--shadow-thumb)',
        transform: s.checked ? 'translateX(' + (s.press ? 16 : 20) + 'px)' : 'none',
        transition: 'transform var(--dur-fast) var(--ease-spring), width var(--dur-instant) var(--ease-out)',
      },
    })),
  });
}

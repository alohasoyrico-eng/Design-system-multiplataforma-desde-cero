import React from 'react';
import { ToggleControl } from './shells/ToggleControl';

export function Radio({ name, value, checked = false, onChange, label, description, disabled = false, style }) {
  return React.createElement(ToggleControl, {
    type: 'radio', name, value, checked, onChange, label, description, disabled, style,
    renderIndicator: (s) => React.createElement('span', {
      'aria-hidden': true,
      style: {
        width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--surface-card)',
        border: s.checked ? '1.5px solid var(--action-accent)' : '1.5px solid ' + (s.hover ? 'var(--border-strong)' : 'var(--border-default)'),
        boxShadow: s.focus ? 'var(--focus-ring)' : 'none',
        transform: s.hover && !s.disabled ? 'var(--hover-scale)' : 'none',
        transition: 'all var(--dur-fast) var(--ease-spring)',
      },
    }, React.createElement('span', {
      style: {
        width: 11, height: 11, borderRadius: '50%', background: 'var(--action-accent)',
        transform: s.checked ? 'scale(1)' : 'scale(0)',
        transition: 'transform var(--dur-fast) var(--ease-spring)',
      },
    })),
  });
}
